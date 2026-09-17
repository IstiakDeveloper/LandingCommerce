"use client";

import { confirmTemplateText, setOrderStatus } from "@/app/actions/order";
import { formatTaka, telLink, waLink } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Latest = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  totalPoisha: number;
  items: { title: string; qty: number; variant: string | null }[];
  photo?: string | null;
};

function beep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.value = 0.08;
    o.start();
    o.stop(ctx.currentTime + 0.18);
    navigator.vibrate?.([120, 60, 180]);
  } catch {
    /* ignore */
  }
}

export function NewOrderWatch() {
  const router = useRouter();
  const since = useRef(new Date().toISOString());
  const shown = useRef<string | null>(null);
  const [latest, setLatest] = useState<Latest | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/app/poll?since=${encodeURIComponent(since.current)}`);
        if (!res.ok) return;
        const data = await res.json();
        since.current = data.now;
        if (data.count > 0 && data.latest && data.latest.id !== shown.current) {
          shown.current = data.latest.id;
          const photos = data.latest.items?.[0]?.product?.photos
            ? (JSON.parse(data.latest.items[0].product.photos) as string[])
            : [];
          setLatest({
            id: data.latest.id,
            code: data.latest.code,
            customerName: data.latest.customerName,
            phone: data.latest.phone,
            totalPoisha: data.latest.totalPoisha,
            items: data.latest.items ?? [],
            photo: photos[0] ?? null,
          });
          beep();
          if (typeof Notification !== "undefined" && Notification.permission === "default") {
            Notification.requestPermission().catch(() => {});
          }
          router.refresh();
        }
      } catch {
        /* offline */
      }
    }, 8000);
    return () => clearInterval(id);
  }, [router]);

  if (!latest) return null;

  async function waConfirm() {
    const order = latest;
    if (!order) return;
    const res = await confirmTemplateText(order.id);
    if (res.ok && res.phone && res.body) {
      await setOrderStatus(order.id, "confirmed");
      setLatest(null);
      window.location.href = waLink(res.phone, res.body);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/45 md:items-center md:justify-center md:p-8">
      <div
        className="flex h-[80dvh] w-full flex-col rounded-t-2xl bg-white p-5 md:h-auto md:max-w-md md:rounded-2xl md:shadow-2xl"
      >
        <p className="text-sm font-bold text-clay">নতুন অর্ডার</p>
        <div className="mt-3 flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={latest.photo || "/demo/kurti.svg"} alt="" className="h-20 w-20 rounded-xl object-cover" />
          <div>
            <p className="text-xl font-black">{latest.items[0]?.title}</p>
            <p className="font-bold">{formatTaka(latest.totalPoisha)}</p>
            <p>{latest.customerName}</p>
            <p className="font-bold text-clay">{latest.phone}</p>
            <p className="text-sm text-ink/50">{latest.code}</p>
          </div>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 pb-[env(safe-area-inset-bottom)]">
          <a href={telLink(latest.phone)} className="cta cta-ink flex items-center justify-center text-sm" onClick={() => setOrderStatus(latest.id, "confirmed")}>
            কল + কনফার্ম
          </a>
          <button type="button" className="cta text-sm" onClick={waConfirm}>
            WhatsApp
          </button>
          <button type="button" className="col-span-2 min-h-12 font-bold text-ink/40" onClick={() => setLatest(null)}>
            পরে দেখব
          </button>
        </div>
      </div>
    </div>
  );
}
