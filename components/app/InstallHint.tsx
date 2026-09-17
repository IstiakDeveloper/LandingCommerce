"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export function InstallHint() {
  const [show, setShow] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone || localStorage.getItem("hl_install_hide")) return;
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      className="mb-3 w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-3 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition hover:border-emerald-400"
      onClick={() => {
        localStorage.setItem("hl_install_hide", "1");
        setShow(false);
      }}
    >
      {locale === "bn" ? (
        <span>
          ফোনের মেনু থেকে <b>Add to Home screen</b> চাপুন — অ্যাপের মতো খুলবে। ✕
        </span>
      ) : (
        <span>
          Tap <b>Add to Home screen</b> from browser menu to use like an app. ✕
        </span>
      )}
    </button>
  );
}
