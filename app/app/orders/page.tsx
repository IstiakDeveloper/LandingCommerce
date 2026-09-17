import { requireSeller } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OrderList, type OrderCardData } from "@/components/app/OrderCard";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const user = await requireSeller();
  if (!user) redirect("/login");
  if (!user.shop) redirect("/#register");
  const tNav = await getTranslations("nav");
  const tOrders = await getTranslations("orders");
  const orders = await prisma.order.findMany({
    where: { shopId: user.shop.id },
    orderBy: { createdAt: "desc" },
    take: 80,
    include: { items: { include: { product: true } } },
  });
  const phones = [...new Set(orders.map((o) => o.phone))];
  const delivered = phones.length
    ? await prisma.order.groupBy({
        by: ["phone"],
        where: { shopId: user.shop.id, phone: { in: phones }, status: "delivered" },
        _count: true,
      })
    : [];
  const map = Object.fromEntries(delivered.map((d) => [d.phone, d._count]));
  const cards: OrderCardData[] = orders.map((o) => {
    const photos = o.items[0]?.product?.photos ? (JSON.parse(o.items[0].product.photos) as string[]) : [];
    return {
      id: o.id,
      code: o.code,
      customerName: o.customerName,
      phone: o.phone,
      isDhaka: o.isDhaka,
      district: o.district,
      address: o.address,
      landmark: o.landmark,
      payMethod: o.payMethod,
      trxId: o.trxId,
      totalPoisha: o.totalPoisha,
      status: o.status,
      sellerNote: o.sellerNote,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((it) => ({
        title: it.title,
        qty: it.qty,
        variant: it.variant,
        pricePoisha: it.pricePoisha,
      })),
      photo: photos[0] ?? null,
      repeatCount: map[o.phone] ?? 0,
    };
  });

  return (
    <div className="page-pad mx-auto max-w-5xl px-4 pt-4 md:px-8">
      <header className="safe-top mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-neon-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {tOrders("inboxHeader")}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
            {tNav("orders")} ({orders.length})
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{tOrders("feeNotice")}</p>
      </header>

      <OrderList orders={cards} />
    </div>
  );
}
