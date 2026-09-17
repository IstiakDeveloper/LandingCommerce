"use client";

import { adminLogin } from "@/app/actions/admin";
import { SiteHeader } from "@/components/marketing/SiteChrome";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await adminLogin(pin);
    setBusy(false);
    if (res?.error) setError(t("wrongPin"));
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9] cyber-bg">
      <SiteHeader solid />
      <main className="mx-auto flex min-h-[75dvh] max-w-md items-center px-5 py-10">
        <form
          onSubmit={go}
          className="w-full rounded-3xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-gradient-to-b dark:from-[#111a2e]/95 dark:to-[#090d18]/95 p-7 shadow-2xl backdrop-blur-2xl md:p-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-neon-pulse" />
            {t("title")}
          </div>
          <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("sub")}</p>

          <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t("pinLabel")}
          </label>
          <input
            className="cyber-field mt-1.5 text-center text-lg font-bold tracking-[0.4em]"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
          />

          {error ? (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 dark:bg-red-950/40 p-3 text-xs font-bold text-red-600 dark:text-red-300">
              ⚠️ {error}
            </div>
          ) : null}

          <button
            className="neon-btn mt-6 min-h-[50px] w-full text-sm font-black shadow-[0_0_20px_rgba(0,245,155,0.4)]"
            disabled={busy || pin.length < 4}
            type="submit"
          >
            {busy ? "…" : t("enter")}
          </button>
        </form>
      </main>
    </div>
  );
}
