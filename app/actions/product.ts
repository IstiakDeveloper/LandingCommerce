"use server";

import { requireSeller } from "@/lib/auth";
import { invalidateShopCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function saveProductAction(form: {
  id?: string;
  title: string;
  priceTaka: number;
  compareAtTaka?: number | null;
  photos: string[];
  stock: number;
  badge?: string | null;
  variants?: { name: string; options: string[] }[];
  hideWhenZero?: boolean;
  active?: boolean;
}) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  if (!form.title.trim() || form.priceTaka <= 0) return { error: "invalid" };

  const data = {
    title: form.title.trim(),
    pricePoisha: Math.round(form.priceTaka) * 100,
    compareAtPoisha: form.compareAtTaka ? Math.round(form.compareAtTaka) * 100 : null,
    photos: JSON.stringify(form.photos.slice(0, 4)),
    stock: Math.max(0, form.stock),
    badge: form.badge || null,
    variants: JSON.stringify(form.variants ?? []),
    hideWhenZero: !!form.hideWhenZero,
    active: form.active !== false,
    isSample: false,
  };

  if (form.id) {
    await prisma.product.updateMany({
      where: { id: form.id, shopId: user.shop.id },
      data,
    });
  } else {
    await prisma.product.create({
      data: {
        ...data,
        shopId: user.shop.id,
        slug: `${slugify(form.title)}-${Math.random().toString(36).slice(2, 4)}`,
      },
    });
  }
  revalidatePath("/app/products");
  revalidatePath(`/s/${user.shop.slug}`);
  await invalidateShopCache(user.shop.slug);
  return { ok: true };
}

export async function duplicateProductAction(id: string) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  const p = await prisma.product.findFirst({ where: { id, shopId: user.shop.id } });
  if (!p) return { error: "missing" };
  await prisma.product.create({
    data: {
      shopId: user.shop.id,
      slug: `${p.slug}-copy-${Math.random().toString(36).slice(2, 4)}`,
      title: `${p.title} কপি`,
      pricePoisha: p.pricePoisha,
      compareAtPoisha: p.compareAtPoisha,
      photos: p.photos,
      stock: p.stock,
      badge: p.badge,
      variants: p.variants,
      hideWhenZero: p.hideWhenZero,
    },
  });
  revalidatePath("/app/products");
  await invalidateShopCache(user.shop.slug);
  return { ok: true };
}

export async function deleteProductAction(id: string) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  await prisma.product.updateMany({
    where: { id, shopId: user.shop.id },
    data: { active: false },
  });
  revalidatePath("/app/products");
  revalidatePath(`/s/${user.shop.slug}`);
  await invalidateShopCache(user.shop.slug);
  return { ok: true };
}
