export function takaToPoisha(taka: number) {
  return Math.round(taka) * 100;
}

export function poishaToTaka(poisha: number) {
  return Math.round(poisha / 100);
}

export function formatTaka(poisha: number) {
  return `৳${poishaToTaka(poisha)}`;
}

export function generateOrderCode(date = new Date()) {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `HL-${y}${m}${d}-${rand}`;
}

export function slugify(input: string) {
  const ascii = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (ascii.length >= 3) return ascii.slice(0, 40);
  return `shop-${Math.random().toString(36).slice(2, 8)}`;
}

export const BD_PHONE = /^01[3-9]\d{8}$/;

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("880") && digits.length === 13) return digits.slice(2);
  return digits;
}

export function isValidBdPhone(raw: string) {
  return BD_PHONE.test(normalizePhone(raw));
}

export function waLink(phone: string, text: string) {
  const p = normalizePhone(phone);
  const intl = p.startsWith("0") ? `88${p}` : p;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string) {
  return `tel:+88${normalizePhone(phone)}`;
}

export const DEFAULT_TEMPLATES = {
  confirm:
    "আসসালামু আলাইকুম {name}, আপনার অর্ডার কনফার্ম হলো। অর্ডার নম্বর: {code}। ২ দিনের মধ্যে পাবেন ইনশাআল্লাহ।",
  shipped: "আপনার অর্ডার {code} পাঠানো হয়েছে। শীঘ্রই পৌঁছাবে।",
  delivered: "আপনার অর্ডার {code} পৌঁছেছে। দোকানদারি থেকে কিনার জন্য ধন্যবাদ।",
};

export function fillTemplate(
  body: string,
  vars: { name?: string; code?: string },
) {
  return body
    .replaceAll("{name}", vars.name ?? "")
    .replaceAll("{code}", vars.code ?? "");
}
