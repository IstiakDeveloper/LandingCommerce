"use client";

import { useLocale } from "next-intl";
import { saveLocale } from "@/lib/storage";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();

  function set(next: "bn" | "en") {
    if (locale === next) return;
    saveLocale(next);
    window.location.reload();
  }

  return (
    <div
      className={`flex overflow-hidden rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/80 p-0.5 text-[12px] font-bold backdrop-blur-md shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => set("bn")}
        title="বাংলা ভাষা নির্বাচন করুন"
        className={`h-8 min-w-9 rounded-lg px-2.5 transition font-bold ${
          locale === "bn"
            ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(0,245,155,0.4)]"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        বাং
      </button>
      <button
        type="button"
        onClick={() => set("en")}
        title="Switch to English"
        className={`h-8 min-w-9 rounded-lg px-2.5 transition font-bold ${
          locale === "en"
            ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(0,245,155,0.4)]"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
