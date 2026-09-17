export function parseCaption(raw: string): { title: string; priceTaka: number | null } {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return { title: "", priceTaka: null };

  const priceMatch = text.match(/(?:tk|taka|৳)?\s*(\d{2,6})\s*(?:tk|taka|৳)?/i);
  let priceTaka: number | null = null;
  let title = text;

  if (priceMatch && priceMatch[1]) {
    priceTaka = Number(priceMatch[1]);
    title = text.replace(priceMatch[0], "").replace(/[-–—:|]+/g, " ").trim();
  }

  title = title.replace(/\s+/g, " ").trim();
  return { title, priceTaka };
}
