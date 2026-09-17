import { headers } from "next/headers";

export function ipFromHeaders(h: Headers) {
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "local";
}

export async function getClientIp() {
  return ipFromHeaders(await headers());
}
