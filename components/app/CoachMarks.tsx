"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export function CoachMarks() {
  const [step, setStep] = useState<number | null>(null);
  const locale = useLocale();

  useEffect(() => {
    if (!localStorage.getItem("hl_coached")) setStep(0);
  }, []);

  if (step === null) return null;

  const tips =
    locale === "bn"
      ? [
          { title: "অর্ডার", body: "নতুন অর্ডার এখানে আসবে। কল বা WhatsApp দিয়ে কনফার্ম করুন।" },
          { title: "+", body: "নিচের ডানদিকের + চাপলে ক্যামেরা দিয়ে প্রোডাক্ট তুলবেন।" },
          { title: "শেয়ার", body: "দোকান ট্যাবে লিংক শেয়ার করুন ফেসবুকে।" },
        ]
      : [
          { title: "Orders", body: "New orders appear here. Call or confirm directly via WhatsApp." },
          { title: "+ Add", body: "Tap + on products to snap photos and add your items." },
          { title: "Share", body: "Share your shop link from the Shop tab to Facebook." },
        ];
  const tip = tips[step];

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[480px] items-end bg-black/60 backdrop-blur-sm">
      <div className="w-full rounded-t-3xl border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl">
        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{step + 1}/3</p>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{tip.title}</h2>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{tip.body}</p>
        <button
          className="neon-btn mt-4 w-full h-11 text-xs font-black shadow-[0_0_15px_rgba(0,245,155,0.3)]"
          onClick={() => {
            if (step >= 2) {
              localStorage.setItem("hl_coached", "1");
              setStep(null);
            } else setStep(step + 1);
          }}
        >
          {step >= 2
            ? locale === "bn"
              ? "বুঝেছি"
              : "Got it"
            : locale === "bn"
            ? "পরবর্তী"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
