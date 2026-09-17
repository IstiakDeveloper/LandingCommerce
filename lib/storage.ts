export const ADDRESS_KEY = "hl_last_address";

export type SavedAddress = {
  name: string;
  phone: string;
  isDhaka: boolean;
  district: string | null;
  districtId?: string;
  upazilaId?: string;
  upazilaName?: string;
  unionId?: string;
  unionName?: string;
  address: string;
  landmark: string;
};

export function loadAddress(): SavedAddress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    return raw ? (JSON.parse(raw) as SavedAddress) : null;
  } catch {
    return null;
  }
}

export function saveAddress(addr: SavedAddress) {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(addr));
}

export function loadLocale(): "bn" | "en" {
  if (typeof window === "undefined") return "bn";
  return localStorage.getItem("hl_locale") === "en" ? "en" : "bn";
}

export function saveLocale(locale: "bn" | "en") {
  localStorage.setItem("hl_locale", locale);
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
}
