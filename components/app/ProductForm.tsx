"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { compressImage } from "@/lib/image/compress";
import { parseCaption } from "@/lib/product/parseCaption";
import {
  saveProductAction,
  deleteProductAction,
  duplicateProductAction,
} from "@/app/actions/product";

interface ProductFormData {
  id?: string;
  title: string;
  pricePoisha: number;
  compareAtPoisha?: number | null;
  stock: number;
  badge?: string | null;
  hideWhenZero?: boolean;
  photos: string[];
  variants?: { name: string; options: string[] }[];
}

export function ProductForm({
  initial,
  shopSlug,
}: {
  initial?: ProductFormData;
  shopSlug?: string;
}) {
  const t = useTranslations("products");
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [price, setPrice] = useState(
    initial?.pricePoisha ? String(initial.pricePoisha / 100) : ""
  );
  const [strike, setStrike] = useState(
    initial?.compareAtPoisha ? String(initial.compareAtPoisha / 100) : ""
  );
  const [stock, setStock] = useState<number>(initial?.stock ?? 10);
  const [badge, setBadge] = useState(initial?.badge ?? "");
  const [hideWhenZero, setHideWhenZero] = useState(initial?.hideWhenZero ?? false);
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [paste, setPaste] = useState("");
  const [sizes, setSizes] = useState(
    initial?.variants?.find((v) => v.name.toLowerCase().includes("size"))?.options.join(" ") ?? ""
  );
  const [busy, setBusy] = useState(false);

  async function addPhoto(file: File) {
    if (photos.length >= 4) return;
    const blob = await compressImage(file, 1200, 0.75);
    const body = new FormData();
    body.append("file", blob, "photo.jpg");
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (data.url) setPhotos((prev) => [...prev, data.url]);
  }

  async function save() {
    setBusy(true);
    const variants = sizes.trim()
      ? [{ name: "সাইজ", options: sizes.trim().split(/\s+/) }]
      : [];

    await saveProductAction({
      id: initial?.id,
      title,
      priceTaka: Number(price) || 0,
      compareAtTaka: strike ? Number(strike) : null,
      stock,
      badge: badge || null,
      hideWhenZero,
      photos,
      variants,
    });
    setBusy(false);
    router.push("/app/products");
  }

  return (
    <div className="page-pad mx-auto max-w-2xl px-4 pt-4 md:px-8">
      <div className="safe-top mb-4 flex items-center justify-between">
        <Link
          href="/app/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          ← প্রোডাক্ট তালিকায় ফিরে যান
        </Link>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {initial?.id ? "প্রোডাক্ট এডিট" : "নতুন প্রোডাক্ট"}
        </span>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gradient-to-b dark:from-[#111a2e]/90 dark:to-[#080d18]/90 p-5 shadow-xl backdrop-blur-xl md:p-8">
        <h1 className="text-xl font-black text-slate-900 dark:text-white md:text-2xl">
          {initial?.id ? "প্রোডাক্ট আপডেট করুন" : "নতুন প্রোডাক্ট যোগ করুন"}
        </h1>

        {/* Photo Upload Area */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            প্রোডাক্ট ছবি (সর্বোচ্চ ৪টি)
          </label>
          <label className="mt-2 flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-slate-900/60 p-4 transition hover:border-emerald-400/50 hover:bg-slate-100 dark:hover:bg-slate-900/90">
            {photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[0]} alt="" className="h-full w-full rounded-xl object-contain" />
            ) : (
              <div className="text-center">
                <span className="text-3xl">📷</span>
                <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">ছবি আপলোড করতে ট্যাপ করুন</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">ক্যামেরা বা গ্যালারি থেকে ছবি বাছুন (অটো কম্প্রেস হবে)</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && addPhoto(e.target.files[0])}
            />
          </label>

          {photos.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {photos.map((p, idx) => (
                <div key={p} className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Facebook Caption Parser */}
        <div className="mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-50/50 dark:bg-slate-950/60 p-3.5">
          <label className="block text-[11px] font-bold text-cyan-800 dark:text-cyan-300">
            ⚡ ফেসবুক পোস্টের ক্যাপশন থেকে অটো-ফিল করুন:
          </label>
          <textarea
            className="cyber-field mt-1.5 text-xs"
            rows={2}
            placeholder="ফেসবুক পোস্টের লেখা এখানে পেস্ট করলেই টাইটেল ও দাম নিজে থেকে বসে যাবে…"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            onBlur={() => {
              const p = parseCaption(paste);
              if (p.title) setTitle(p.title);
              if (p.priceTaka) setPrice(String(p.priceTaka));
            }}
          />
        </div>

        {/* Form Fields */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t("name")}
            </label>
            <input
              className="cyber-field mt-1.5 font-semibold"
              placeholder="যেমন: প্রিমিয়াম কাতান শাড়ি বা টি-শার্ট"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t("price")}
              </label>
              <input
                className="cyber-field mt-1.5 font-mono font-bold"
                inputMode="numeric"
                placeholder="যেমন: ১২৫০"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t("strike")}
              </label>
              <input
                className="cyber-field mt-1.5 font-mono"
                inputMode="numeric"
                placeholder="আগের দাম (অপশনাল)"
                value={strike}
                onChange={(e) => setStrike(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t("stock")}
              </label>
              <input
                className="cyber-field mt-1.5 font-mono font-bold"
                inputMode="numeric"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                সাইজ / ভেরিয়েন্ট
              </label>
              <input
                className="cyber-field mt-1.5 text-xs"
                placeholder="M L XL XXL"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
              />
            </div>
          </div>

          {/* Badges */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              অফার ব্যাজ
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { id: "", label: "কোনোটি না" },
                { id: "new", label: "🔥 নতুন" },
                { id: "sale", label: "⚡ সেল অফার" },
                { id: "popular", label: "⭐ বেস্টসেলার" },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBadge(b.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    badge === b.id
                      ? "border border-emerald-400 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-[0_0_12px_rgba(0,245,155,0.3)]"
                      : "border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2.5 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-[#00f59b]"
              checked={hideWhenZero}
              onChange={(e) => setHideWhenZero(e.target.checked)}
            />
            <span>স্টক শেষ হলে কাস্টমার শপ থেকে পণ্যটি লুকিয়ে রাখুন</span>
          </label>
        </div>

        {/* Existing Product Actions */}
        {initial?.id && (
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 dark:border-white/10 pt-4">
            <button
              type="button"
              className="flex h-11 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              onClick={() =>
                duplicateProductAction(initial.id!).then(() => router.push("/app/products"))
              }
            >
              📑 কপি করে নতুন বানান
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-950/30 text-xs font-bold text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/60"
              onClick={() =>
                deleteProductAction(initial.id!).then(() => router.push("/app/products"))
              }
            >
              🗑️ ডিলিট করুন
            </button>
          </div>
        )}

        {/* Save CTA */}
        <button
          type="button"
          disabled={busy || !title || !price}
          onClick={save}
          className="neon-btn mt-6 min-h-[50px] w-full text-sm font-black shadow-[0_0_20px_rgba(0,245,155,0.4)]"
        >
          {busy ? "সেভ হচ্ছে…" : "💾 প্রোডাক্ট সেভ করুন"}
        </button>
      </div>
    </div>
  );
}
