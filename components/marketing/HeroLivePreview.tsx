"use client";

import { useTranslations } from "next-intl";

export function HeroLivePreview() {
  const t = useTranslations("preview");

  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
      {/* Subtle Soft Ambient Glow */}
      <div className="pointer-events-none absolute -inset-2 rounded-[40px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent blur-2xl" />

      {/* Modern Smartphone Frame */}
      <div className="relative rounded-[32px] sm:rounded-[36px] border-[3px] border-slate-300/80 dark:border-slate-700/80 bg-white dark:bg-[#0c111c] p-3 sm:p-4 shadow-xl">
        {/* Phone Notch / Speaker Bar */}
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />

        {/* Store Top Header Bar */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/90 px-3.5 py-2.5 border border-slate-200/80 dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-xs font-black text-black">
              র
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-none">রুমার ফ্যাশন</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">facebook.com/rumas.fashion</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {t("liveShop")}
          </span>
        </div>

        {/* Product Preview Card */}
        <div className="mt-3 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 p-3">
          <div className="flex gap-3">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 text-3xl border border-emerald-500/10">
              👗
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {t("sampleProduct")}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("sampleVariant")}
                </p>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                  {t("samplePrice")}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  ক্যাশ অন ডেলিভারি
                </span>
              </div>
            </div>
          </div>

          {/* Clean Order Inputs Simulation */}
          <div className="mt-3 space-y-1.5 rounded-xl bg-white dark:bg-black/30 p-2.5 border border-slate-200/60 dark:border-white/5 text-[11px]">
            <div className="flex items-center justify-between py-0.5 text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">নাম:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{t("sampleCustomer")}</span>
            </div>
            <div className="flex items-center justify-between py-0.5 text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/5">
              <span className="text-slate-400">মোবাইল:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-100">{t("samplePhone")}</span>
            </div>
            <div className="flex items-center justify-between py-0.5 text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/5">
              <span className="text-slate-400">ঠিকানা:</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{t("sampleAddress")}</span>
            </div>
          </div>

          {/* Single Tap Order Button */}
          <div className="mt-3">
            <div className="flex h-10 w-full items-center justify-center rounded-xl bg-emerald-500 font-bold text-xs text-black shadow-md shadow-emerald-500/20">
              ✓ অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)
            </div>
          </div>
        </div>

        {/* Live Notification for the Seller */}
        <div className="mt-2.5 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/30 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🔔</span>
            <div>
              <p className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px] leading-tight">
                নতুন অর্ডার এসেছে!
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                প্ল্যাটফর্ম ফি মাত্র ৫৳ · কোনো মাসিক চার্জ নেই
              </p>
            </div>
          </div>
          <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            ৳০ রিক্স
          </span>
        </div>
      </div>
    </div>
  );
}
