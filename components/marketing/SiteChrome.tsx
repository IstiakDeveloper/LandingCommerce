"use client";

import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logoutAction } from "@/app/actions/auth";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const t = useTranslations();
  const [auth, setAuth] = useState<{
    loggedIn: boolean;
    dashboardUrl: string;
    role?: string;
  }>({
    loggedIn: false,
    dashboardUrl: "/login",
  });

  useEffect(() => {
    // Optimistic check via cookie
    if (typeof document !== "undefined" && document.cookie.includes("hl_logged_in=1")) {
      setAuth((prev) => ({ ...prev, loggedIn: true, dashboardUrl: "/app" }));
    }
    // Verify via /api/auth/me
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.loggedIn) {
          setAuth({
            loggedIn: true,
            dashboardUrl: data.dashboardUrl || "/app",
            role: data.role,
          });
        } else {
          setAuth({ loggedIn: false, dashboardUrl: "/login" });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-200 ${
        solid
          ? "border-slate-200 dark:border-white/10 bg-white dark:bg-[#07090e]"
          : "border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07090e]/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-sm font-black text-black">
            হ
          </span>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              {t("brand")}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hidden sm:inline-block">
              {t("header.perOrderRate")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300 md:flex">
          <a href="#how" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
            {t("promo.howTitle")}
          </a>
          <a href="#calculator" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
            {t("header.calculator")}
          </a>
          <a href="#themes" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
            {t("header.themes")}
          </a>
          <a href="#faq" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
            {t("header.faq")}
          </a>
          <Link href="/s/demo" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
            {t("seeDemo")}
          </Link>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <ThemeToggle />
          <LanguageToggle />

          {auth.loggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link
                href={auth.dashboardUrl}
                className="h-8 sm:h-9 px-3 text-xs font-black bg-emerald-500 text-black rounded-xl inline-flex items-center gap-1.5 hover:bg-emerald-400 transition"
              >
                <span>📊</span>
                <span>
                  {auth.role === "owner" || auth.role === "admin"
                    ? (t("admin.title") || "অ্যাডমিন")
                    : t("dashboard")}
                </span>
              </Link>
              <form action={logoutAction} className="inline">
                <button
                  type="submit"
                  title={t("admin.logout") || "লগআউট"}
                  className="h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-xs text-slate-500 hover:text-red-500 transition"
                >
                  🚪
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="h-8 sm:h-9 items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-white/10 inline-flex"
              >
                {t("login")}
              </Link>
              <a
                href="#register"
                className="h-8 sm:h-9 px-3.5 text-xs font-black bg-emerald-500 text-black rounded-xl hidden sm:inline-flex items-center hover:bg-emerald-400 transition"
              >
                ⚡ {t("openShop")}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useTranslations();
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#05070a] text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-xs font-black text-black">
                হ
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{t("brand")}</span>
            </div>
            <p className="mt-2.5 max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {t("promo.footer")}
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">
                {t("footer.bdMade")}
              </span>
              <span className="rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2 py-0.5">
                {t("footer.perOrderFive")}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {t("footer.platform")}
            </p>
            <ul className="mt-2.5 space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/s/demo" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
                  {t("seeDemo")} ({t("footer.liveShop")})
                </Link>
              </li>
              <li>
                <Link href="/try" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
                  {t("tryDashboard")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
                  {t("login")} ({t("footer.sellerDashboard")})
                </Link>
              </li>
              <li>
                <a href="#register" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
                  {t("openShop")} ({t("footer.openIn2Min")})
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {t("footer.legalSupport")}
            </p>
            <ul className="mt-2.5 space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/billing" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
                  {t("footer.billingPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
                  {t("footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>{t("footer.waSupport")}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 dark:border-white/10 pt-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {t("footer.rightsReserved")}</p>
          <p className="text-[11px]">{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
