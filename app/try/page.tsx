"use client";

import { useState } from "react";
import { OrderList, type OrderCardData } from "@/components/app/OrderCard";
import { AppNav, BottomNav } from "@/components/mobile/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

const getDemoOrders = (locale: string): OrderCardData[] => [
  {
    id: "d1",
    code: "HL-260916-1001",
    customerName: locale === "bn" ? "সাবরিনা চৌধুরী" : "Sabrina Chowdhury",
    phone: "01811111111",
    isDhaka: true,
    district: "dhaka",
    address: locale === "bn" ? "ধানমন্ডি ২৭, রোড ৮/এ, বাসা ১২" : "Dhanmondi 27, Road 8/A, House 12",
    landmark: locale === "bn" ? "রিক্সা স্ট্যান্ডের বিপরীতে" : "Opposite Rickshaw Stand",
    payMethod: "cod",
    trxId: null,
    totalPoisha: 131000,
    status: "new",
    sellerNote: locale === "bn" ? "কুরিয়ার পিকআপ কনফার্ম করতে হবে" : "Courier pickup needs confirmation",
    createdAt: new Date().toISOString(),
    items: [
      {
        title: locale === "bn" ? "কটন এমব্রয়ডারি কুর্তি" : "Cotton Embroidery Kurti",
        qty: 1,
        variant: locale === "bn" ? "L সাইজ" : "Size L",
        pricePoisha: 125000,
      },
    ],
    photo: "/icon.svg",
    repeatCount: 2,
  },
  {
    id: "d2",
    code: "HL-260916-1002",
    customerName: locale === "bn" ? "রাফি আহমেদ" : "Rafi Ahmed",
    phone: "01722222222",
    isDhaka: false,
    district: "sylhet",
    address: locale === "bn" ? "জিন্দাবাজার পয়েন্ট" : "Zindabazar Point",
    landmark: locale === "bn" ? "মার্বেল টাওয়ারের সামনে" : "In front of Marble Tower",
    payMethod: "advance",
    trxId: "BKH9281X",
    totalPoisha: 107000,
    status: "confirmed",
    sellerNote: null,
    createdAt: new Date().toISOString(),
    items: [
      {
        title: locale === "bn" ? "প্রিমিয়াম লিনেন শার্ট" : "Premium Linen Shirt",
        qty: 1,
        variant: locale === "bn" ? "নেভি ব্লু" : "Navy Blue",
        pricePoisha: 95000,
      },
    ],
    photo: "/icon.svg",
    repeatCount: 0,
  },
];

export default function TryPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("home");
  const demoOrders = getDemoOrders(locale);

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9] cyber-bg md:grid md:grid-cols-[250px_1fr]">
      {/* Desktop Sidebar (Identical to /app layout) */}
      <aside className="hidden border-r border-slate-200 dark:border-white/10 md:block">
        <div className="sticky top-0 h-dvh">
          <AppNav
            variant="side"
            demo
            demoTab={activeTab}
            onDemoTabChange={setActiveTab}
          />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top Demo Active Notification Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>✨ {t("try.banner")}</span>
          </div>
          <Link
            href="/#register"
            className="neon-btn h-7 px-3 text-[11px] font-black shadow-[0_0_10px_rgba(0,245,155,0.3)]"
          >
            {t("try.openRealShop")}
          </Link>
        </div>

        {/* Mobile Top Header (Identical to /app layout) */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#07090e]/85 px-4 py-2.5 backdrop-blur-md md:hidden">
          <Link href="/" title={t("nav.backToHome")} className="flex items-center gap-2 group transition hover:opacity-90">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 text-xs font-black text-black shadow-[0_0_10px_rgba(0,245,155,0.3)]">
              {t("brand")[0] || "হ"}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                {t("brand")}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold leading-none">
                {t("try.demoShopName")} · {t("nav.home")}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="page-pad mx-auto max-w-5xl px-4 pt-5 md:px-8">
          {/* Shop Header Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-neon-pulse" />
                <span>{t("try.liveBadge")}</span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
                {t("try.demoShopName")}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("try.demoShopMeta")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/s/demo"
                className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 dark:bg-cyan-950/30 px-3.5 py-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                {t("try.viewLandingDemo")}
              </Link>
              <Link
                href="/#register"
                className="neon-btn h-9 px-4 text-xs font-black shadow-[0_0_15px_rgba(0,245,155,0.35)]"
              >
                {t("try.openRealShop")}
              </Link>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="glass-card rounded-2xl p-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {t("try.todayTotalOrders")}
              </span>
              <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
                {t("try.ordersCountUnit")}
              </p>
              <span className="mt-1 inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {t("try.readyDelivery")}
              </span>
            </div>

            <div className="glass-card rounded-2xl border-emerald-400/30 p-4 shadow-[0_0_15px_rgba(0,245,155,0.08)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {t("try.waitingNew")}
                </span>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-neon-pulse" />
              </div>
              <p className="mt-1 text-2xl font-black text-amber-500 dark:text-amber-400 md:text-3xl">
                {t("try.waitingCountUnit")}
              </p>
              <span className="mt-1 inline-block text-[10px] font-bold text-amber-600 dark:text-amber-300">
                {t("try.callConfirmNote")}
              </span>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {t("try.todaySales")}
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 md:text-3xl">
                {t("try.todaySalesAmount")}
              </p>
              <span className="mt-1 inline-block text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {t("try.advanceAndCod")}
              </span>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {t("try.lpVisitors")}
              </span>
              <p className="mt-1 text-2xl font-black text-cyan-600 dark:text-cyan-400 md:text-3xl">
                {t("try.lpVisitorsCount")}
              </p>
              <span className="mt-1 inline-block text-[10px] font-bold text-cyan-600 dark:text-cyan-300">
                {t("try.conversionRate")}
              </span>
            </div>
          </div>

          {/* Quick Landing Page Promo Banner */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-slate-100 dark:from-emerald-950/40 dark:via-cyan-950/30 dark:to-slate-900/60 p-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-xl text-emerald-600 dark:text-emerald-400">
                🚀
              </span>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white sm:text-sm">
                  {t("try.lpBannerTitle")}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {t("try.lpBannerSub")}
                </p>
              </div>
            </div>
            <Link
              href="/s/demo"
              className="w-full shrink-0 rounded-xl border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-center text-xs font-black text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30 transition sm:w-auto"
            >
              {t("try.viewTemplates")}
            </Link>
          </div>

          {/* Orders Section */}
          <div className="mt-8">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {t("try.inboxOrdersTitle")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("try.inboxOrdersSub")}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {t("orders.feeNotice")}
              </span>
            </div>

            <OrderList orders={demoOrders} demo />
          </div>

          {/* Bottom Register CTA */}
          <div className="mt-10 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-6 text-center shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t("try.bottomCtaTitle")}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {t("try.bottomCtaSub")}
            </p>
            <Link
              href="/#register"
              className="neon-btn mx-auto mt-4 flex max-w-sm items-center justify-center text-xs font-black shadow-[0_0_20px_rgba(0,245,155,0.4)]"
            >
              {t("try.bottomCtaBtn")}
            </Link>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Identical to /app layout) */}
      <BottomNav
        demo
        demoTab={activeTab}
        onDemoTabChange={setActiveTab}
      />
    </div>
  );
}
