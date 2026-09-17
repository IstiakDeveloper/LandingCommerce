export type VariantGroup = { name: string; options: string[] };

export type ProductPublic = {
  id: string;
  slug: string;
  title: string;
  pricePoisha: number;
  compareAtPoisha: number | null;
  photos: string[];
  stock: number;
  badge: string | null;
  variants: VariantGroup[];
  isSample?: boolean;
};

export type ShopPublic = {
  id: string;
  slug: string;
  name: string;
  themeId: string;
  cover: string | null;
  avatar: string | null;
  fbPageUrl: string | null;
  whatsapp: string | null;
  callPhone: string | null;
  bkashNumber: string | null;
  nagadNumber: string | null;
  dhakaFeePoisha: number;
  outsideFeePoisha: number;
  freeOverPoisha: number | null;
  advanceEnabled: boolean;
  advancePoisha: number;
  paused: boolean;
  language: string;
};
