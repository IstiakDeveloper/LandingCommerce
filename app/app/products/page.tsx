import { requireSeller } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTaka } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const user = await requireSeller();
  if (!user) redirect("/login");
  if (!user.shop) redirect("/#register");
  const t = await getTranslations("nav");
  const products = await prisma.product.findMany({
    where: { shopId: user.shop.id, active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="page-pad mx-auto max-w-5xl px-4 pt-4 md:px-8">
      <header className="safe-top mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-neon-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ইনভেন্টরি ও প্রোডাক্ট ক্যাটালগ
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
            {t("products")} ({products.length})
          </h1>
        </div>

        <Link
          href="/app/products/new"
          className="neon-btn hidden h-10 px-4 text-xs font-black shadow-[0_0_15px_rgba(0,245,155,0.3)] sm:inline-flex"
        >
          + নতুন প্রোডাক্ট
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-12 text-center shadow-sm">
          <p className="text-4xl">🛍️</p>
          <h2 className="mt-3 text-lg font-black text-slate-900 dark:text-white">কোনো প্রোডাক্ট যোগ করা হয়নি</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">আপনার ফেসবুক শপের প্রথম প্রোডাক্ট যোগ করে বিক্রি শুরু করুন</p>
          <Link
            href="/app/products/new"
            className="neon-btn mt-5 inline-flex h-10 px-5 text-xs font-black shadow-[0_0_15px_rgba(0,245,155,0.35)]"
          >
            + প্রথম প্রোডাক্ট যোগ করুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => {
            const photos = JSON.parse(p.photos || "[]") as string[];
            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gradient-to-b dark:from-[#111a2e]/90 dark:to-[#080d18]/90 p-3 shadow-sm dark:shadow-lg backdrop-blur-xl transition hover:border-emerald-400/50"
              >
                <div>
                  <Link href={`/app/products/${p.id}`} className="block">
                    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photos[0] || "/demo/kurti.svg"}
                        alt={p.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-2 left-2 rounded-md bg-white/85 dark:bg-black/70 px-2 py-0.5 text-[10px] font-bold text-slate-900 dark:text-white backdrop-blur-md shadow-sm">
                        স্টক: {p.stock}
                      </span>
                    </div>
                  </Link>

                  <div className="mt-2.5">
                    <Link href={`/app/products/${p.id}`}>
                      <p className="line-clamp-2 text-xs font-bold text-slate-900 dark:text-white transition group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                        {p.title}
                      </p>
                    </Link>
                    <div className="mt-1 flex items-baseline gap-2">
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatTaka(p.pricePoisha)}</p>
                      {p.compareAtPoisha && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-through">
                          {formatTaka(p.compareAtPoisha)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-100 dark:border-white/5 pt-2">
                  <Link
                    href={`/app/shop#landing-pages`}
                    className="flex w-full items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-50 dark:bg-cyan-950/20 py-1.5 text-[10px] font-bold text-cyan-800 dark:text-cyan-300 transition hover:bg-cyan-100 dark:hover:bg-cyan-950/50"
                  >
                    ⚡ ল্যান্ডিং পেজ তৈরি
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <Link
        href="/app/products/new"
        className="neon-btn fixed bottom-[calc(88px+env(safe-area-inset-bottom))] right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-black text-black shadow-[0_0_25px_rgba(0,245,155,0.6)] sm:hidden"
        title="নতুন প্রোডাক্ট যোগ করুন"
      >
        +
      </Link>
    </div>
  );
}
