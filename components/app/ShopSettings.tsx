"use client";

import { logoutAction } from "@/app/actions/auth";
import {
  updateShopAction,
  createLandingPageAction,
  deleteLandingPageAction,
} from "@/app/actions/shop";
import { THEMES } from "@/lib/themes";
import { LANDING_TEMPLATES } from "@/lib/landing/templates";
import { formatTaka, poishaToTaka } from "@/lib/utils";
import { useEffect, useState, type ReactNode } from "react";
import type { ShopBalance } from "@/lib/billing/ledger";
import QRCode from "qrcode";
import Link from "next/link";

type ShopInit = {
  name: string;
  slug: string;
  themeId: string;
  cover: string | null;
  avatar: string | null;
  fbPageUrl: string | null;
  whatsapp: string | null;
  callPhone: string | null;
  bkashNumber: string | null;
  nagadNumber: string | null;
  dhakaFeePoisha: number;
  outsideFeePoisha: number;
  freeOverPoisha: number | null;
  advanceEnabled: boolean;
  advancePoisha: number;
  paused: boolean;
  language: string;
  fontScale: string;
  templates: { key: string; body: string }[];
};

type LandingPageItem = {
  id: string;
  title: string;
  slug: string;
  template: string;
  productId: string | null;
  isActive: boolean;
  product?: { title: string; pricePoisha: number } | null;
};

type ProductSimple = {
  id: string;
  title: string;
  pricePoisha: number;
};

export function ShopSettings({
  shop,
  landingPages = [],
  products = [],
  balance,
}: {
  shop: ShopInit;
  landingPages?: LandingPageItem[];
  products?: ProductSimple[];
  balance?: ShopBalance;
}) {
  const [open, setOpen] = useState("landing-pages");
  const [name, setName] = useState(shop.name);
  const [themeId, setThemeId] = useState(shop.themeId);
  const [paused, setPaused] = useState(shop.paused);
  const [bkash, setBkash] = useState(shop.bkashNumber ?? "");
  const [nagad, setNagad] = useState(shop.nagadNumber ?? "");
  const [call, setCall] = useState(shop.callPhone ?? "");
  const [wa, setWa] = useState(shop.whatsapp ?? "");
  const [fb, setFb] = useState(shop.fbPageUrl ?? "");
  const [dhaka, setDhaka] = useState(String(poishaToTaka(shop.dhakaFeePoisha)));
  const [outside, setOutside] = useState(String(poishaToTaka(shop.outsideFeePoisha)));
  const [freeOver, setFreeOver] = useState(
    shop.freeOverPoisha ? String(poishaToTaka(shop.freeOverPoisha)) : ""
  );
  const [advanceOn, setAdvanceOn] = useState(shop.advanceEnabled);
  const [advance, setAdvance] = useState(String(poishaToTaka(shop.advancePoisha)));
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  // New Landing Page Modal / State
  const [lpTitle, setLpTitle] = useState("");
  const [lpTemplate, setLpTemplate] = useState("single-hero");
  const [lpProductId, setLpProductId] = useState(products[0]?.id ?? "");
  const [lpBusy, setLpBusy] = useState(false);
  const [copiedLpId, setCopiedLpId] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shopUrl = `${origin}/s/${shop.slug}`;
  const caption = `${shop.name} থেকে সরাসরি অর্ডার করুন — লগইন লাগবে না।\n${shopUrl}`;

  useEffect(() => {
    QRCode.toDataURL(shopUrl, { margin: 1, width: 280 })
      .then(setQr)
      .catch(() => {});
  }, [shopUrl]);

  async function saveSettings() {
    setBusy(true);
    await updateShopAction({
      name,
      themeId,
      paused,
      bkashNumber: bkash,
      nagadNumber: nagad,
      callPhone: call,
      whatsapp: wa,
      fbPageUrl: fb,
      dhakaFeeTaka: Number(dhaka) || 0,
      outsideFeeTaka: Number(outside) || 0,
      freeOverTaka: freeOver ? Number(freeOver) : null,
      advanceEnabled: advanceOn,
      advanceTaka: Number(advance) || 0,
    });
    setBusy(false);
    alert("সেটিংস সফলভাবে সেভ হয়েছে!");
  }

  async function createLandingPage(e: React.FormEvent) {
    e.preventDefault();
    if (!lpTitle.trim()) return;
    setLpBusy(true);
    await createLandingPageAction({
      title: lpTitle,
      template: lpTemplate,
      productId: lpProductId || undefined,
    });
    setLpBusy(false);
    setLpTitle("");
    window.location.reload();
  }

  function copyLpLink(lpSlug: string, id: string) {
    const url = `${origin}/s/${shop.slug}/lp/${lpSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLpId(id);
    setTimeout(() => setCopiedLpId(null), 2000);
  }

  function acc(id: string, title: string, badgeText?: string, children?: ReactNode) {
    const isOpen = open === id;
    return (
      <section className="mb-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gradient-to-b dark:from-[#111a2e]/90 dark:to-[#080d18]/90 shadow-sm dark:shadow-lg backdrop-blur-xl transition">
        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-between px-5 text-left font-black text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-300"
          onClick={() => setOpen(isOpen ? "" : id)}
        >
          <div className="flex items-center gap-2.5">
            <span>{title}</span>
            {badgeText && (
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                {badgeText}
              </span>
            )}
          </div>
          <span className="text-xl font-mono text-emerald-600 dark:text-emerald-400">{isOpen ? "−" : "+"}</span>
        </button>
        {isOpen && <div className="border-t border-slate-100 dark:border-white/5 p-5 pt-3">{children}</div>}
      </section>
    );
  }

  return (
    <div className="page-pad mx-auto max-w-3xl px-4 pt-4 md:px-8">
      <header className="safe-top mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white md:text-3xl">শপ সেটিংস ও কন্ট্রোল</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">দোকানের তথ্য, ল্যান্ডিং পেজসমূহ ও হিসাব নিয়ন্ত্রণ</p>
        </div>
        <button
          type="button"
          onClick={() => logoutAction()}
          className="rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/60"
        >
          লগআউট
        </button>
      </header>

      {/* 1. Multi-Landing Page Hub */}
      {acc(
        "landing-pages",
        "⚡ মাল্টি-ল্যান্ডিং পেজ হাব",
        `${landingPages.length}টি ল্যান্ডিং পেজ`,
        <div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            ফেসবুক বিজ্ঞাপনের জন্য এক বা একাধিক আকর্ষণীয় সেলস ল্যান্ডিং পেজ তৈরি করুন। প্রতিটি পেজের লিংক আলাদা এবং হাই-কনভার্সন।
          </p>

          {/* Create New Landing Page Form */}
          <form
            onSubmit={createLandingPage}
            className="mt-4 rounded-2xl border border-cyan-400/30 bg-cyan-50/50 dark:bg-gradient-to-r dark:from-cyan-950/30 dark:to-slate-900/40 p-4"
          >
            <p className="text-xs font-black text-cyan-800 dark:text-cyan-300">+ নতুন ল্যান্ডিং পেজ তৈরি করুন:</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">পেজের নাম</label>
                <input
                  className="cyber-field mt-1 text-xs"
                  required
                  placeholder="যেমন: জামদানি মেগা সেল বা কম্বো অফার"
                  value={lpTitle}
                  onChange={(e) => setLpTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">টেমপ্লেট ডিজাইন</label>
                <select
                  className="cyber-field mt-1 text-xs bg-white dark:bg-slate-900"
                  value={lpTemplate}
                  onChange={(e) => setLpTemplate(e.target.value)}
                >
                  {LANDING_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {t.icon} {t.nameBn} ({t.badge})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {products.length > 0 && (
              <div className="mt-3">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">সংযুক্ত প্রোডাক্ট</label>
                <select
                  className="cyber-field mt-1 text-xs bg-white dark:bg-slate-900"
                  value={lpProductId}
                  onChange={(e) => setLpProductId(e.target.value)}
                >
                  <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    কোনো নির্দিষ্ট প্রোডাক্ট নয় (জেনারেল)
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {p.title} — {formatTaka(p.pricePoisha)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={lpBusy || !lpTitle.trim()}
              className="neon-btn mt-3.5 h-10 w-full text-xs font-black shadow-[0_0_15px_rgba(0,210,255,0.3)]"
            >
              {lpBusy ? "তৈরি হচ্ছে…" : "⚡ ল্যান্ডিং পেজ তৈরি করুন"}
            </button>
          </form>

          {/* List of Existing Landing Pages */}
          <div className="mt-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              আপনার সক্রিয় ল্যান্ডিং পেজসমূহ:
            </p>
            {landingPages.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                এখনো কোনো কাস্টম ল্যান্ডিং পেজ তৈরি করা হয়নি। উপরের ফর্ম থেকে প্রথমটি তৈরি করুন।
              </div>
            ) : (
              landingPages.map((lp) => {
                const lpUrl = `${origin}/s/${shop.slug}/lp/${lp.slug}`;
                const tpl = LANDING_TEMPLATES.find((t) => t.id === lp.template);
                return (
                  <div
                    key={lp.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 p-3.5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{tpl?.icon ?? "⚡"}</span>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{lp.title}</p>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          {tpl?.nameBn ?? lp.template}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 truncate max-w-md">
                        {lpUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyLpLink(lp.slug, lp.id)}
                        className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                      >
                        {copiedLpId === lp.id ? "✓ কপি হয়েছে" : "📋 লিংক কপি"}
                      </button>
                      <Link
                        href={`/s/${shop.slug}/lp/${lp.slug}`}
                        target="_blank"
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-black text-black shadow-[0_0_10px_rgba(0,245,155,0.3)]"
                      >
                        লাইভ ভিউ
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm("এই ল্যান্ডিং পেজটি মুছে ফেলতে চান?")) {
                            await deleteLandingPageAction(lp.id);
                            window.location.reload();
                          }
                        }}
                        className="rounded-lg border border-red-500/30 px-2 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 2. Hisab & Billing Ledger */}
      {acc(
        "hisab",
        "💰 হিসাব ও বিলিং (প্রতি অর্ডার ৫৳)",
        balance ? `বাকি: ${formatTaka(balance.currentDuePoisha)}` : "৫৳ হিসাব",
        <div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">বর্তমান বকেয়া প্ল্যাটফর্ম ফি</p>
                <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
                  {balance ? formatTaka(balance.currentDuePoisha) : "৳০"}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                ৫৳ / সফল অর্ডার
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              মোট বিলযোগ্য অর্ডার: {balance?.totalOrders ?? 0} টি · বাতিল/ফেক অর্ডারে ফি রিভার্সাল হয়েছে
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 p-4 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white">ফি পরিশোধের নিয়মাবলী:</p>
            <p className="mt-1">
              বকেয়া ফি পরিশোধ করতে প্ল্যাটফর্মের বিকাশ বা নগদ নম্বরে সেন্ড মানি করুন এবং TrxID সাপোর্ট নম্বরে পাঠিয়ে দিন।
            </p>
            <div className="mt-2 flex flex-wrap gap-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <span>বিকাশ (Personal): 01700-000000</span>
              <span>নগদ (Personal): 01800-000000</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Share & QR */}
      {acc(
        "share",
        "🔗 দোকান শেয়ার ও QR কোড",
        undefined,
        <div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt="QR" className="h-32 w-32 rounded-xl border border-slate-200 dark:border-white/15 bg-white p-1 shadow-md" />
            ) : null}
            <div className="flex-1 space-y-2 text-xs">
              <p className="font-mono text-cyan-600 dark:text-cyan-400 font-bold break-all">{shopUrl}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  className="neon-btn h-9 px-4 text-xs font-black shadow-[0_0_15px_rgba(0,245,155,0.3)]"
                  onClick={() => {
                    navigator.clipboard.writeText(shopUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "✓ কপি হয়েছে" : "📋 লিংক কপি"}
                </button>
                <button
                  type="button"
                  className="neon-btn-secondary h-9 px-4 text-xs font-bold"
                  onClick={() => {
                    navigator.clipboard.writeText(caption);
                    alert("ফেসবুক পোস্ট ক্যাপশন কপি হয়েছে!");
                  }}
                >
                  📝 ক্যাপশনসহ কপি
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Design & 10 Themes */}
      {acc(
        "theme",
        "🎨 ডিজাইন ও থিম নির্বাচন",
        THEMES.find((x) => x.id === themeId)?.nameBn,
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">দোকানের নাম</label>
            <input
              className="cyber-field mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার দোকানের নাম লিখুন"
            />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">আপনার পছন্দের রেডিমেড থিম সিলেক্ট করুন:</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {THEMES.map((th) => {
                const selected = themeId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setThemeId(th.id)}
                    className={`overflow-hidden rounded-xl border text-left text-xs font-bold transition ${
                      selected ? "border-emerald-400 shadow-[0_0_12px_rgba(0,245,155,0.4)]" : "border-slate-200 dark:border-white/10"
                    }`}
                    style={{ background: th.bg, color: th.text }}
                  >
                    <div className="h-8" style={{ background: th.primary }} />
                    <p className="p-2 truncate">{th.nameBn}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-[#00f59b]"
              checked={paused}
              onChange={(e) => setPaused(e.target.checked)}
            />
            <span>দোকানে নতুন অর্ডার গ্রহণ সাময়িক বন্ধ রাখুন (Pause shop)</span>
          </label>
        </div>
      )}

      {/* 5. Delivery Fees */}
      {acc(
        "delivery",
        "🚚 ডেলিভারি চার্জ ও অ্যাডভান্স",
        undefined,
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">ঢাকায় ডেলিভারি ৳</label>
              <input
                className="cyber-field mt-1 font-mono font-bold"
                inputMode="numeric"
                value={dhaka}
                onChange={(e) => setDhaka(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">ঢাকার বাইরে ৳</label>
              <input
                className="cyber-field mt-1 font-mono font-bold"
                inputMode="numeric"
                value={outside}
                onChange={(e) => setOutside(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">কত টাকার উপরে ডেলিভারি ফ্রি? ৳</label>
            <input
              className="cyber-field mt-1 font-mono"
              placeholder="যেমন: ২০০০ (খালি রাখলে প্রযোজ্য নয়)"
              value={freeOver}
              onChange={(e) => setFreeOver(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-[#00f59b]"
              checked={advanceOn}
              onChange={(e) => setAdvanceOn(e.target.checked)}
            />
            <span>অর্ডার কনফার্মেশনের জন্য অগ্রিম ডেলিভারি চার্জ নেব</span>
          </label>
          {advanceOn && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">অ্যাডভান্স কত টাকা? ৳</label>
              <input
                className="cyber-field mt-1 font-mono"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* 6. Payment Numbers & Contact */}
      {acc(
        "contact",
        "💳 পেমেন্ট নম্বর ও যোগাযোগ",
        undefined,
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">বিকাশ নম্বর</label>
              <input
                className="cyber-field mt-1 font-mono"
                placeholder="01XXXXXXXXX"
                value={bkash}
                onChange={(e) => setBkash(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">নগদ নম্বর</label>
              <input
                className="cyber-field mt-1 font-mono"
                placeholder="01XXXXXXXXX"
                value={nagad}
                onChange={(e) => setNagad(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">WhatsApp নম্বর</label>
              <input
                className="cyber-field mt-1 font-mono"
                placeholder="01XXXXXXXXX"
                value={wa}
                onChange={(e) => setWa(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">কল নম্বর</label>
              <input
                className="cyber-field mt-1 font-mono"
                placeholder="01XXXXXXXXX"
                value={call}
                onChange={(e) => setCall(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">ফেসবুক পেজের লিংক</label>
            <input
              className="cyber-field mt-1 text-xs"
              placeholder="https://facebook.com/yourpage"
              value={fb}
              onChange={(e) => setFb(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Save Settings Action Button */}
      <div className="mt-6">
        <button
          type="button"
          disabled={busy}
          onClick={saveSettings}
          className="neon-btn min-h-[50px] w-full text-sm font-black shadow-[0_0_20px_rgba(0,245,155,0.4)]"
        >
          {busy ? "সেভ হচ্ছে…" : "💾 সেটিংস সেভ করুন"}
        </button>
      </div>
    </div>
  );
}
