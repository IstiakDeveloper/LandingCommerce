/** Shared-schema multi-tenancy: every shop row is scoped by shopId. */

export function requireShopId(shop: { id: string } | null | undefined) {
  if (!shop?.id) return null;
  return shop.id;
}

export function shopScope(shopId: string) {
  return { shopId } as const;
}

export function ownedByShop<T extends { shopId: string }>(row: T | null, shopId: string) {
  if (!row || row.shopId !== shopId) return null;
  return row;
}
