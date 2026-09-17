"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const PRESETS = [20, 50, 100, 250, 500];

export function PriceCalculator() {
  const t = useTranslations("calculator");
  const [orders, setOrders] = useState<number>(100);

  const DokanDariCost = orders * 5;
  const traditionalCost = 3500; // Baseline Shopify / bespoke store monthly upkeep
  const savings = Math.max(0, traditionalCost - DokanDariCost);

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0c121e] p-5 sm:p-8 md:p-10 shadow-xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t("kicker")}
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          {t("title")}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t("sub")}
        </p>
      </div>

      <div className="mt-6 sm:mt-8 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/80 dark:bg-slate-900/50 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <label htmlFor="order-slider" className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
            {t("sliderLabel")}
          </label>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {orders}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("ordersUnit")}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-4">
          <input
            id="order-slider"
            type="range"
            min="10"
            max="1000"
            step="5"
            value={orders}
            onChange={(e) => setOrders(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800 accent-emerald-500 focus:outline-none"
          />
          <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span>{t("minLabel")}</span>
            <span>{t("mid1Label")}</span>
            <span>{t("mid2Label")}</span>
            <span>{t("maxLabel")}</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">{t("quickSelect")}</span>
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setOrders(p)}
              className={`min-h-[34px] rounded-lg px-3 text-xs font-bold transition ${
                orders === p
                  ? "bg-emerald-500 text-black shadow-sm"
                  : "border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {p}{t("unitPcs")}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-3">
        {/* DokanDari Fee Card */}
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {t("DokanDariCost")}
            </p>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              {t("perOrderTag")}
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ৳{DokanDariCost.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t("perMonth")}</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
            {orders} × ৫৳ = ৳{DokanDariCost.toLocaleString()}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span>✓</span> {t("zeroRisk")}
          </div>
        </div>

        {/* Traditional Cost Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/40 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t("otherCost")}
            </p>
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
              {t("fixedFeeTag")}
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-700 dark:text-slate-300">
              ৳{traditionalCost.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t("perMonth")}</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {t("otherFormula")}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-red-600 dark:text-red-400">
            <span>✗</span> {t("fixedRisk")}
          </div>
        </div>

        {/* Net Savings Highlight */}
        <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-white dark:bg-slate-900/80 p-4 sm:p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {t("savings")}
              </p>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                {t("smartSavingTag")}
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                ৳{savings.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t("perMonth")}</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
              {t("yearlySavingsPrefix")}{(savings * 12).toLocaleString()}{t("yearlySavingsSuffix")}
            </p>
          </div>
          <div className="mt-3 pt-2">
            <a
              href="#register"
              className="inline-flex min-h-[42px] w-full items-center justify-center rounded-xl bg-emerald-500 text-xs font-black text-black hover:bg-emerald-400 transition"
            >
              {t("startNow")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
