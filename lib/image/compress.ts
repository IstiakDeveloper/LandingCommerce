export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.72,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("compress"))),
      "image/jpeg",
      quality,
    );
  });
  return blob;
}

export async function uploadCompressed(file: File) {
  const blob = await compressImage(file);
  const body = new FormData();
  body.append("file", blob, "photo.jpg");
  const res = await fetch("/api/upload", { method: "POST", body });
  if (!res.ok) throw new Error("upload failed");
  const data = (await res.json()) as { url: string };
  return data.url;
}
