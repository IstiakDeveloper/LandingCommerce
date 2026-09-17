import { prisma } from "@/lib/db";
import { ThanksClient } from "@/components/shop/ThanksClient";
import { notFound } from "next/navigation";

export default async function OrderThanksPage({
  params,
}: {
  params: Promise<{ shopSlug: string; orderId: string }>;
}) {
  const { shopSlug, orderId } = await params;
  const order = await prisma.order.findFirst({
    where: { id: orderId, shop: { slug: shopSlug } },
    include: { shop: true },
  });
  if (!order) notFound();
  return (
    <ThanksClient
      code={order.code}
      shopName={order.shop.name}
      shopSlug={shopSlug}
      callPhone={order.shop.callPhone}
      whatsapp={order.shop.whatsapp}
    />
  );
}
