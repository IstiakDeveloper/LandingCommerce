"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { LANDING_TEMPLATES, LandingTemplateId } from "@/lib/landing/templates";
import { LandingTemplateRenderer } from "@/components/shop/LandingTemplateRenderer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { ShopPublic, ProductPublic } from "@/lib/types";

export function MultiLandingDemo() {
  const locale = useLocale();
  const isEn = locale === "en";

  const [activeTemplateId, setActiveTemplateId] = useState<LandingTemplateId>("single-hero");

  const activeTemplate =
    LANDING_TEMPLATES.find((t) => t.id === activeTemplateId) ?? LANDING_TEMPLATES[0];
  const p = activeTemplate.defaultProduct;

  // Mock shop data for CheckoutSheet
  const demoShop: ShopPublic = {
    id: "demo-shop-id",
    name: isEn ? "DokanDari Demo Store" : "দোকানদারি ডেমো শপ",
    slug: "demo",
    themeId: "shada-dokaan",
    cover: null,
    avatar: null,
    fbPageUrl: "https://facebook.com",
    whatsapp: "01700000000",
    callPhone: "01700000000",
    bkashNumber: "01700000000",
    nagadNumber: "01700000000",
    dhakaFeePoisha: 6000,
    outsideFeePoisha: 12000,
    freeOverPoisha: 200000,
    advanceEnabled: false,
    advancePoisha: 10000,
    paused: false,
    language: isEn ? "en" : "bn",
  };

  const demoProduct: ProductPublic = {
    id: `demo-prod-${activeTemplate.id}`,
    slug: `demo-${activeTemplate.id}`,
    title: p.title,
    pricePoisha: p.pricePoisha,
    compareAtPoisha: p.compareAtPoisha,
    photos: p.gallery || [p.image],
    stock: p.stock,
    badge: activeTemplate.badge,
    variants: [],
    isSample: true,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07090e] dark:text-[#f1f5f9] cyber-bg">
      {/* Top Demo Template Switcher Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:px-8">
          {/* Official Brand Logo & Home Route Link */}
          <Link
            href="/"
            title={isEn ? "Go to Homepage" : "মূল পেজে ফিরে যান"}
            className="flex items-center gap-2.5 transition hover:opacity-95 group"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-sm font-black text-black shadow-[0_0_15px_rgba(0,245,155,0.4)]">
              {isEn ? "H" : "হ"}
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 border border-white dark:border-[#07090e] animate-neon-pulse" />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  {isEn ? "DokanDari" : "দোকানদারি"}
                </span>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                  {isEn ? "DEMO HUB" : "ডেমো হাব"}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {isEn ? "← Click to return Home" : "← মূল হোমপেজে ফিরে যান"}
              </p>
            </div>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/try"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
            >
              📊 {isEn ? "Demo Dashboard" : "ডেমো ড্যাশবোর্ড"}
            </Link>
            <ThemeToggle />
            <LanguageToggle />
            <Link
              href="/#register"
              className="neon-btn h-8 px-3 text-[11px] font-extrabold shadow-[0_0_12px_rgba(0,245,155,0.3)]"
            >
              {isEn ? "⚡ Create Your Shop" : "⚡ নিজের পেজ খুলুন"}
            </Link>
          </div>
        </div>

        {/* Template Switcher Tabs */}
        <div className="border-t border-slate-200/60 dark:border-white/5 bg-slate-100/70 dark:bg-black/40 px-4 py-2">
          <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="shrink-0 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isEn ? "Template Demos:" : "টেমপ্লেট ডেমো:"}
            </span>
            {LANDING_TEMPLATES.map((tpl) => {
              const isActive = tpl.id === activeTemplateId;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setActiveTemplateId(tpl.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    isActive
                      ? "border border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-300 shadow-[0_0_15px_rgba(0,245,155,0.25)]"
                      : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span>{tpl.icon}</span>
                  <span>{isEn ? tpl.nameEn : tpl.nameBn}</span>
                  {isActive && (
                    <span className="ml-1 rounded-full bg-emerald-400 px-1.5 py-0.2 text-[9px] font-black text-black">
                      {isEn ? "LIVE" : "লাইভ"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Dynamic Landing Page Template Content */}
      <LandingTemplateRenderer
        key={activeTemplate.id}
        shop={demoShop}
        landingPage={{
          id: `demo-${activeTemplate.id}`,
          title: p.title,
          slug: `demo-${activeTemplate.id}`,
          headline: p.subtitle,
          subheadline: null,
          template: activeTemplate.id,
          features: p.features,
          gallery: p.gallery,
          videoUrl: p.videoUrl,
          specifications: p.specifications,
          faqs: p.faqs,
        }}
        product={demoProduct}
        templateConfig={activeTemplate}
        hideHeader={true}
      />
    </div>
  );
}
