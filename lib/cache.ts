import { redis } from "./redis";

export async function cacheGet(key: string) {
  try {
    return await (await redis()).get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds = 30) {
  try {
    await (await redis()).set(key, value, { ex: ttlSeconds });
  } catch {
    /* cache is optional */
  }
}

export async function cacheDel(key: string) {
  try {
    await (await redis()).del(key);
  } catch {
    /* cache is optional */
  }
}

export function shopCacheKey(slug: string) {
  return `shop:${slug}`;
}

export async function invalidateShopCache(slug: string) {
  await cacheDel(shopCacheKey(slug));
}
