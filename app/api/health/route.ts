import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { redisBackend, redisPing } from "@/lib/redis";
import { storageMode } from "@/lib/storage/objectStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let db = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = true;
  } catch {
    db = false;
  }
  const redis = await redisPing();
  const ok = db;
  return NextResponse.json(
    {
      ok,
      db,
      redis,
      redisBackend: redisBackend(),
      storage: storageMode(),
    },
    { status: ok ? 200 : 503 },
  );
}
