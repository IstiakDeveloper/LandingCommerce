import fs from "fs";
import path from "path";

export interface GeoDistrict {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  lat?: string;
  lon?: string;
}

export interface GeoUpazila {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
}

export interface GeoUnion {
  id: string;
  upazilla_id: string;
  name: string;
  bn_name: string;
  isCustom?: boolean;
}

interface CustomUnionRecord {
  id?: string;
  division?: string;
  district?: string;
  upazila?: string;
  upazilla_id?: string;
  name: string;
  bn_name?: string;
}

// In-memory cache
let districtsCache: GeoDistrict[] | null = null;
let upazilasCache: GeoUpazila[] | null = null;
let unionsCache: GeoUnion[] | null = null;
let upazilasByDistrict: Map<string, GeoUpazila[]> | null = null;
let unionsByUpazila: Map<string, GeoUnion[]> | null = null;

function loadGeoData() {
  if (districtsCache && upazilasCache && unionsCache) {
    return;
  }

  const baseDir = path.join(process.cwd(), "locations");

  // Load districts
  try {
    const districtsRaw = JSON.parse(
      fs.readFileSync(path.join(baseDir, "districts.json"), "utf8")
    );
    const dTable = districtsRaw.find((x: { type: string; data?: GeoDistrict[] }) => x.type === "table");
    districtsCache = (dTable?.data || []).map((d: GeoDistrict) => ({
      id: String(d.id),
      division_id: String(d.division_id),
      name: d.name,
      bn_name: d.bn_name,
      lat: d.lat,
      lon: d.lon,
    }));
  } catch (err) {
    console.error("Failed to load districts.json", err);
    districtsCache = [];
  }

  // Load upazilas
  try {
    const upazilasRaw = JSON.parse(
      fs.readFileSync(path.join(baseDir, "upazilas.json"), "utf8")
    );
    const uTable = upazilasRaw.find((x: { type: string; data?: GeoUpazila[] }) => x.type === "table");
    const upazilas: GeoUpazila[] = (uTable?.data || []).map((u: GeoUpazila) => ({
      id: String(u.id),
      district_id: String(u.district_id),
      name: u.name,
      bn_name: u.bn_name,
    }));
    upazilasCache = upazilas;

    upazilasByDistrict = new Map();
    for (const u of upazilas) {
      const list = upazilasByDistrict.get(u.district_id) || [];
      list.push(u);
      upazilasByDistrict.set(u.district_id, list);
    }
  } catch (err) {
    console.error("Failed to load upazilas.json", err);
    upazilasCache = [];
    upazilasByDistrict = new Map();
  }

  // Load unions
  try {
    const unionsRaw = JSON.parse(
      fs.readFileSync(path.join(baseDir, "unions.json"), "utf8")
    );
    const unTable = unionsRaw.find((x: { type: string; data?: GeoUnion[] }) => x.type === "table");
    const unions: GeoUnion[] = (unTable?.data || []).map((un: GeoUnion) => ({
      id: String(un.id),
      upazilla_id: String(un.upazilla_id),
      name: un.name,
      bn_name: un.bn_name,
    }));

    // Load custom unions
    let customUnions: CustomUnionRecord[] = [];
    try {
      customUnions = JSON.parse(
        fs.readFileSync(path.join(baseDir, "unions_custom.json"), "utf8")
      );
    } catch {
      customUnions = [];
    }

    for (const c of customUnions) {
      if (c.name) {
        unions.push({
          id: c.id || `custom-${c.name}`,
          upazilla_id: String(c.upazilla_id || ""),
          name: c.name,
          bn_name: c.bn_name || c.name,
          isCustom: true,
        });
      }
    }
    unionsCache = unions;

    unionsByUpazila = new Map();
    for (const un of unions) {
      if (!un.upazilla_id) continue;
      const list = unionsByUpazila.get(un.upazilla_id) || [];
      list.push(un);
      unionsByUpazila.set(un.upazilla_id, list);
    }
  } catch (err) {
    console.error("Failed to load unions.json", err);
    unionsCache = [];
    unionsByUpazila = new Map();
  }
}

export function getAllDistricts(): GeoDistrict[] {
  loadGeoData();
  return districtsCache || [];
}

export function getUpazilasByDistrict(districtId: string): GeoUpazila[] {
  loadGeoData();
  return upazilasByDistrict?.get(String(districtId)) || [];
}

export function getUnionsByUpazila(upazilaId: string): GeoUnion[] {
  loadGeoData();
  return unionsByUpazila?.get(String(upazilaId)) || [];
}

export function addCustomUnion({
  upazilaId,
  upazilaName,
  districtName,
  unionName,
}: {
  upazilaId: string;
  upazilaName?: string;
  districtName?: string;
  unionName: string;
}): GeoUnion {
  loadGeoData();

  const trimmed = unionName.trim();
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const newUnion: GeoUnion = {
    id,
    upazilla_id: String(upazilaId),
    name: trimmed,
    bn_name: trimmed,
    isCustom: true,
  };

  // Add to in-memory list & map
  unionsCache?.push(newUnion);
  const existing = unionsByUpazila?.get(String(upazilaId)) || [];
  existing.push(newUnion);
  unionsByUpazila?.set(String(upazilaId), existing);

  // Persist to unions_custom.json
  try {
    const filePath = path.join(process.cwd(), "locations", "unions_custom.json");
    let customList: CustomUnionRecord[] = [];
    if (fs.existsSync(filePath)) {
      try {
        customList = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch {
        customList = [];
      }
    }
    customList.push({
      id,
      upazilla_id: String(upazilaId),
      upazila: upazilaName,
      district: districtName,
      name: trimmed,
      bn_name: trimmed,
    });
    fs.writeFileSync(filePath, JSON.stringify(customList, null, 4), "utf8");
  } catch (err) {
    console.error("Failed to write to unions_custom.json", err);
  }

  return newUnion;
}
