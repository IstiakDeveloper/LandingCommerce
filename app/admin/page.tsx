import { adminLogout, resetSellerPin, toggleShopDisabled } from "@/app/actions/admin";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTaka } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const t = await getTranslations("admin");

  const [
    shops,
    totalShops,
    activeShops,
    totalOrders,
    orderSums,
    totalUsers,
    settings,
  ] = await Promise.all([
    prisma.shop.findMany({
      include: { user: true, _count: { select: { orders: true, products: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shop.count(),
    prisma.shop.count({ where: { disabled: false } }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalPoisha: true, platformFeePoisha: true },
    }),
    prisma.user.count(),
    prisma.platformSettings.findUnique({ where: { id: "default" } }),
  ]);

  const totalGmvPoisha = orderSums._sum.totalPoisha ?? 0;
  const totalRevenuePoisha = orderSums._sum.platformFeePoisha ?? 0;

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9] cyber-bg">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#07090e]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-sm font-black text-black shadow-[0_0_12px_rgba(0,245,155,0.3)]">
                হ
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 border border-white dark:border-[#07090e] animate-neon-pulse" />
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                    {t("title")}
                  </span>
                  <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                    OWNER PANEL
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t("sub")}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 px-2 py-1"
            >
              🏠 হোমপেজ
            </Link>
            <Link
              href="/try"
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 px-2 py-1"
            >
              📊 মার্চেন্ট ডেমো
            </Link>
            <ThemeToggle />
            <LanguageToggle />
            <form action={adminLogout}>
              <button
                type="submit"
                className="h-8 rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition"
              >
                🚪 {t("logout")}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 space-y-6">
        {/* Owner Status Alert */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/25 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                প্ল্যাটফর্ম ওনার মোড সক্রিয় (সুপার অ্যাডমিন)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ডাটাবেজ ফ্রেশ অবস্থায় রয়েছে · মোট ইউজার: {totalUsers} · মোট দোকান: {totalShops}
              </p>
            </div>
          </div>
          <Link
            href="/#register"
            className="neon-btn h-8 px-3 text-xs font-black shadow-[0_0_12px_rgba(0,245,155,0.3)]"
          >
            ⚡ নতুন শপ খুলুন
          </Link>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">মোট সেলার / শপ</p>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">{totalShops}</p>
            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {activeShops} টি সক্রিয়
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">প্ল্যাটফর্ম অর্ডার সংখ্যা</p>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">{totalOrders}</p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">সারা বাংলাদেশের শপ থেকে</p>
          </div>

          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 dark:bg-emerald-950/20 p-4 shadow-sm">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">মোট বিক্রয় (GMV)</p>
            <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 md:text-3xl">
              {formatTaka(totalGmvPoisha)}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600/80 dark:text-emerald-400/80">সর্বমোট কাস্টমার ভ্যালু</p>
          </div>

          <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 dark:bg-cyan-950/20 p-4 shadow-sm">
            <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">প্ল্যাটফর্ম আয় (৫৳ / অর্ডার)</p>
            <p className="mt-1 text-2xl font-black text-cyan-600 dark:text-cyan-400 md:text-3xl">
              {formatTaka(totalRevenuePoisha)}
            </p>
            <p className="mt-1 text-[11px] text-cyan-600/80 dark:text-cyan-400/80">নেট সার্ভিস ফি সংগ্রহ</p>
          </div>
        </div>

        {/* Platform Settings Summary */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            ⚙️ প্ল্যাটফর্ম সেটিংস ও পলিসি স্ট্যাটাস
          </h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-3">
              <span className="text-slate-500 dark:text-slate-400 block">প্রতি অর্ডার সার্ভিস ফি:</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {formatTaka(settings?.feePerOrderPoisha ?? 500)}
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-3">
              <span className="text-slate-500 dark:text-slate-400 block">ডিউ ক্যাপ (Due Cap):</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400">
                {formatTaka(settings?.duePausePoisha ?? 50000)}
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-3">
              <span className="text-slate-500 dark:text-slate-400 block">অফিশিয়াল বিকাশ ফি রিসিভার:</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {settings?.platformBkash ?? "01700000000"}
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-3">
              <span className="text-slate-500 dark:text-slate-400 block">অফিশিয়াল নগদ ফি রিসিভার:</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {settings?.platformNagad ?? "01700000000"}
              </span>
            </div>
          </div>
        </div>

        {/* Sellers & Stores Management */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              {t("sellers")} ({shops.length})
            </h2>
          </div>

          {shops.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/30 p-12 text-center shadow-sm">
              <p className="text-5xl">🏪</p>
              <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                এখনও কোনো শপ রেজিস্টার করা হয়নি
              </h3>
              <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                আপনার ডাটাবেজ সম্পূর্ণ ফ্রেশ অবস্থায় আছে। নতুন মার্চেন্ট বা সেলার অ্যাকাউন্ট খুলে দোকান তৈরি করলে এখানে স্বয়ংক্রিয়ভাবে বিস্তারিত শো করবে।
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/#register"
                  className="neon-btn inline-flex h-10 items-center px-5 text-xs font-black shadow-[0_0_15px_rgba(0,245,155,0.3)]"
                >
                  ⚡ নিজের প্রথম দোকান তৈরি করুন
                </Link>
                <Link
                  href="/try"
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                >
                  📊 ডেমো স্টোর ও অর্ডার ট্রাই করুন
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {shops.map((s) => (
                <article
                  key={s.id}
                  className="glass-card rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 dark:text-white text-base">{s.name}</p>
                        <Link
                          href={`/s/${s.slug}`}
                          target="_blank"
                          className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                        >
                          ↗ স্টোরফ্রন্ট
                        </Link>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        ফোন: {s.user.phone} · লিংক: /s/{s.slug} · ক্যাটাগরি: {s.category}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        📦 {s._count.products} টি প্রোডাক্ট · 🛍️ {s._count.orders} টি অর্ডার
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        s.disabled
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {s.disabled ? t("statusDisabled") : t("statusActive")}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-slate-200 dark:border-white/10 pt-3">
                    <form
                      action={async () => {
                        "use server";
                        await toggleShopDisabled(s.id, !s.disabled);
                      }}
                    >
                      <button className="h-9 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-white/10">
                        {s.disabled ? t("enable") : t("disable")}
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await resetSellerPin(s.userId);
                      }}
                    >
                      <button className="h-9 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-bold text-amber-700 dark:text-amber-300 transition hover:bg-amber-500/20">
                        {t("resetPin")}
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
