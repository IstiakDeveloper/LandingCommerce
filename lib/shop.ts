import { prisma } from "@/lib/db";
import type { ProductPublic, ShopPublic } from "@/lib/types";
import type { Product, Shop } from "@/generated/prisma";
import { cacheGet, cacheSet, shopCacheKey } from "@/lib/cache";

export function toShopPublic(shop: Shop): ShopPublic {
  return {
    id: shop.id,
    slug: shop.slug,
    name: shop.name,
    themeId: shop.themeId,
    cover: shop.cover,
    avatar: shop.avatar,
    fbPageUrl: shop.fbPageUrl,
    whatsapp: shop.whatsapp,
    callPhone: shop.callPhone,
    bkashNumber: shop.bkashNumber,
    nagadNumber: shop.nagadNumber,
    dhakaFeePoisha: shop.dhakaFeePoisha,
    outsideFeePoisha: shop.outsideFeePoisha,
    freeOverPoisha: shop.freeOverPoisha,
    advanceEnabled: shop.advanceEnabled,
    advancePoisha: shop.advancePoisha,
    paused: shop.paused,
    language: shop.language,
  };
}

export function toProductPublic(p: Product): ProductPublic {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    pricePoisha: p.pricePoisha,
    compareAtPoisha: p.compareAtPoisha,
    photos: JSON.parse(p.photos || "[]") as string[],
    stock: p.stock,
    badge: p.badge,
    variants: JSON.parse(p.variants || "[]"),
    isSample: p.isSample,
  };
}

export async function getShopBySlug(slug: string) {
  const key = shopCacheKey(slug);
  const cached = await cacheGet(key);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as {
        shop: ShopPublic;
        products: ProductPublic[];
      } | null;
      if (!parsed) return null;
      return parsed;
    } catch {
      /* fall through */
    }
  }

  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: { products: { orderBy: { createdAt: "desc" } } },
  });
  if (!shop || shop.disabled) {
    await cacheSet(key, "null", 10);
    return null;
  }
  const products = shop.products.filter((p) => {
    if (!p.active) return false;
    if (p.hideWhenZero && p.stock <= 0) return false;
    return true;
  });
  const result = { shop: toShopPublic(shop), products: products.map(toProductPublic) };
  await cacheSet(key, JSON.stringify(result), 30);
  return result;
}

export function deliveryFee(
  shop: ShopPublic,
  isDhaka: boolean,
  subtotal: number,
) {
  if (shop.freeOverPoisha && subtotal >= shop.freeOverPoisha) return 0;
  return isDhaka ? shop.dhakaFeePoisha : shop.outsideFeePoisha;
}
