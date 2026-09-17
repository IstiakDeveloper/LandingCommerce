import { prisma } from "@/lib/db";
import { toShopPublic, toProductPublic } from "@/lib/shop";
import { LANDING_TEMPLATES } from "@/lib/landing/templates";
import { LandingTemplateRenderer } from "@/components/shop/LandingTemplateRenderer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopSlug: string; landingSlug: string }>;
}): Promise<Metadata> {
  const { shopSlug, landingSlug } = await params;
  const lp = await prisma.landingPage.findFirst({
    where: { slug: landingSlug, shop: { slug: shopSlug } },
    include: { shop: true, product: true },
  });

  if (!lp) return { title: "HaatLink" };
  return {
    title: `${lp.title} — ${lp.shop.name}`,
    description: lp.subheadline || `${lp.shop.name} এর বিশেষ অফার।`,
  };
}

export default async function LandingPageRoute({
  params,
}: {
  params: Promise<{ shopSlug: string; landingSlug: string }>;
}) {
  const { shopSlug, landingSlug } = await params;

  const lp = await prisma.landingPage.findFirst({
    where: { slug: landingSlug, shop: { slug: shopSlug } },
    include: { shop: true, product: true },
  });

  if (!lp) notFound();

  const shopPublic = toShopPublic(lp.shop);
  const productPublic = lp.product ? toProductPublic(lp.product) : null;
  const templateConfig =
    LANDING_TEMPLATES.find((t) => t.id === lp.template) ?? LANDING_TEMPLATES[0];

  return (
    <LandingTemplateRenderer
      landingPage={{
        id: lp.id,
        title: lp.title,
        slug: lp.slug,
        headline: lp.headline,
        subheadline: lp.subheadline,
        template: lp.template,
        features: JSON.parse(lp.features || "[]"),
      }}
      shop={shopPublic}
      product={productPublic}
      templateConfig={templateConfig}
    />
  );
}
