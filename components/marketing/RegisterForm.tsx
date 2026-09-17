"use client";

import { registerShopAction } from "@/app/actions/auth";
import { CATEGORIES } from "@/lib/themes";
import { isValidBdPhone } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export function RegisterForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [category, setCategory] = useState("fashion");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError(t("register.errName"));
      return;
    }
    if (!isValidBdPhone(phone)) {
      setError(t("auth.phoneError"));
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError(t("auth.pinError"));
      return;
    }
    if (pin !== pinConfirm) {
      setError(t("register.errMismatch"));
      return;
    }
    setBusy(true);
    try {
      const res = await registerShopAction({
        name,
        phone,
        pin,
        pinConfirm,
        category,
      });
      if (res?.error === "exists") setError(t("register.errExists"));
      else if (res?.error === "db") setError(locale === "bn" ? "ডাটাবেজ সংযোগে সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" : "Database connection issue. Please try again shortly.");
      else if (res?.error === "rate") setError(locale === "bn" ? "অতিরিক্ত চেষ্টার কারণে সাময়িকভাবে স্থগিত। কিছুক্ষণ পর চেষ্টা করুন।" : "Too many attempts. Please try again in a few minutes.");
      else if (res?.error) setError(t("register.errGeneric"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      id="register"
      onSubmit={submit}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0c121e] p-5 sm:p-7 md:p-8 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t("register.kicker")} · {t("register.noMonthlyFee")}
        </div>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {t("register.twoMinLive")}
        </span>
      </div>

      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
        {t("register.title")}
      </h2>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 md:text-sm">
        {t("register.sub")}
      </p>

      {/* Shop Name */}
      <div className="mt-5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {t("onboard.shopName")}
        </label>
        <input
          className="cyber-field mt-1.5 font-medium text-base sm:text-sm"
          required
          autoComplete="organization"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={locale === "bn" ? "যেমন: রুমার ফ্যাশন বা গ্যাজেট কর্নার" : "e.g. Ruma Fashion or Gadget Corner"}
        />
      </div>

      {/* Phone Number */}
      <div className="mt-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {t("auth.phone")}
        </label>
        <input
          className="cyber-field mt-1.5 tracking-wider font-semibold text-base sm:text-sm"
          required
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01XXXXXXXXX"
        />
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {t("register.phoneNotice")}
        </p>
      </div>

      {/* PIN Inputs */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {t("auth.pin")}
          </label>
          <input
            className="cyber-field mt-1.5 text-center text-lg tracking-[0.4em] font-bold"
            required
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={4}
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="••••"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {t("register.pinAgain")}
          </label>
          <input
            className="cyber-field mt-1.5 text-center text-lg tracking-[0.4em] font-bold"
            required
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={4}
            type="password"
            value={pinConfirm}
            onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="••••"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="mt-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {t("onboard.category")}
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((c) => {
            const isSelected = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-1.5 rounded-xl border p-2.5 text-left text-xs font-bold transition min-h-[42px] ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{c.icon}</span>
                <span className="truncate">{locale === "bn" ? c.bn : c.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 dark:bg-red-950/40 p-3 text-xs font-bold text-red-600 dark:text-red-300">
          ⚠️ {error}
        </div>
      )}

      {/* Primary Submit CTA */}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 flex min-h-[50px] w-full items-center justify-center rounded-xl bg-emerald-500 text-sm font-black text-black hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-70"
      >
        {busy ? t("register.creatingShop") : t("register.freeSubmit")}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
        <span>🔒</span>
        <span>{t("register.legal")}</span>
      </div>
    </form>
  );
}
