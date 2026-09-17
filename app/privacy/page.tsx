import { SiteFooter, SiteHeader } from "@/components/marketing/SiteChrome";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const t = await getTranslations("privacyPolicy");

  return (
    <div className="site-wrap bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9] cyber-bg">
      <SiteHeader solid />

      <main className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          {t("badge")}
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {t("updated")}
        </p>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s1Title")}</h2>
            <p className="mt-3">{t("s1Body")}</p>
          </section>

          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s2Title")}</h2>
            <p className="mt-3">{t("s2Body")}</p>
          </section>

          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s3Title")}</h2>
            <p className="mt-3">{t("s3Body")}</p>
          </section>

          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("s4Title")}</h2>
            <p className="mt-3">{t("s4Body")}</p>
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
