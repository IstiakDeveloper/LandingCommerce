import { requireSeller } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OrderList, type OrderCardData } from "@/components/app/OrderCard";
import { CoachMarks } from "@/components/app/CoachMarks";
import { InstallHint } from "@/components/app/InstallHint";
import { formatTaka } from "@/lib/utils";
import { getShopBalance } from "@/lib/billing/ledger";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Link from "next/link";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function AppHome() {
  const user = await requireSeller();
  if (!user) redirect("/login");
  if (!user.shop) redirect("/#register");
  const t = await getTranslations("home");
  const tg = await getTranslations();
  const shopId = user.shop.id;
  const today = startOfToday();

  const [todayOrders, newCount, money, pending, balance] = await Promise.all([
    prisma.order.count({
      where: { shopId, createdAt: { gte: today }, status: { not: "cancelled" } },
    }),
    prisma.order.count({ where: { shopId, status: "new" } }),
    prisma.order.aggregate({
      where: { shopId, createdAt: { gte: today }, status: { not: "cancelled" } },
      _sum: { totalPoisha: true },
    }),
    prisma.order.findMany({
      where: { shopId, status: "new" },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
      take: 20,
    }),
    getShopBalance(shopId),
  ]);

  const phones = [...new Set(pending.map((o) => o.phone))];
  const delivered = phones.length
    ? await prisma.order.groupBy({
        by: ["phone"],
        where: { shopId, phone: { in: phones }, status: "delivered" },
        _count: true,
      })
    : [];
  const map = Object.fromEntries(delivered.map((d) => [d.phone, d._count]));
  const cards: OrderCardData[] = pending.map((o) => {
    const photos = o.items[0]?.product?.photos
      ? (JSON.parse(o.items[0].product.photos) as string[])
      : [];
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
      <CoachMarks />
      <header className="safe-top mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-neon-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {balance.isPausedForDue
                ? tg("app.pausedDue")
                : user.shop.paused
                ? t("paused")
                : tg("app.onlineStorefront")}
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
            {user.shop.name}
          </h1>
        </div>

        <Link
          href="/app/shop"
          className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10"
        >
          ⚙️ {tg("app.settings")}
        </Link>
      </header>

      {balance.isPausedForDue && (
        <div className="mb-5 rounded-2xl border border-red-500/40 bg-red-500/10 dark:bg-red-950/40 p-4 text-xs font-bold text-red-700 dark:text-red-200 shadow-sm">
          {tg("app.dueWarning")} (Total Due: {formatTaka(balance.currentDuePoisha)})
        </div>
      )}

      {/* Landing Page Quick Action Banner */}
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-slate-100 dark:from-cyan-950/40 dark:to-slate-900/60 p-4 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black text-cyan-700 dark:text-cyan-300">{tg("app.multiLpTitle")}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{tg("app.multiLpSub")}</p>
        </div>
        <Link
          href="/app/shop#landing-pages"
          className="inline-flex h-9 items-center justify-center rounded-xl bg-cyan-400 px-4 text-xs font-black text-black transition hover:bg-cyan-300 shrink-0"
        >
          {tg("app.createLp")}
        </Link>
      </div>

      <InstallHint />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("todayOrders")}</p>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">{todayOrders}</p>
        </div>

        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 dark:bg-emerald-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{t("newOrders")}</p>
            {newCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-neon-pulse" />
            )}
          </div>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 md:text-3xl">{newCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("todayMoney")}</p>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
            {formatTaka(money._sum.totalPoisha ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 dark:bg-amber-950/20 p-4 shadow-sm">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">{tg("app.dueBill")}</p>
          <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400 md:text-3xl">
            {formatTaka(balance.currentDuePoisha)}
          </p>
        </div>
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">{t("pending")}</h2>
        <Link href="/app/orders" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
          {tg("orders.allOrdersLink")}
        </Link>
      </div>
      <OrderList orders={cards} />
    </div>
  );
}
