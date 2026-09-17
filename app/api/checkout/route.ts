import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { invalidateShopCache } from "@/lib/cache";
import { recordOrderFeeInTx, PLATFORM_FEE_POISHA } from "@/lib/billing/ledger";
import { ipFromHeaders } from "@/lib/http";
import { logError } from "@/lib/logger";
import { rateLimit } from "@/lib/rateLimit";
import { deliveryFee, toShopPublic } from "@/lib/shop";
import { shopScope } from "@/lib/tenant";
import { generateOrderCode, isValidBdPhone, normalizePhone } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = ipFromHeaders(req.headers);
  const ipLimit = await rateLimit(`order:ip:${ip}`, 8, 10 * 60 * 1000);
  if (!ipLimit.ok) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ error: "bot" }, { status: 400 });
  }

  const phone = normalizePhone(String(body.phone ?? ""));
  const phoneLimit = await rateLimit(`order:phone:${phone}`, 5, 10 * 60 * 1000);
  if (phone && !phoneLimit.ok) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }

  const shopSlug = String(body.shopSlug ?? "");
  const shop = await prisma.shop.findUnique({ where: { slug: shopSlug } });
  if (!shop || shop.disabled) {
    return NextResponse.json({ error: "shop" }, { status: 404 });
  }
  if (shop.paused) {
    return NextResponse.json({ error: "paused" }, { status: 400 });
  }

  if (!isValidBdPhone(phone) || !String(body.name ?? "").trim() || !String(body.address ?? "").trim()) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const blocked = await prisma.blockedPhone.findUnique({
    where: { shopId_phone: { shopId: shop.id, phone } },
  });
  if (blocked) {
    return NextResponse.json({ error: "blocked" }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: { id: String(body.productId ?? ""), ...shopScope(shop.id), active: true },
  });
  if (!product) return NextResponse.json({ error: "product" }, { status: 404 });

  const qty = Math.max(1, Math.min(20, Number(body.qty) || 1));
  if (product.stock < qty) {
    return NextResponse.json({ error: "stock" }, { status: 400 });
  }

  if (!body.confirmDuplicate) {
    const tenMin = new Date(Date.now() - 10 * 60 * 1000);
    const dup = await prisma.order.findFirst({
      where: {
        ...shopScope(shop.id),
        phone,
        createdAt: { gte: tenMin },
        items: { some: { productId: product.id } },
      },
    });
    if (dup) {
      return NextResponse.json({ duplicate: true });
    }
  }

  const isDhaka = !!body.isDhaka;
  const subtotal = product.pricePoisha * qty;
  const shopPublic = toShopPublic(shop);
  const fee = deliveryFee(shopPublic, isDhaka, subtotal);
  const payMethod = ["cod", "bkash", "nagad", "advance"].includes(String(body.payMethod))
    ? String(body.payMethod)
    : "cod";
  const advance = payMethod === "advance" && shop.advanceEnabled ? shop.advancePoisha : 0;
  const total = subtotal + fee;
  const variant = body.variant ? String(body.variant) : null;
  const idempotencyKey = body.idempotencyKey ? String(body.idempotencyKey).slice(0, 80) : null;

  if (idempotencyKey) {
    const existing = await prisma.order.findUnique({ where: { idempotencyKey } });
    if (existing && existing.shopId === shop.id) {
      return NextResponse.json({ ok: true, code: existing.code, id: existing.id });
    }
  }

  let code = generateOrderCode();
  for (let i = 0; i < 5; i++) {
    const clash = await prisma.order.findUnique({ where: { code } });
    if (!clash) break;
    code = generateOrderCode();
  }

  const settings = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  const platformFee = shop.slug === "demo" ? 0 : (settings?.feePerOrderPoisha ?? PLATFORM_FEE_POISHA);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: qty } },
      });
      if (updated.stock < 0) throw new Error("stock");
      const createdOrder = await tx.order.create({
        data: {
          shopId: shop.id,
          code,
          customerName: String(body.name).trim(),
          phone,
          isDhaka,
          district: isDhaka ? "dhaka" : String(body.district || ""),
          address: String(body.address).trim(),
          landmark: body.landmark ? String(body.landmark) : null,
          geoLat: body.geoLat != null ? Number(body.geoLat) : null,
          geoLng: body.geoLng != null ? Number(body.geoLng) : null,
          payMethod,
          trxId: body.trxId ? String(body.trxId) : null,
          screenshotUrl: body.screenshotUrl ? String(body.screenshotUrl) : null,
          advancePoisha: advance,
          deliveryFeePoisha: fee,
          subtotalPoisha: subtotal,
          totalPoisha: total,
          platformFeePoisha: platformFee,
          idempotencyKey,
          items: {
            create: {
              productId: product.id,
              title: product.title,
              variant,
              qty,
              pricePoisha: product.pricePoisha,
            },
          },
        },
      });

      if (platformFee > 0) {
        await recordOrderFeeInTx(tx, shop.id, createdOrder.id, `fee_${createdOrder.id}`, platformFee);
      }

      return createdOrder;
    });

    await invalidateShopCache(shop.slug);
    return NextResponse.json({ ok: true, code: order.code, id: order.id });
  } catch (err) {
    logError(err, { route: "checkout", shop: shop.slug });
    return NextResponse.json({ error: "stock" }, { status: 400 });
  }
}
