import { prisma } from "@/lib/db";
import type { PrismaClient } from "@/generated/prisma";

type Tx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;

export const PLATFORM_FEE_POISHA = 500; // ৳5 per order
export const DUE_CAP_POISHA = 50000; // ৳500 due cap triggers pause

export interface ShopBalance {
  totalOrders: number;
  totalFeePoisha: number;
  totalReversedPoisha: number;
  totalPaidPoisha: number;
  currentDuePoisha: number;
  isPausedForDue: boolean;
  entriesCount: number;
}

/**
 * Calculates real-time ledger balance for a shop.
 * Source of truth: LedgerEntry table.
 */
export async function getShopBalance(shopId: string): Promise<ShopBalance> {
  const entries = await prisma.ledgerEntry.findMany({
    where: { shopId },
    select: { type: true, amountPoisha: true },
  });

  let totalFeePoisha = 0;
  let totalReversedPoisha = 0;
  let totalPaidPoisha = 0;
  let billedOrdersCount = 0;

  for (const entry of entries) {
    if (entry.type === "order_fee") {
      totalFeePoisha += entry.amountPoisha;
      billedOrdersCount++;
    } else if (entry.type === "fee_reversal") {
      totalReversedPoisha += Math.abs(entry.amountPoisha);
    } else if (entry.type === "topup") {
      totalPaidPoisha += Math.abs(entry.amountPoisha);
    }
  }

  const currentDuePoisha = Math.max(0, totalFeePoisha - totalReversedPoisha - totalPaidPoisha);
  const isPausedForDue = currentDuePoisha >= DUE_CAP_POISHA;

  return {
    totalOrders: billedOrdersCount,
    totalFeePoisha,
    totalReversedPoisha,
    totalPaidPoisha,
    currentDuePoisha,
    isPausedForDue,
    entriesCount: entries.length,
  };
}

/**
 * Creates an immutable ledger entry for a newly committed order within a Prisma transaction.
 */
export async function recordOrderFeeInTx(
  tx: Tx,
  shopId: string,
  orderId: string,
  idempotencyKey?: string,
  amountPoisha = PLATFORM_FEE_POISHA,
) {
  return tx.ledgerEntry.create({
    data: {
      shopId,
      orderId,
      type: "order_fee",
      amountPoisha,
      idempotencyKey: idempotencyKey ?? `fee_${orderId}`,
      note: "অর্ডার ফি (৳৫)",
      actor: "system",
    },
  });
}

/**
 * Reverses a platform fee when an order is flagged as fake or cancelled by the seller.
 */
export async function reverseOrderFee(shopId: string, orderId: string, note?: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, shopId },
  });

  if (!order || order.feeReversedAt) {
    return { ok: false, message: "Order not found or fee already reversed" };
  }

  return prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { feeReversedAt: new Date() },
    });

    await tx.ledgerEntry.create({
      data: {
        shopId,
        orderId,
        type: "fee_reversal",
        amountPoisha: -(order.platformFeePoisha || PLATFORM_FEE_POISHA),
        idempotencyKey: `reversal_${orderId}`,
        note: note ?? "ফেক বা বাতিল অর্ডারে ফি রিভার্সাল",
        actor: "seller",
      },
    });

    return { ok: true };
  });
}
