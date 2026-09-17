"use server";

import { requireSeller } from "@/lib/auth";
import { invalidateShopCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { THEMES } from "@/lib/themes";
import { revalidatePath } from "next/cache";

export async function updateShopAction(form: {
  name?: string;
  themeId?: string;
  cover?: string | null;
  avatar?: string | null;
  fbPageUrl?: string;
  whatsapp?: string;
  callPhone?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  dhakaFeeTaka?: number;
  outsideFeeTaka?: number;
  freeOverTaka?: number | null;
  advanceEnabled?: boolean;
  advanceTaka?: number;
  paused?: boolean;
  language?: string;
  templates?: { key: string; body: string }[];
}) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };

  const data: Record<string, unknown> = {};
  if (form.name) data.name = form.name.trim();
  if (form.themeId && THEMES.some((t) => t.id === form.themeId)) data.themeId = form.themeId;
  if (form.cover !== undefined) data.cover = form.cover;
  if (form.avatar !== undefined) data.avatar = form.avatar;
  if (form.fbPageUrl !== undefined) data.fbPageUrl = form.fbPageUrl;
  if (form.whatsapp !== undefined) data.whatsapp = form.whatsapp;
  if (form.callPhone !== undefined) data.callPhone = form.callPhone;
  if (form.bkashNumber !== undefined) data.bkashNumber = form.bkashNumber;
  if (form.nagadNumber !== undefined) data.nagadNumber = form.nagadNumber;
  if (form.dhakaFeeTaka !== undefined) data.dhakaFeePoisha = Math.round(form.dhakaFeeTaka) * 100;
  if (form.outsideFeeTaka !== undefined) data.outsideFeePoisha = Math.round(form.outsideFeeTaka) * 100;
  if (form.freeOverTaka !== undefined) {
    data.freeOverPoisha = form.freeOverTaka ? Math.round(form.freeOverTaka) * 100 : null;
  }
  if (form.advanceEnabled !== undefined) data.advanceEnabled = form.advanceEnabled;
  if (form.advanceTaka !== undefined) data.advancePoisha = Math.round(form.advanceTaka) * 100;
  if (form.paused !== undefined) data.paused = form.paused;
  if (form.language) data.language = form.language;

  await prisma.shop.update({ where: { id: user.shop.id }, data });

  if (form.templates) {
    for (const t of form.templates) {
      await prisma.messageTemplate.upsert({
        where: { shopId_key: { shopId: user.shop.id, key: t.key } },
        update: { body: t.body },
        create: { shopId: user.shop.id, key: t.key, body: t.body },
      });
    }
  }

  if (form.language || form.paused !== undefined) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(form.language ? { locale: form.language } : {}),
      },
    });
  }

  revalidatePath("/app/shop");
  revalidatePath(`/s/${user.shop.slug}`);
  await invalidateShopCache(user.shop.slug);
  return { ok: true };
}

export async function setFontScale(scale: "normal" | "large") {
  const user = await requireSeller();
  if (!user) return { error: "auth" };
  await prisma.user.update({ where: { id: user.id }, data: { fontScale: scale } });
  revalidatePath("/app");
  return { ok: true };
}

export async function createLandingPageAction(form: {
  title: string;
  template: string;
  productId?: string;
  headline?: string;
  subheadline?: string;
}) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };

  const slug = `lp-${Date.now().toString(36)}`;
  await prisma.landingPage.create({
    data: {
      shopId: user.shop.id,
      slug,
      title: form.title.trim() || "নতুন ল্যান্ডিং পেজ",
      template: form.template || "single-hero",
      productId: form.productId || null,
      headline: form.headline?.trim() || null,
      subheadline: form.subheadline?.trim() || null,
      isActive: true,
    },
  });

  revalidatePath("/app/shop");
  return { ok: true, slug };
}

export async function deleteLandingPageAction(id: string) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  await prisma.landingPage.deleteMany({ where: { id, shopId: user.shop.id } });
  revalidatePath("/app/shop");
  return { ok: true };
}

export async function toggleLandingPageAction(id: string, active: boolean) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  await prisma.landingPage.updateMany({
    where: { id, shopId: user.shop.id },
    data: { isActive: active },
  });
  revalidatePath("/app/shop");
  return { ok: true };
}
