import { redis } from "./redis";

export async function rateLimit(
  key: string,
  limit = 8,
  windowMs = 10 * 60 * 1000,
) {
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const bucket = `rl:${key}`;
  try {
    const r = await redis();
    const count = await r.incr(bucket);
    if (count === 1) await r.expire(bucket, windowSec);
    if (count > limit) return { ok: false as const, remaining: 0 };
    return { ok: true as const, remaining: Math.max(0, limit - count) };
  } catch {
    return { ok: true as const, remaining: limit };
  }
}
