import { SiteFooter, SiteHeader } from "@/components/marketing/SiteChrome";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BillingPolicyPage() {
  const t = await getTranslations("billingPolicy");

  return (
    <div className="site-wrap bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9] cyber-bg">
      <SiteHeader solid />

      <main className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {t("badge")}
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {t("updated")}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Section 1 */}
          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s1Title")}</h2>
            <p className="mt-3">{t("s1Body")}</p>
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-xs text-emerald-700 dark:text-emerald-300">
              {t("s1Example")}
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s2Title")}</h2>
            <p className="mt-3">{t("s2Body")}</p>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s3Title")}</h2>
            <p className="mt-3">{t("s3Body")}</p>
            <ul className="mt-3 list-inside list-disc space-y-2 text-slate-600 dark:text-slate-300">
              <li>{t("s3Point1")}</li>
              <li>{t("s3Point2")}</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s4Title")}</h2>
            <p className="mt-3">{t("s4Body")}</p>
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-4 text-xs text-amber-700 dark:text-amber-300">
              {t("s4Warning")}
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s5Title")}</h2>
            <p className="mt-3">{t("s5Body")}</p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="neon-btn inline-flex h-11 items-center px-6 text-xs font-black"
          >
            {t("backHome")}
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
