"use client";

import { loginAction } from "@/app/actions/auth";
import { SiteHeader } from "@/components/marketing/SiteChrome";
import { isValidBdPhone } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const t = useTranslations();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const locale = useLocale();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidBdPhone(phone) || pin.length !== 4) {
      setError(locale === "bn" ? "সঠিক ১১ ডিজিটের ফোন নম্বর এবং ৪ ডিজিটের পিন দিন" : "Please provide valid 11-digit phone and 4-digit PIN");
      return;
    }
    setBusy(true);
    const res = await loginAction(phone, pin);
    setBusy(false);
    if (res?.error === "rate") setError(t("auth.rateLimitError"));
    else if (res?.error === "locked") setError(t("auth.lockedError"));
    else if (res?.error === "db") setError(locale === "bn" ? "ডাটাবেজ সংযোগে সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" : "Database connection issue. Please try again shortly.");
    else if (res?.error) setError(locale === "bn" ? "মোবাইল নম্বর অথবা ৪ ডিজিটের পিন মিলছে না। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।" : t("auth.wrong"));
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9] cyber-bg">
      <SiteHeader solid />

      <main className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-6xl items-center gap-12 px-5 py-12 md:grid-cols-2 md:px-8">
        <div className="hidden md:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-neon-pulse" />
            {t("auth.sellerPortal")}
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
            {t("promo.loginHead")}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t("promo.loginLead")}
          </p>

          <div className="mt-8 flex flex-col gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
              <span>{t("auth.benefit1")}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
              <span>{t("auth.benefit2")}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
              <span>{t("auth.benefit3")}</span>
            </div>
          </div>
        </div>

        {/* Login Glass Card */}
        <form
          onSubmit={submit}
          className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-gradient-to-b dark:from-[#111a2e]/95 dark:to-[#090d18]/95 p-6 shadow-2xl backdrop-blur-2xl md:p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t("login")}</h2>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
              {t("auth.safeAccess")}
            </span>
          </div>

          <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t("auth.phone")}
          </label>
          <input
            className="cyber-field mt-1.5 font-semibold tracking-wider"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t("auth.pin")}
          </label>
          <input
            className="cyber-field mt-1.5 text-center text-lg font-bold tracking-[0.4em]"
            inputMode="numeric"
            type="password"
            maxLength={4}
            autoComplete="current-password"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          />

          {error && (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 dark:bg-red-950/40 p-3 text-xs font-bold text-red-600 dark:text-red-300">
              ⚠️ {error}
            </div>
          )}

          <button
            className="neon-btn mt-6 min-h-[50px] w-full text-sm font-black shadow-[0_0_20px_rgba(0,245,155,0.4)]"
            disabled={busy}
            type="submit"
          >
            {busy ? t("auth.verifying") : `⚡ ${t("auth.login")}`}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            {t("auth.forgot")}
          </p>

          <div className="mt-5 border-t border-slate-200 dark:border-white/10 pt-4 text-center">
            <Link
              href="/#register"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 transition hover:underline"
            >
              {t("auth.openNewShopPrompt")}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
