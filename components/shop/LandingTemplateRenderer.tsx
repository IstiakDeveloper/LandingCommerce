"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LANDING_TEMPLATES } from "@/lib/landing/templates";
import { CheckoutSheet } from "@/components/shop/CheckoutSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { formatTaka, telLink, waLink } from "@/lib/utils";
import type { LandingTemplate } from "@/lib/landing/templates";
import type { ShopPublic, ProductPublic } from "@/lib/types";

export interface LandingPageData {
  id: string;
  title: string;
  slug: string;
  headline?: string | null;
  subheadline?: string | null;
  template: string;
  features?: string[];
  videoUrl?: string | null;
  gallery?: string[];
  specifications?: { label: string; value: string }[];
  faqs?: { question: string; answer: string }[];
}

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0&modestbranding=1`;
    }
  } catch {
    return null;
  }
  return null;
}

export function LandingTemplateRenderer({
  shop,
  landingPage,
  product,
  templateConfig: propConfig,
  hideHeader = false,
}: {
  shop: ShopPublic;
  landingPage: LandingPageData;
  product?: ProductPublic | null;
  templateConfig?: LandingTemplate;
  hideHeader?: boolean;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(7200);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const templateConfig =
    propConfig ??
    LANDING_TEMPLATES.find((t) => t.id === landingPage.template) ??
    LANDING_TEMPLATES[0];

  // If page doesn't have an attached product, fall back to template default
  const defaultP = templateConfig.defaultProduct;
  const p: ProductPublic = product ?? {
    id: "sample",
    slug: "sample",
    title: defaultP.title,
    pricePoisha: defaultP.pricePoisha,
    compareAtPoisha: defaultP.compareAtPoisha,
    photos: defaultP.gallery || [defaultP.image],
    stock: defaultP.stock,
    badge: templateConfig.badge,
    variants: [],
    isSample: true,
  };

  // Countdown timer for urgency
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const headline = landingPage.title || p.title;
  const subheadline =
    landingPage.headline ||
    (product ? null : defaultP.subtitle);

  const featuresList =
    landingPage.features && landingPage.features.length > 0
      ? landingPage.features
      : defaultP.features;

  const photosList =
    product?.photos && product.photos.length > 0
      ? product.photos
      : defaultP.gallery || [defaultP.image];

  const currentPhoto = photosList[activePhotoIdx] || photosList[0] || "/icon.svg";

  // Video embed support (supports custom videoUrl or default template video)
  const embedUrl = getYouTubeEmbedUrl(
    landingPage.videoUrl || defaultP.videoUrl
  );

  // Specifications
  const specsList =
    landingPage.specifications && landingPage.specifications.length > 0
      ? landingPage.specifications
      : defaultP.specifications || [];

  // FAQs
  const faqsList =
    landingPage.faqs && landingPage.faqs.length > 0
      ? landingPage.faqs
      : defaultP.faqs || [];

  // Reviews
  const reviewsList = defaultP.reviews || [];

  // Calculate discount percentage & savings
  const savingsPoisha =
    p.compareAtPoisha && p.compareAtPoisha > p.pricePoisha
      ? p.compareAtPoisha - p.pricePoisha
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 cyber-bg transition-colors duration-300">
      {/* Top Floating Branding & Contact Header */}
      {!hideHeader && (
        <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#070a12]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 md:px-8">
            <Link
              href={`/s/${shop.slug}`}
              className="flex items-center gap-3 transition hover:opacity-90"
            >
              {shop.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shop.avatar}
                  alt={shop.name}
                  className="h-9 w-9 rounded-full border border-emerald-400/40 object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 font-black text-black shadow-[0_0_12px_rgba(0,245,155,0.4)]">
                  {shop.name.charAt(0) || "হ"}
                </span>
              )}
              <div>
                <span className="block text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {shop.name}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ← সব পণ্য দেখুন
                </span>
              </div>
            </Link>

            {/* Direct Support & Toggles */}
            <div className="flex items-center gap-2">
              {shop.callPhone && (
                <a
                  href={telLink(shop.callPhone)}
                  className="hidden items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:text-slate-900 dark:hover:text-white sm:flex"
                >
                  📞 কল: {shop.callPhone}
                </a>
              )}
              {shop.whatsapp && (
                <a
                  href={waLink(shop.whatsapp, `হ্যালো ${shop.name}, আমি "${headline}" অর্ডার করতে চাই`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
              )}
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </header>
      )}

      {/* Main Landing Page Body */}
      <main className="mx-auto max-w-4xl px-4 py-6 pb-36 md:px-8 md:py-10 space-y-10">
        {/* Template Category & Social Proof Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 shadow-sm dark:shadow-[0_0_15px_rgba(0,245,155,0.15)]">
            <span>{templateConfig.icon}</span>
            <span>{templateConfig.badge}</span>
            <span>·</span>
            <span>১০০% অরিজিনাল কোয়ালিটি</span>
          </div>
        </div>

        {/* Urgency Countdown Bar */}
        <div className="overflow-hidden rounded-2xl border border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 p-3.5 shadow-sm text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span>🔥</span>
              <span>বিশেষ অফার ও ফ্রি উপহার শেষ হতে বাকি:</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono font-black text-slate-900 dark:text-white">
              <span className="rounded-lg bg-white dark:bg-black/60 px-2.5 py-1 text-sm shadow-sm border border-slate-200 dark:border-white/10">
                {String(hours).padStart(2, "0")} <span className="text-[9px] font-sans text-slate-500">ঘণ্টা</span>
              </span>
              <span>:</span>
              <span className="rounded-lg bg-white dark:bg-black/60 px-2.5 py-1 text-sm shadow-sm border border-slate-200 dark:border-white/10">
                {String(minutes).padStart(2, "0")} <span className="text-[9px] font-sans text-slate-500">মিনিট</span>
              </span>
              <span>:</span>
              <span className="rounded-lg bg-white dark:bg-black/60 px-2.5 py-1 text-sm text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-white/10">
                {String(seconds).padStart(2, "0")} <span className="text-[9px] font-sans text-slate-500">সেকেন্ড</span>
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: HERO PRODUCT SPOTLIGHT & GALLERY */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-gradient-to-b dark:from-[#111a2e]/90 dark:to-[#080d18]/90 p-5 shadow-2xl backdrop-blur-2xl md:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left: Interactive Multi-Photo Gallery */}
            <div className="space-y-3">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/60 shadow-inner group">
                <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-xl" />
                
                {/* Main Active Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPhoto}
                  alt={headline}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 rounded-full bg-emerald-500/90 text-black px-3 py-1 text-[11px] font-black shadow-md backdrop-blur-sm">
                  {templateConfig.badge}
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-black/60 text-white border border-white/20 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm">
                  📷 {activePhotoIdx + 1} / {photosList.length}
                </div>
                <div className="absolute bottom-3 left-3 rounded-xl bg-black/70 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-black backdrop-blur-sm">
                  ✓ ক্যাশ অন ডেলিভারি
                </div>
              </div>

              {/* Thumbnails Row (Multiple Photos) */}
              {photosList.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {photosList.map((photo, idx) => {
                    const isSelected = activePhotoIdx === idx;
                    return (
                      <button
                        key={photo + idx}
                        type="button"
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          isSelected
                            ? "border-emerald-500 scale-105 shadow-[0_0_12px_rgba(0,245,155,0.4)]"
                            : "border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={`${headline} photo ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Product Details, Pricing & Instant Buy CTA */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                  <span>⭐⭐⭐⭐⭐</span>
                  <span className="font-mono text-slate-900 dark:text-white font-black">৪.৯</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({defaultP.reviewCount} জন ক্রেতা সন্তুষ্ট)
                  </span>
                </div>

                <h1 className="mt-2.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl leading-snug">
                  {headline}
                </h1>
                {subheadline && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 md:text-sm leading-relaxed">
                    {subheadline}
                  </p>
                )}

                {/* Price Row */}
                <div className="mt-4 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_12px_rgba(0,245,155,0.3)] md:text-4xl">
                    {formatTaka(p.pricePoisha)}
                  </span>
                  {p.compareAtPoisha && (
                    <span className="text-lg font-bold text-slate-400 line-through">
                      {formatTaka(p.compareAtPoisha)}
                    </span>
                  )}
                  {savingsPoisha > 0 && (
                    <span className="rounded-lg bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-xs font-black text-red-600 dark:text-red-300">
                      {formatTaka(savingsPoisha)} সাশ্রয়!
                    </span>
                  )}
                </div>

                {/* Delivery Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <span className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-1">
                    🚚 ঢাকায় ৬০৳ · ঢাকার বাইরে ১২০৳
                  </span>
                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">
                    💵 ডেলিভারি ম্যানের সামনে দেখে পেমেন্ট
                  </span>
                </div>

                {/* Feature Highlights */}
                <div className="mt-5 border-t border-slate-200 dark:border-white/10 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    এই পণ্যের বিশেষ বৈশিষ্ট্য:
                  </p>
                  <ul className="mt-2.5 space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {featuresList.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          ✓
                        </span>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instant Buy CTA Button */}
              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  className="neon-btn h-14 w-full text-base font-black shadow-[0_0_25px_rgba(0,245,155,0.4)] flex items-center justify-center gap-2 rounded-2xl"
                >
                  <span>⚡ এখনই অর্ডার করুন · ক্যাশ অন ডেলিভারি</span>
                </button>
                <p className="mt-2 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  🔒 কোনো অগ্রিম টাকা লাগবে না · পণ্য হাতে পেয়ে মূল্য দিন
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TRUST PILLARS (৪টি ভরসার স্তম্ভ) */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-4 text-center shadow-sm">
            <span className="text-2xl">🛡️</span>
            <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">১০০% আসল প্রোডাক্ট</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">কোয়ালিটি যাচাই করে দেওয়া</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-4 text-center shadow-sm">
            <span className="text-2xl">📦</span>
            <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">দেখে নেওয়ার সুযোগ</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">ডেলিভারির সময় খুলে দেখুন</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-4 text-center shadow-sm">
            <span className="text-2xl">⚡</span>
            <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">দ্রুততম ডেলিভারি</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">২৪-৭২ ঘণ্টায় হোম ডেলিভারি</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-4 text-center shadow-sm">
            <span className="text-2xl">🔄</span>
            <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">সহজ এক্সচেঞ্জ পলিসি</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">ত্রুটি থাকলে বিনামূল্যে বদল</p>
          </div>
        </section>

        {/* SECTION 3: YOUTUBE VIDEO EMBED SHOWCASE */}
        {embedUrl && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl md:p-8">
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-bold text-red-600 dark:text-red-400 mb-2">
                <span>📹</span>
                <span>ভিডিও রিভিউ ও ডেমো</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                ভিডিওতে পণ্যের আসল রূপ ও ফিনিশিং দেখে নিন
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                কোনো এডিটিং ছাড়া আসল ক্যামেরায় ধারণকৃত ভিডিও যাতে কোয়ালিটি নিয়ে কোনো সন্দেহ না থাকে
              </p>
            </div>

            {/* Responsive 16:9 YouTube Container */}
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-300 dark:border-white/15 bg-black shadow-2xl aspect-video">
              <iframe
                src={embedUrl}
                title="Product Demonstration Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>

            {/* Video CTA */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 text-xs font-black shadow-md transition"
              >
                <span>⚡ ভিডিও দেখে পছন্দ হয়েছে? এখনই অর্ডার করুন</span>
              </button>
            </div>
          </section>
        )}

        {/* SECTION 4: DETAILED PRODUCT SPECIFICATIONS */}
        {specsList.length > 0 && (
          <section className="rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/80 p-5 shadow-xl md:p-8">
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                <span>📋</span>
                <span>স্পেসিফিকেশন ও বিস্তারিত</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                পণ্যের পূর্ণাঙ্গ স্পেসিফিকেশন ও বিবরণ
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                অর্ডারের পূর্বে প্রতিটি খুঁটিনাটি তথ্য দেখে নিশ্চিত হোন
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {specsList.map((spec, idx) => (
                <div
                  key={spec.label + idx}
                  className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/50 px-4 py-3 text-xs"
                >
                  <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="text-emerald-500">▪</span>
                    <span>{spec.label}:</span>
                  </span>
                  <span className="font-black text-slate-900 dark:text-white text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: FREQUENTLY ASKED QUESTIONS (FAQ) */}
        {faqsList.length > 0 && (
          <section className="rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/80 p-5 shadow-xl md:p-8">
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-400 mb-2">
                <span>❓</span>
                <span>সাধারণ জিজ্ঞাসা ও উত্তর</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                আপনার মনে থাকা কিছু জরুরি প্রশ্নের উত্তর
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                ডেলিভারি, চেক করা ও রিটার্ন সম্পর্কিত সব তথ্যের সহজ সমাধান
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {faqsList.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-800/40 transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                          {idx + 1}
                        </span>
                        <span>{faq.question}</span>
                      </span>
                      <span className="text-base text-slate-400 ml-2">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-200 dark:border-white/10 px-4 py-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-black/20">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 6: CUSTOMER REVIEWS & TESTIMONIALS */}
        {reviewsList.length > 0 && (
          <section className="rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/80 p-5 shadow-xl md:p-8">
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                <span>⭐</span>
                <span>গ্রাহক রিভিউ</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                আমাদের সন্তুষ্ট ক্রেতাদের অভিমত
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.name}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-800/40 p-4 text-xs space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-500">{"⭐".repeat(rev.rating)}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-2 text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {rev.name} ({rev.city})
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ ভেরিফাইড ক্রেতা
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 7: FINAL ORDER CTA BANNER */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-tr from-emerald-950/80 via-slate-900 to-cyan-950/80 p-6 md:p-10 text-center shadow-2xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <h2 className="text-2xl md:text-3xl font-black text-white">
            অফারটি শেষ হওয়ার আগেই আপনার অর্ডার নিশ্চিত করুন
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-300 max-w-lg mx-auto">
            ক্যাশ অন ডেলিভারিতে শাড়িটি হাতে পেয়ে চেক করে নেওয়ার শতভাগ নিশ্চয়তা।
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="neon-btn h-13 px-8 text-sm font-black shadow-[0_0_25px_rgba(0,245,155,0.45)] w-full sm:w-auto"
            >
              ⚡ এখনই অর্ডার করুন ({formatTaka(p.pricePoisha)})
            </button>
            {shop.whatsapp && (
              <a
                href={waLink(shop.whatsapp, `হ্যালো ${shop.name}, আমি "${headline}" সম্পর্কে জানতে চাই`)}
                target="_blank"
                rel="noreferrer"
                className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 px-6 text-sm font-bold text-white transition w-full sm:w-auto"
              >
                <span>💬 WhatsApp-এ পরামর্শ নিন</span>
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Floating Bottom Mobile/Desktop Order Bar */}
      <div className="mobile-thumb-bar">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-xs">{p.title}</p>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatTaka(p.pricePoisha)}</p>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="neon-btn flex h-12 flex-1 sm:flex-initial sm:px-8 items-center justify-center text-sm font-black shadow-[0_0_20px_rgba(0,245,155,0.45)]"
          >
            ⚡ এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)
          </button>
        </div>
      </div>

      {/* Polished Order Modal */}
      {sheetOpen && (
        <CheckoutSheet
          open={sheetOpen}
          shop={shop}
          product={p}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
