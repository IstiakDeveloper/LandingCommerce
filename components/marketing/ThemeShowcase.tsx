"use client";

import { useState } from "react";
import { THEMES, ThemeId } from "@/lib/themes";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export function ThemeShowcase() {
  const t = useTranslations("themeShowcase");
  const tg = useTranslations();
  const locale = useLocale();
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>("gadget-dark");
  const currentTheme = THEMES.find((t) => t.id === selectedThemeId) ?? THEMES[0];

  const themeName = locale === "bn" ? currentTheme.nameBn : currentTheme.nameEn;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-neon-pulse" />
            {t("kicker")}
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:text-base">
            {t("sub")}
          </p>
        </div>

        <Link
          href="/s/demo"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white transition hover:border-cyan-400 hover:bg-slate-50 dark:hover:bg-white/10"
        >
          <span>{t("explore")}</span>
          <span>→</span>
        </Link>
      </div>

      {/* Theme Selection Chips */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {THEMES.map((theme) => {
          const isSelected = theme.id === selectedThemeId;
          const name = locale === "bn" ? theme.nameBn : theme.nameEn;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedThemeId(theme.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                isSelected
                  ? "border border-cyan-400 bg-cyan-400/20 text-cyan-700 dark:text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                  : "border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Live Interactive Preview Card for Selected Theme */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0c121e] p-5 sm:p-7 md:p-8 shadow-xl">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: Theme Highlights */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
                style={{ background: currentTheme.primary }}
              />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {themeName}
              </h3>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {locale === "bn" ? "উপযুক্ত ক্যাটাগরি" : "Best for"}: <span className="font-bold text-emerald-600 dark:text-emerald-400 capitalize">{currentTheme.category}</span>
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{locale === "bn" ? "মোবাইলে দ্রুত লোড হওয়া ক্লিন লেআউট" : "Fast loading clean mobile layout"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{locale === "bn" ? "ফেসবুক ও ইনস্টাগ্রাম ট্রাফিকের জন্য অপ্টিমাইজড" : "Optimized for Facebook & Instagram traffic"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{locale === "bn" ? "ক্যাশ অন ডেলিভারি ও বিকাশ ফর্ম ইনবিল্ট" : "Built-in COD & bKash checkout flow"}</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="#register"
                className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl bg-emerald-500 px-6 text-xs font-black text-black hover:bg-emerald-400 transition shadow-sm"
              >
                {locale === "bn" ? "এই থিমে ফ্রি দোকান খুলুন →" : "Start Shop with this Theme →"}
              </a>
            </div>
          </div>

          {/* Right: Simulated Storefront Mini-Mockup */}
          <div
            className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 p-4 sm:p-5 shadow-lg transition-all duration-300"
            style={{
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
              borderRadius: currentTheme.radius,
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.accent }}>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center font-black text-xs"
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: currentTheme.primaryText,
                    borderRadius: "8px",
                  }}
                >
                  {locale === "bn" ? "দ" : "H"}
                </div>
                <div>
                  <p className="text-xs font-extrabold">{themeName} {locale === "bn" ? "শপ" : "Shop"}</p>
                  <p className="text-[10px]" style={{ color: currentTheme.muted }}>
                    {locale === "bn" ? "দোকানদারি ভেরিফাইড" : "DokanDari Verified"}
                  </p>
                </div>
              </div>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: currentTheme.accent, color: currentTheme.text }}
              >
                {tg("products.ase")}
              </span>
            </div>

            <div
              className="mt-3.5 p-3.5 shadow-sm"
              style={{
                backgroundColor: currentTheme.surface,
                borderRadius: currentTheme.radius,
              }}
            >
              <div
                className="flex h-24 items-center justify-center rounded-lg text-3xl"
                style={{ backgroundColor: currentTheme.accent }}
              >
                🛍️
              </div>
              <div className="mt-2.5 flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-bold">{t("productSample")}</p>
                  <p className="text-[11px]" style={{ color: currentTheme.muted }}>
                    {locale === "bn" ? "ঢাকার ভেতরে ৬০৳ ডেলিভারি" : "৳60 delivery inside Dhaka"}
                  </p>
                </div>
                <p className="text-sm sm:text-base font-black" style={{ color: currentTheme.primary }}>
                  {t("priceSample")}
                </p>
              </div>

              <button
                type="button"
                className="mt-3 w-full py-2.5 text-xs font-black transition hover:opacity-90"
                style={{
                  backgroundColor: currentTheme.primary,
                  color: currentTheme.primaryText,
                  borderRadius: currentTheme.radius,
                }}
              >
                {t("orderBtn")} · {tg("checkout.cod")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
