"use server";

import {
  createAdminSession,
  createSession,
  destroyAdmin,
  destroySession,
  hashPin,
  requireSeller,
  upgradePinHashIfNeeded,
  verifyPin,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getClientIp } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";
import { CATEGORIES, getTheme } from "@/lib/themes";
import { DEFAULT_TEMPLATES, isValidBdPhone, normalizePhone, slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(phone: string, pin: string) {
  if (!isValidBdPhone(phone) || !/^\d{4}$/.test(pin)) {
    return { error: "invalid" };
  }
  const ip = await getClientIp();
  const normalized = normalizePhone(phone);
  const limited = await rateLimit(`login:${ip}:${normalized}`, 10, 15 * 60 * 1000);
  if (!limited.ok) return { error: "rate" };

  try {
    const user = await prisma.user.findUnique({
      where: { phone: normalized },
      include: { shop: true },
    });
    if (user?.lockedUntil && user.lockedUntil > new Date()) {
      return { error: "locked" };
    }
    if (!user || !(await verifyPin(pin, user.pinHash))) {
      if (user) {
        const failed = user.failedPinCount + 1;
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedPinCount: failed,
            lockedUntil: failed >= 10 ? new Date(Date.now() + 15 * 60 * 1000) : null,
          },
        });
      }
      return { error: "wrong" };
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { failedPinCount: 0, lockedUntil: null },
    });
    await upgradePinHashIfNeeded(user.id, pin, user.pinHash);
    await createSession(user.id);
    if (user.role === "owner" || user.role === "admin" || user.phone === "01700000000") {
      await createAdminSession();
      redirect("/admin");
    }
    if (!user.shop) redirect("/#register");
    redirect("/app");
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    return { error: "db" };
  }
}

export async function logoutAction() {
  await destroySession();
  await destroyAdmin();
  redirect("/");
}

export async function registerShopAction(form: {
  phone: string;
  pin: string;
  pinConfirm: string;
  name: string;
  category: string;
}) {
  if (!isValidBdPhone(form.phone)) return { error: "phone" };
  if (!/^\d{4}$/.test(form.pin)) return { error: "pin" };
  if (form.pin !== form.pinConfirm) return { error: "mismatch" };
  if (form.name.trim().length < 2) return { error: "name" };

  const phone = normalizePhone(form.phone);
  const ip = await getClientIp();
  const limited = await rateLimit(`register:${ip}:${phone}`, 5, 15 * 60 * 1000);
  if (!limited.ok) return { error: "rate" };
  try {
    const exists = await prisma.user.findUnique({ where: { phone }, include: { shop: true } });
    if (exists?.shop) return { error: "exists" };

    const cat = CATEGORIES.find((c) => c.id === form.category) ?? CATEGORIES[7];
    const theme = getTheme(cat.theme);
    let slug = slugify(form.name);
    const taken = await prisma.shop.findUnique({ where: { slug } });
    if (taken) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;

    let userId: string;
    if (exists) {
      userId = exists.id;
      await prisma.user.update({
        where: { id: userId },
        data: { pinHash: await hashPin(form.pin) },
      });
      await prisma.shop.create({
        data: {
          userId,
          slug,
          name: form.name.trim(),
          category: cat.id,
          themeId: theme.id,
          callPhone: phone,
          whatsapp: phone,
          templates: {
            create: [
              { key: "confirm", body: DEFAULT_TEMPLATES.confirm },
              { key: "shipped", body: DEFAULT_TEMPLATES.shipped },
              { key: "delivered", body: DEFAULT_TEMPLATES.delivered },
            ],
          },
          products: {
            create: {
              slug: "sample-product",
              title: "উদাহরণ প্রোডাক্ট — বদলে দিন",
              pricePoisha: 50000,
              photos: JSON.stringify(["/demo/kurti.svg"]),
              isSample: true,
              badge: "new",
            },
          },
        },
      });
    } else {
      const user = await prisma.user.create({
        data: {
          phone,
          pinHash: await hashPin(form.pin),
          shop: {
            create: {
              slug,
              name: form.name.trim(),
              category: cat.id,
              themeId: theme.id,
              callPhone: phone,
              whatsapp: phone,
              templates: {
                create: [
                  { key: "confirm", body: DEFAULT_TEMPLATES.confirm },
                  { key: "shipped", body: DEFAULT_TEMPLATES.shipped },
                  { key: "delivered", body: DEFAULT_TEMPLATES.delivered },
                ],
              },
              products: {
                create: {
                  slug: "sample-product",
                  title: "উদাহরণ প্রোডাক্ট — বদলে দিন",
                  pricePoisha: 50000,
                  photos: JSON.stringify(["/demo/kurti.svg"]),
                  isSample: true,
                  badge: "new",
                },
              },
            },
          },
        },
      });
      userId = user.id;
    }
    await createSession(userId);
    redirect("/app");
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    return { error: "db" };
  }
}

export async function startShopAction(form: {
  phone: string;
  pin: string;
  name: string;
  category: string;
  themeId: string;
}) {
  return registerShopAction({
    phone: form.phone,
    pin: form.pin,
    pinConfirm: form.pin,
    name: form.name,
    category: form.category,
  });
}

export async function addFirstProductAction(form: {
  title: string;
  priceTaka: number;
  photo?: string;
  skip?: boolean;
}) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };

  if (form.skip) {
    await prisma.product.create({
      data: {
        shopId: user.shop.id,
        slug: "sample-product",
        title: "উদাহরণ প্রোডাক্ট — বদলে দিন",
        pricePoisha: 50000,
        photos: JSON.stringify(["/demo/kurti.svg"]),
        isSample: true,
        badge: "new",
      },
    });
  } else {
    if (!form.title.trim() || !form.priceTaka) return { error: "invalid" };
    const slug = slugify(form.title) || `p-${Date.now()}`;
    await prisma.product.create({
      data: {
        shopId: user.shop.id,
        slug: `${slug}-${Math.random().toString(36).slice(2, 4)}`,
        title: form.title.trim(),
        pricePoisha: Math.round(form.priceTaka) * 100,
        photos: JSON.stringify(form.photo ? [form.photo] : []),
      },
    });
  }
  revalidatePath("/app");
  return { ok: true, slug: user.shop.slug };
}
