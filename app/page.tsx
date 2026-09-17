import { SiteFooter, SiteHeader } from "@/components/marketing/SiteChrome";
import { RegisterForm } from "@/components/marketing/RegisterForm";
import { PriceCalculator } from "@/components/marketing/PriceCalculator";
import { HeroLivePreview } from "@/components/marketing/HeroLivePreview";
import { ThemeShowcase } from "@/components/marketing/ThemeShowcase";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function MarketingPage() {
  const t = await getTranslations();

  return (
    <div className="site-wrap pb-24 md:pb-0 bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9] cyber-bg">
      <SiteHeader />

      {/* =========================================================
          HERO SECTION (Mobile-First, Clean & High-Conversion)
      ========================================================= */}
      <section className="relative overflow-hidden px-4 sm:px-6 md:px-8 pb-12 pt-6 sm:pb-20 sm:pt-12 md:pb-24 md:pt-16">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-80 w-[600px] rounded-full bg-emerald-500/10 blur-[100px]" />

        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{t("landing.heroBadge")}</span>
            </div>

            {/* Headline */}
            <h1 className="mt-3.5 text-[1.85rem] sm:text-3xl md:text-[3.2rem] font-black leading-[1.2] tracking-tight text-slate-900 dark:text-white">
              {t("landing.heroHeadPart1")}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                {t("landing.heroHeadPart2")}
              </span>
            </h1>

            {/* Lead Description */}
            <p className="mt-3.5 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t("landing.heroLead")}
            </p>

            {/* Benefit Highlights */}
            <ul className="mt-5 space-y-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  ✓
                </span>
                <span>{t("landing.heroB1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  ✓
                </span>
                <span>{t("landing.heroB2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  ✓
                </span>
                <span>{t("landing.heroB3")}</span>
              </li>
            </ul>

            {/* Action CTAs */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <a
                href="#register"
                className="flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 text-xs sm:text-sm font-black text-black hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
              >
                {t("landing.heroCta")}
              </a>
              <Link
                href="/s/demo"
                className="flex h-12 items-center justify-center rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/60 px-5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {t("seeDemo")}
              </Link>
            </div>

            {/* Trust Proof */}
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-center text-[10px] leading-6">👗</div>
                <div className="inline-block h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-center text-[10px] leading-6">📱</div>
                <div className="inline-block h-6 w-6 rounded-full bg-purple-500/20 border border-purple-400/40 text-center text-[10px] leading-6">💄</div>
              </div>
              <p>
                <strong className="text-slate-900 dark:text-white font-bold">{t("landing.heroTrustHighlight")}</strong> {t("landing.heroTrustLead")}
              </p>
            </div>
          </div>

          {/* Right Smartphone Simulation Preview */}
          <div className="w-full">
            <HeroLivePreview />
          </div>
        </div>
      </section>

      {/* =========================================================
          KEY STATS TICKER BAR
      ========================================================= */}
      <section className="border-y border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#080d1a]/80 py-6 sm:py-8 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-6 md:px-8">
          <div className="text-center sm:text-left p-2">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{t("landing.stat1Num")}</p>
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">{t("landing.stat1Label")}</p>
          </div>
          <div className="text-center sm:text-left p-2">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400">{t("landing.stat2Num")}</p>
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">{t("landing.stat2Label")}</p>
          </div>
          <div className="text-center sm:text-left p-2">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{t("landing.stat3Num")}</p>
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">{t("landing.stat3Label")}</p>
          </div>
          <div className="text-center sm:text-left p-2">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{t("landing.stat4Num")}</p>
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">{t("landing.stat4Label")}</p>
          </div>
        </div>
      </section>

      {/* =========================================================
          PAIN VS SOLUTION CONTRAST MATRIX
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t("comparison.kicker")}
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("comparison.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {t("comparison.sub")}
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* Pain Card */}
          <div className="rounded-2xl sm:rounded-3xl border border-red-500/20 bg-red-50/40 dark:bg-red-950/10 p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <h3 className="text-base sm:text-lg font-black text-red-600 dark:text-red-400">
                {t("comparison.badTitle")}
              </h3>
            </div>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>{t("comparison.bad1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>{t("comparison.bad2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>{t("comparison.bad3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>{t("comparison.bad4")}</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="rounded-2xl sm:rounded-3xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h3 className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">
                {t("comparison.goodTitle")}
              </h3>
            </div>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{t("comparison.good1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{t("comparison.good2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{t("comparison.good3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{t("comparison.good4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS (3-Step Workflow)
      ========================================================= */}
      <section id="how" className="border-t border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-[#080d19] py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t("landing.stepBadge")}
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("landing.stepTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t("landing.stepSub")}
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              {
                num: t("landing.s1Num"),
                title: t("landing.s1Title"),
                desc: t("landing.s1Desc"),
                icon: "🏪",
              },
              {
                num: t("landing.s2Num"),
                title: t("landing.s2Title"),
                desc: t("landing.s2Desc"),
                icon: "🔗",
              },
              {
                num: t("landing.s3Num"),
                title: t("landing.s3Title"),
                desc: t("landing.s3Desc"),
                icon: "📦",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-slate-300 dark:text-slate-700">{step.num}</span>
                  <span className="text-xl sm:text-2xl">{step.icon}</span>
                </div>
                <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          LIVE ৳5 FEE & SAVINGS CALCULATOR
      ========================================================= */}
      <section id="calculator" className="border-t border-slate-200/80 dark:border-white/10 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <PriceCalculator />
        </div>
      </section>

      {/* =========================================================
          10 BUILT-IN THEMES SHOWCASE
      ========================================================= */}
      <section id="themes" className="border-t border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-[#080d19] py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <ThemeShowcase />
        </div>
      </section>

      {/* =========================================================
          QUICK REGISTER FORM SECTION
      ========================================================= */}
      <section id="register" className="relative border-t border-slate-200/80 dark:border-white/10 py-12 sm:py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-10 px-4 sm:px-6 lg:grid-cols-2 md:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t("landing.regBadge")}
            </div>
            <h2 className="mt-3.5 text-2xl sm:text-3xl md:text-5xl font-black leading-tight text-slate-900 dark:text-white">
              {t("landing.regHeadPart1")} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                {t("landing.regHeadPart2")}
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t("landing.regLead")}
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/50 p-3 sm:p-3.5 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black text-xs">
                  ৳০
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t("landing.regPerk1Title")}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("landing.regPerk1Sub")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/50 p-3 sm:p-3.5 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-black text-xs">
                  🛡️
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t("landing.regPerk2Title")}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("landing.regPerk2Sub")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/50 p-3 sm:p-3.5 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 font-black text-xs">
                  📱
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t("landing.regPerk3Title")}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("landing.regPerk3Sub")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <RegisterForm />
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ ACCORDION SECTION
      ========================================================= */}
      <section id="faq" className="border-t border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-[#080d19] py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <FaqAccordion />
        </div>
      </section>

      {/* =========================================================
          FINAL CALL TO ACTION
      ========================================================= */}
      <section className="relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("landing.ctaSectionTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("landing.ctaSectionLead")}
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
            <a
              href="#register"
              className="flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-7 text-xs sm:text-sm font-black text-black hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
            >
              {t("landing.ctaSectionBtn")}
            </a>
            <Link
              href="/s/demo"
              className="flex h-12 items-center justify-center rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/60 px-6 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {t("landing.seeDemoBtn")}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* =========================================================
          MOBILE STICKY THUMB BAR (Tap target 48px+, Safe-area Aware)
      ========================================================= */}
      <div className="mobile-thumb-bar md:hidden">
        <a
          href="#register"
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-500 text-xs sm:text-sm font-black text-black shadow-lg shadow-emerald-500/25 transition active:scale-[0.98]"
        >
          {t("landing.stickyThumbBtn")}
        </a>
      </div>
    </div>
  );
}
