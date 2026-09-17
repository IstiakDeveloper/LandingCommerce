import { requireSeller } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ShopSettings } from "@/components/app/ShopSettings";
import { getShopBalance } from "@/lib/billing/ledger";
import { redirect } from "next/navigation";

export default async function ShopPage() {
  const user = await requireSeller();
  if (!user) redirect("/login");
  if (!user.shop) redirect("/#register");

  const [templates, landingPages, products, balance] = await Promise.all([
    prisma.messageTemplate.findMany({
      where: { shopId: user.shop.id },
    }),
    prisma.landingPage.findMany({
      where: { shopId: user.shop.id },
      orderBy: { createdAt: "desc" },
      include: { product: true },
    }),
    prisma.product.findMany({
      where: { shopId: user.shop.id, active: true },
      select: { id: true, title: true, pricePoisha: true },
    }),
    getShopBalance(user.shop.id),
  ]);

  const s = user.shop;
  return (
    <ShopSettings
      shop={{
        name: s.name,
        slug: s.slug,
        themeId: s.themeId,
        cover: s.cover,
        avatar: s.avatar,
        fbPageUrl: s.fbPageUrl,
        whatsapp: s.whatsapp,
        callPhone: s.callPhone,
        bkashNumber: s.bkashNumber,
        nagadNumber: s.nagadNumber,
        dhakaFeePoisha: s.dhakaFeePoisha,
        outsideFeePoisha: s.outsideFeePoisha,
        freeOverPoisha: s.freeOverPoisha,
        advanceEnabled: s.advanceEnabled,
        advancePoisha: s.advancePoisha,
        paused: s.paused,
        language: s.language,
        fontScale: user.fontScale,
        templates,
      }}
      landingPages={landingPages}
      products={products}
      balance={balance}
    />
  );
}
