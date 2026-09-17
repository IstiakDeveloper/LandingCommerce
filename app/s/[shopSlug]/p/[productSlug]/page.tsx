import { getShopBySlug } from "@/lib/shop";
import { ProductView } from "@/components/shop/ShopRenderer";
import { formatTaka } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopSlug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { shopSlug, productSlug } = await params;
  const data = await getShopBySlug(shopSlug);
  const product = data?.products.find((p) => p.slug === productSlug);
  if (!data || !product) return { title: "HaatLink" };
  return {
    title: `${product.title} · ${formatTaka(product.pricePoisha)}`,
    description: `${data.shop.name}`,
    openGraph: {
      title: `${product.title} · ${formatTaka(product.pricePoisha)} · ${data.shop.name}`,
      images: product.photos[0] ? [product.photos[0]] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ shopSlug: string; productSlug: string }>;
}) {
  const { shopSlug, productSlug } = await params;
  const data = await getShopBySlug(shopSlug);
  const product = data?.products.find((p) => p.slug === productSlug);
  if (!data || !product) notFound();
  return <ProductView shop={data.shop} product={product} />;
}
