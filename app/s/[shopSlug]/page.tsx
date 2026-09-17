import { getShopBySlug } from "@/lib/shop";
import { ShopHome } from "@/components/shop/ShopRenderer";
import { MultiLandingDemo } from "@/components/shop/MultiLandingDemo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}): Promise<Metadata> {
  const { shopSlug } = await params;
  if (shopSlug === "demo") {
    return {
      title: "হাটলিংক — মাল্টি-ল্যান্ডিং পেজ ডেমো হাব",
      description: "সিঙ্গেল হিরো, ফ্ল্যাশ সেল, কম্বো বান্ডল ও গ্যাজেট ল্যান্ডিং পেজ ডেমো দেখুন।",
    };
  }
  const data = await getShopBySlug(shopSlug);
  if (!data) return { title: "HaatLink" };
  return {
    title: data.shop.name,
    openGraph: {
      title: data.shop.name,
      images: data.shop.cover ? [data.shop.cover] : undefined,
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}) {
  const { shopSlug } = await params;
  if (shopSlug === "demo") {
    return <MultiLandingDemo />;
  }
  const data = await getShopBySlug(shopSlug);
  if (!data) notFound();
  return <ShopHome shop={data.shop} products={data.products} />;
}
