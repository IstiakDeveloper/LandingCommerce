import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { shopScope } from "@/lib/tenant";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await requireSeller();
  if (!user?.shop) return NextResponse.json({ error: "auth" }, { status: 401 });

  const limit = await rateLimit(`poll:${user.shop.id}`, 40, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }

  const since = req.nextUrl.searchParams.get("since");
  const where = {
    ...shopScope(user.shop.id),
    status: "new",
    ...(since ? { createdAt: { gt: new Date(since) } } : {}),
  };
  const count = await prisma.order.count({ where });
  const latest = await prisma.order.findFirst({
    where: { ...shopScope(user.shop.id), status: "new" },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json({ count, latest, now: new Date().toISOString() });
}
