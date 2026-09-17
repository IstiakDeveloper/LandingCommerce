import { NextRequest, NextResponse } from "next/server";
import {
  getAllDistricts,
  getUpazilasByDistrict,
  getUnionsByUpazila,
  addCustomUnion,
} from "@/lib/geo/bd-locations";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "districts") {
    const districts = getAllDistricts();
    return NextResponse.json({ ok: true, data: districts });
  }

  if (type === "upazilas") {
    const districtId = searchParams.get("districtId");
    if (!districtId) {
      return NextResponse.json({ ok: false, error: "districtId is required" }, { status: 400 });
    }
    const upazilas = getUpazilasByDistrict(districtId);
    return NextResponse.json({ ok: true, data: upazilas });
  }

  if (type === "unions") {
    const upazilaId = searchParams.get("upazilaId");
    if (!upazilaId) {
      return NextResponse.json({ ok: false, error: "upazilaId is required" }, { status: 400 });
    }
    const unions = getUnionsByUpazila(upazilaId);
    return NextResponse.json({ ok: true, data: unions });
  }

  return NextResponse.json({ ok: false, error: "Invalid type" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { upazilaId, upazilaName, districtName, unionName } = body;

    if (!upazilaId || !unionName || !String(unionName).trim()) {
      return NextResponse.json(
        { ok: false, error: "upazilaId and unionName are required" },
        { status: 400 }
      );
    }

    const created = addCustomUnion({
      upazilaId: String(upazilaId),
      upazilaName: upazilaName ? String(upazilaName) : undefined,
      districtName: districtName ? String(districtName) : undefined,
      unionName: String(unionName).trim(),
    });

    return NextResponse.json({ ok: true, data: created });
  } catch (err) {
    console.error("Error creating custom union", err);
    return NextResponse.json({ ok: false, error: "Failed to add union" }, { status: 500 });
  }
}
