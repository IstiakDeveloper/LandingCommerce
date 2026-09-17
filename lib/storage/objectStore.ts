import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { logger } from "../logger";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2_000_000;

export function storageMode() {
  return process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID ? "s3" : "local";
}

function s3() {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

export function assertImageUpload(file: File) {
  if (file.size > MAX_BYTES) return "too-big" as const;
  const type = file.type || "image/jpeg";
  if (!ALLOWED.has(type)) return "type" as const;
  return null;
}

function objectKey(ext: string) {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 10);
  return `uploads/${y}/${m}/${Date.now()}-${rand}.${ext}`;
}

function extFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function saveUpload(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = extFor(file.type || "image/jpeg");
  const key = objectKey(ext);

  if (storageMode() === "s3") {
    const bucket = process.env.S3_BUCKET!;
    await s3().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buf,
        ContentType: file.type || "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    const base = (process.env.S3_PUBLIC_URL || "").replace(/\/$/, "");
    const url = base ? `${base}/${key}` : `https://${bucket}.s3.amazonaws.com/${key}`;
    logger.info({ key, storage: "s3" }, "upload");
    return url;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = path.basename(key);
  await writeFile(path.join(dir, name), buf);
  logger.info({ name, storage: "local" }, "upload");
  return `/uploads/${name}`;
}
