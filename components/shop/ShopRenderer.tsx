"use client";

import { CheckoutSheet } from "@/components/shop/CheckoutSheet";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThumbBar } from "@/components/mobile/ThumbBar";
import { getTheme, themeStyle } from "@/lib/themes";
import type { ProductPublic, ShopPublic } from "@/lib/types";
import { formatTaka, telLink, waLink } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export function ShopHome({
  shop,
  products,
}: {
  shop: ShopPublic;
  products: ProductPublic[];
}) {
  const theme = getTheme(shop.themeId);
  const t = useTranslations("store");

  function share() {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: shop.name, url }).catch(() => {});
    else navigator.clipboard.writeText(url);
  }

  return (
    <div style={themeStyle(theme)} className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 group transition hover:opacity-85">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 text-xs font-black text-black shadow-[0_0_10px_rgba(0,245,155,0.3)]">
            হ
          </span>
          <span className="text-sm font-black tracking-tight group-hover:text-emerald-500 transition">
            DokanDari
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <button type="button" className="tap rounded-lg px-3 font-bold" onClick={share}>
            Share
          </button>
        </div>
      </header>
      <div className="relative mx-auto max-w-6xl md:px-8">
        <div
          className="relative h-48 w-full overflow-hidden md:h-80 md:rounded-2xl"
          style={{ background: theme.primary }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shop.cover || "/demo/cover.svg"}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shop.avatar || "/demo/avatar.svg"}
          alt=""
          className="absolute -bottom-8 left-4 h-16 w-16 rounded-full border-4 object-cover md:left-12 md:h-20 md:w-20"
          style={{ borderColor: theme.bg }}
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-10 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold md:text-4xl">{shop.name}</h1>
            {shop.paused ? (
              <p className="mt-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: theme.accent }}>
                {t("paused")}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2 md:w-80">
            {shop.callPhone ? (
              <a href={telLink(shop.callPhone)} className="flex h-12 items-center justify-center rounded-lg font-bold" style={{ background: theme.accent }}>
                {t("call")}
              </a>
            ) : null}
            {shop.whatsapp ? (
              <a href={waLink(shop.whatsapp, `হ্যালো ${shop.name}`)} className="flex h-12 items-center justify-center rounded-lg font-bold" style={{ background: theme.primary, color: theme.primaryText }}>
                {t("whatsapp")}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-3 px-4 pb-16 sm:grid-cols-2 md:grid-cols-3 md:gap-5 md:px-8 lg:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/s/${shop.slug}/p/${p.slug}`}
            className="overflow-hidden border border-black/5 transition hover:-translate-y-0.5"
            style={{ background: theme.surface, borderRadius: theme.radius }}
          >
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photos[0] || "/demo/kurti.svg"} alt="" className="h-full w-full object-cover" />
              {p.stock <= 0 ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-white">{t("sold")}</span>
              ) : null}
            </div>
            <div className="p-3">
              <p className="line-clamp-2 font-semibold">{p.title}</p>
              <p className="mt-1 text-lg font-extrabold">
                {formatTaka(p.pricePoisha)}{" "}
                {p.compareAtPoisha ? (
                  <s className="text-sm font-medium opacity-50">{formatTaka(p.compareAtPoisha)}</s>
                ) : null}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ProductView({
  shop,
  product,
}: {
  shop: ShopPublic;
  product: ProductPublic;
}) {
  const theme = getTheme(shop.themeId);
  const t = useTranslations("store");
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState(0);
  const sold = product.stock <= 0 || shop.paused;

  function share() {
    const url = window.location.href;
    const text = `${product.title} ${formatTaka(product.pricePoisha)} · ${shop.name}`;
    if (navigator.share) navigator.share({ title: product.title, text, url }).catch(() => {});
    else navigator.clipboard.writeText(`${text}\n${url}`);
  }

  return (
    <div style={themeStyle(theme)} className="min-h-dvh pb-28 md:pb-12">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link href={`/s/${shop.slug}`} className="tap font-bold">
          ← {shop.name}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <button type="button" onClick={share} className="tap rounded-lg px-3 font-bold">
            Share
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl md:grid-cols-2 md:gap-12 md:px-8">
        <div className="relative overflow-hidden md:rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.photos[photo] || "/demo/kurti.svg"} alt="" className="h-[48vh] w-full object-cover md:h-[70vh]" />
          {product.photos.length > 1 ? (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {product.photos.map((_, i) => (
                <button key={i} type="button" onClick={() => setPhoto(i)} className={`h-2 w-2 rounded-full ${i === photo ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          ) : null}
          {sold ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-2xl font-black text-white">
              {shop.paused ? t("paused") : t("sold")}
            </div>
          ) : null}
        </div>
        <div className="px-4 pt-5 md:flex md:flex-col md:justify-center md:px-0">
          {product.badge ? (
            <span className="w-fit rounded-full px-2 py-1 text-xs font-bold uppercase" style={{ background: theme.accent }}>
              {product.badge}
            </span>
          ) : null}
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{product.title}</h1>
          <p className="mt-3 text-3xl font-extrabold">
            {formatTaka(product.pricePoisha)}{" "}
            {product.compareAtPoisha ? <s className="text-lg opacity-50">{formatTaka(product.compareAtPoisha)}</s> : null}
          </p>
          <div className="mt-8 hidden md:block">
            <button
              className="cta max-w-sm"
              style={{ background: theme.primary, color: theme.primaryText, borderRadius: theme.radius }}
              disabled={sold}
              onClick={() => setOpen(true)}
            >
              {t("orderThis")}
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <ThumbBar style={{ background: theme.surface }}>
          <button
            className="cta"
            style={{ background: theme.primary, color: theme.primaryText, borderRadius: theme.radius }}
            disabled={sold}
            onClick={() => setOpen(true)}
          >
            {t("orderThis")} · {formatTaka(product.pricePoisha)}
          </button>
        </ThumbBar>
      </div>
      <CheckoutSheet open={open} shop={shop} product={product} onClose={() => setOpen(false)} />
    </div>
  );
}
