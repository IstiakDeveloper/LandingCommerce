"use client";

import { blockPhone, confirmTemplateText, saveOrderNote, setOrderStatus } from "@/app/actions/order";
import { districtLabel } from "@/lib/geo/bd-districts";
import { formatTaka, telLink, waLink } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export type OrderCardData = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  isDhaka: boolean;
  district: string | null;
  address: string;
  landmark: string | null;
  payMethod: string;
  trxId: string | null;
  totalPoisha: number;
  status: string;
  sellerNote: string | null;
  createdAt: string;
  items: { title: string; qty: number; variant: string | null; pricePoisha: number }[];
  photo?: string | null;
  repeatCount?: number;
};

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;

export function OrderCard({
  order,
  locale,
  demo,
}: {
  order: OrderCardData;
  locale: "bn" | "en";
  demo?: boolean;
}) {
  const t = useTranslations("orders");
  const [note, setNote] = useState(order.sellerNote ?? "");
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const item = order.items[0];

  async function waConfirm() {
    if (demo) return;
    const res = await confirmTemplateText(order.id);
    if (res.ok && res.phone && res.body) {
      await setOrderStatus(order.id, "confirmed");
      setCurrentStatus("confirmed");
      window.location.href = waLink(res.phone, res.body);
    }
  }

  async function callConfirm() {
    if (demo) {
      window.location.href = telLink(order.phone);
      return;
    }
    window.location.href = telLink(order.phone);
    await setOrderStatus(order.id, "confirmed");
    setCurrentStatus("confirmed");
  }

  async function changeStatus(newStatus: (typeof STATUSES)[number]) {
    if (demo) {
      setCurrentStatus(newStatus);
      return;
    }
    await setOrderStatus(order.id, newStatus);
    setCurrentStatus(newStatus);
  }

  return (
    <article className="glass-card rounded-2xl border border-slate-200 dark:border-white/10 p-4 transition-all md:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/60 text-2xl">
            {order.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={order.photo} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              "📦"
            )}
          </div>
          <div>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {item?.title ?? t("productLabel")}
            </p>
            {item?.variant && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("variantLabel")}: {item.variant}
              </p>
            )}
            <p className="mt-1 text-sm font-black text-emerald-600 dark:text-emerald-400">
              {formatTaka(order.totalPoisha)} ·{" "}
              <span className="uppercase text-slate-500 dark:text-slate-400 text-xs">
                {order.payMethod}
              </span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
            {order.code}
          </span>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* Customer Info Box */}
      <div className="mt-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        <div className="flex items-center justify-between">
          <p className="font-bold text-slate-900 dark:text-white text-sm">{order.customerName}</p>
          <a
            href={`tel:${order.phone}`}
            className="font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            {order.phone}
          </a>
        </div>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          📍 {order.address},{" "}
          {order.isDhaka ? t("dhaka") : districtLabel(order.district ?? "", locale)}
          {order.landmark ? ` (${order.landmark})` : ""}
        </p>
      </div>

      {/* Badges Row */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
        {order.repeatCount && order.repeatCount > 0 ? (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-emerald-600 dark:text-emerald-400">
            🌟 {order.repeatCount} {t("repeat")}
          </span>
        ) : (
          <span className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 text-slate-600 dark:text-slate-400">
            {t("newNumber")}
          </span>
        )}
        <span className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 text-slate-700 dark:text-slate-300">
          {t("feePerOrder")}
        </span>
      </div>

      {/* Status Badges Selector */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {STATUSES.map((s) => {
          const isCurrent = currentStatus === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => changeStatus(s)}
              className={`min-h-8 shrink-0 rounded-lg px-3 text-xs font-bold transition ${
                isCurrent
                  ? "border border-emerald-400 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-[0_0_12px_rgba(0,245,155,0.2)]"
                  : "border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t(s)}
            </button>
          );
        })}
      </div>

      {/* Action Buttons for New / Confirmed Orders */}
      {currentStatus === "new" && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={callConfirm}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-white transition hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            📞 {t("callConfirm")}
          </button>
          <button
            type="button"
            onClick={waConfirm}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-xs font-black text-black transition hover:bg-emerald-400 shadow-[0_0_15px_rgba(0,245,155,0.35)]"
          >
            💬 {t("confirmWa")}
          </button>
        </div>
      )}

      {/* Note & Block actions */}
      <div className="mt-3 flex items-center gap-2">
        <input
          className="cyber-field min-h-9 flex-1 text-xs py-1.5"
          placeholder={t("note")}
          value={note}
          onBlur={() => !demo && saveOrderNote(order.id, note)}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          onClick={() => !demo && blockPhone(order.id)}
          className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 dark:bg-red-950/30 px-2.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-950/50"
        >
          {t("block")}
        </button>
      </div>
    </article>
  );
}

export function OrderList({
  orders,
  demo,
}: {
  orders: OrderCardData[];
  demo?: boolean;
}) {
  const t = useTranslations("orders");
  const locale = useLocale() as "bn" | "en";
  const [filter, setFilter] = useState("all");
  const chips = ["all", "new", "confirmed", "shipped", "delivered", "cancelled"] as const;

  const shown = orders.filter((o) => (filter === "all" ? true : o.status === filter));

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
        {chips.map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`min-h-9 shrink-0 rounded-xl px-4 text-xs font-bold transition ${
                active
                  ? "border border-emerald-400 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-[0_0_12px_rgba(0,245,155,0.2)]"
                  : "border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {c === "all" ? t("allOrders") : t(c)}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-10 text-center shadow-sm">
          <p className="text-3xl">📭</p>
          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{t("empty")}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("emptyFilter")}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {shown.map((o) => (
            <OrderCard key={o.id} order={o} locale={locale} demo={demo} />
          ))}
        </div>
      )}
    </div>
  );
}
