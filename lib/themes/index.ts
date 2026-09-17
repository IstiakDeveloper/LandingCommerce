import type { CSSProperties } from "react";

export type ThemeId =
  | "shada-dokaan"
  | "fashion-studio"
  | "rongin-saj"
  | "rannaghor"
  | "gadget-dark"
  | "shishu"
  | "sonar-haar"
  | "khamar"
  | "flash-sale"
  | "puran-dhaka";

export type ShopTheme = {
  id: ThemeId;
  nameBn: string;
  nameEn: string;
  category: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  primary: string;
  primaryText: string;
  accent: string;
  radius: string;
};

export const THEMES: ShopTheme[] = [
  {
    id: "shada-dokaan",
    nameBn: "সাদা দোকান",
    nameEn: "Shada Dokaan",
    category: "general",
    bg: "#F7F7F4",
    surface: "#FFFFFF",
    text: "#1A1A1A",
    muted: "#6B6B6B",
    primary: "#1F7A4D",
    primaryText: "#FFFFFF",
    accent: "#E8F3EC",
    radius: "16px",
  },
  {
    id: "fashion-studio",
    nameBn: "ফ্যাশন স্টুডিও",
    nameEn: "Fashion Studio",
    category: "fashion",
    bg: "#F4EFE8",
    surface: "#FFFbf7",
    text: "#1C1410",
    muted: "#7A6A5C",
    primary: "#1C1410",
    primaryText: "#F4EFE8",
    accent: "#E6D5C3",
    radius: "8px",
  },
  {
    id: "rongin-saj",
    nameBn: "রঙিন সাজ",
    nameEn: "Rongin Saj",
    category: "makeup",
    bg: "#FBF3F6",
    surface: "#FFFFFF",
    text: "#4A2A38",
    muted: "#8B6B78",
    primary: "#C45B7A",
    primaryText: "#FFFFFF",
    accent: "#F8DDE6",
    radius: "22px",
  },
  {
    id: "rannaghor",
    nameBn: "রান্নাঘর",
    nameEn: "Rannaghor",
    category: "food",
    bg: "#FFF6EE",
    surface: "#FFFFFF",
    text: "#3B1F14",
    muted: "#8A5A44",
    primary: "#C4451D",
    primaryText: "#FFFFFF",
    accent: "#FAD7C8",
    radius: "14px",
  },
  {
    id: "gadget-dark",
    nameBn: "গ্যাজেট ডার্ক",
    nameEn: "Gadget Dark",
    category: "gadget",
    bg: "#0E1116",
    surface: "#1A1F27",
    text: "#F2F5F8",
    muted: "#9AA3B2",
    primary: "#3DDC97",
    primaryText: "#0E1116",
    accent: "#24302C",
    radius: "12px",
  },
  {
    id: "shishu",
    nameBn: "শিশু",
    nameEn: "Shishu",
    category: "kids",
    bg: "#F3FBFF",
    surface: "#FFFFFF",
    text: "#1E3A5F",
    muted: "#5E7A99",
    primary: "#3B82C4",
    primaryText: "#FFFFFF",
    accent: "#D6EEFF",
    radius: "24px",
  },
  {
    id: "sonar-haar",
    nameBn: "সোনার হার",
    nameEn: "Sonar Haar",
    category: "jewelry",
    bg: "#1A0E10",
    surface: "#2A1618",
    text: "#F8E7C8",
    muted: "#C4A574",
    primary: "#C9A227",
    primaryText: "#1A0E10",
    accent: "#3D2420",
    radius: "10px",
  },
  {
    id: "khamar",
    nameBn: "খামার",
    nameEn: "Khamar",
    category: "farm",
    bg: "#F3F6EE",
    surface: "#FFFFFF",
    text: "#243022",
    muted: "#66715F",
    primary: "#4A7C3F",
    primaryText: "#FFFFFF",
    accent: "#DCE8D4",
    radius: "18px",
  },
  {
    id: "flash-sale",
    nameBn: "ফ্ল্যাশ সেল",
    nameEn: "Flash Sale",
    category: "sale",
    bg: "#FFF8E8",
    surface: "#FFFFFF",
    text: "#1A1A1A",
    muted: "#6B5A20",
    primary: "#E11D2E",
    primaryText: "#FFFFFF",
    accent: "#FFE566",
    radius: "6px",
  },
  {
    id: "puran-dhaka",
    nameBn: "পুরান ঢাকা",
    nameEn: "Puran Dhaka",
    category: "craft",
    bg: "#F6EBE3",
    surface: "#FFF8F2",
    text: "#3B2216",
    muted: "#8A6454",
    primary: "#B85A32",
    primaryText: "#FFF8F2",
    accent: "#E8C9B0",
    radius: "4px",
  },
];

export const CATEGORIES = [
  { id: "fashion", icon: "👗", bn: "ফ্যাশন", en: "Fashion", theme: "fashion-studio" as ThemeId },
  { id: "makeup", icon: "💄", bn: "মেকআপ", en: "Makeup", theme: "rongin-saj" as ThemeId },
  { id: "food", icon: "🍛", bn: "খাবার", en: "Food", theme: "rannaghor" as ThemeId },
  { id: "gadget", icon: "📱", bn: "গ্যাজেট", en: "Gadget", theme: "gadget-dark" as ThemeId },
  { id: "kids", icon: "🧸", bn: "শিশু", en: "Kids", theme: "shishu" as ThemeId },
  { id: "jewelry", icon: "💍", bn: "জুয়েলারি", en: "Jewelry", theme: "sonar-haar" as ThemeId },
  { id: "farm", icon: "🌿", bn: "খামার", en: "Farm", theme: "khamar" as ThemeId },
  { id: "general", icon: "🏪", bn: "জেনারেল", en: "General", theme: "shada-dokaan" as ThemeId },
] as const;

export function getTheme(id: string): ShopTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function themeStyle(theme: ShopTheme): CSSProperties {
  return {
    "--shop-bg": theme.bg,
    "--shop-surface": theme.surface,
    "--shop-text": theme.text,
    "--shop-muted": theme.muted,
    "--shop-primary": theme.primary,
    "--shop-primary-text": theme.primaryText,
    "--shop-accent": theme.accent,
    "--shop-radius": theme.radius,
    background: theme.bg,
    color: theme.text,
  } as CSSProperties;
}
