"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function FaqAccordion() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t("kicker")}
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          {t("title")}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300">{t("sub")}</p>
      </div>

      <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? "border-emerald-500/50 bg-emerald-50/40 dark:border-emerald-500/30 dark:bg-emerald-950/20"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
              >
                <span className="pr-3">{faq.q}</span>
                <span
                  className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black transition-transform duration-200 ${
                    isOpen
                      ? "border-emerald-500 bg-emerald-500 text-black rotate-180"
                      : "border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  ↓
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 dark:border-white/5 px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
