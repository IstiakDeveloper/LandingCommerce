import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/auth";
import { ipFromHeaders } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";
import { assertImageUpload, saveUpload } from "@/lib/storage/objectStore";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = ipFromHeaders(req.headers);
  const seller = await requireSeller();
  const limit = await rateLimit(seller ? `upload:shop:${seller.shop?.id}` : `upload:ip:${ip}`, 20, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file" }, { status: 400 });
  }
  const invalid = assertImageUpload(file);
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 });
  }

  try {
    const url = await saveUpload(file);
    return NextResponse.json({ url });
  } catch (err) {
    logError(err, { route: "upload" });
    return NextResponse.json({ error: "upload" }, { status: 500 });
  }
}
