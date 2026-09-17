"use server";

import { requireSeller } from "@/lib/auth";
import { reverseOrderFee } from "@/lib/billing/ledger";
import { prisma } from "@/lib/db";
import { fillTemplate, normalizePhone } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const FLOW: Record<string, string[]> = {
  new: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function setOrderStatus(orderId: string, status: string) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  const order = await prisma.order.findFirst({
    where: { id: orderId, shopId: user.shop.id },
  });
  if (!order) return { error: "missing" };
  const allowed = FLOW[order.status] ?? [];
  if (!allowed.includes(status)) return { error: "flow" };

  if (status === "cancelled" && (order.status === "new" || order.status === "confirmed")) {
    const items = await prisma.orderItem.findMany({ where: { orderId } });
    await prisma.$transaction([
      ...items.map((it) =>
        prisma.product.update({
          where: { id: it.productId },
          data: { stock: { increment: it.qty } },
        }),
      ),
      prisma.order.update({ where: { id: orderId }, data: { status } }),
    ]);
    if (order.status === "new" || order.status === "confirmed") {
      await reverseOrderFee(user.shop.id, orderId);
    }
  } else {
    await prisma.order.update({ where: { id: orderId }, data: { status } });
  }
  revalidatePath("/app");
  revalidatePath("/app/orders");
  return { ok: true };
}

export async function saveOrderNote(orderId: string, note: string) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  await prisma.order.updateMany({
    where: { id: orderId, shopId: user.shop.id },
    data: { sellerNote: note },
  });
  return { ok: true };
}

export async function blockPhone(orderId: string) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  const order = await prisma.order.findFirst({
    where: { id: orderId, shopId: user.shop.id },
  });
  if (!order) return { error: "missing" };
  await prisma.blockedPhone.upsert({
    where: { shopId_phone: { shopId: user.shop.id, phone: normalizePhone(order.phone) } },
    update: {},
    create: { shopId: user.shop.id, phone: normalizePhone(order.phone) },
  });
  return { ok: true };
}

export async function confirmTemplateText(orderId: string) {
  const user = await requireSeller();
  if (!user?.shop) return { error: "auth" };
  const order = await prisma.order.findFirst({
    where: { id: orderId, shopId: user.shop.id },
  });
  if (!order) return { error: "missing" };
  const tpl = await prisma.messageTemplate.findUnique({
    where: { shopId_key: { shopId: user.shop.id, key: "confirm" } },
  });
  const body = fillTemplate(tpl?.body ?? "অর্ডার {code} কনফার্ম।", {
    name: order.customerName,
    code: order.code,
  });
  return { ok: true, phone: order.phone, body };
}
