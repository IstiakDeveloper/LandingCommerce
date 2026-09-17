"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
    const sync = () => {
      const isLight =
        document.documentElement.classList.contains("light") ||
        document.documentElement.getAttribute("data-theme") === "light";
      setTheme(isLight ? "light" : "dark");
    };
    sync();
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);

    if (next === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
      try {
        localStorage.setItem("DokanDari_theme", "light");
        document.cookie = "DokanDari_theme=light; path=/; max-age=31536000; SameSite=Lax";
      } catch (e) {}
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      try {
        localStorage.setItem("DokanDari_theme", "dark");
        document.cookie = "DokanDari_theme=dark; path=/; max-age=31536000; SameSite=Lax";
      } catch (e) {}
    }
    window.dispatchEvent(new Event("themechange"));
  }

  if (!mounted) {
    return (
      <div className={`h-8 w-16 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/60 ${className}`} />
    );
  }

  const isDark = theme === "dark";
  const lightLabel = locale === "bn" ? "☀️ লাইট" : "☀️ Light";
  const darkLabel = locale === "bn" ? "🌙 ডার্ক" : "🌙 Dark";
  const title = isDark
    ? (locale === "bn" ? "লাইট মোড চালু করুন" : "Switch to Light Mode")
    : (locale === "bn" ? "ডার্ক মোড চালু করুন" : "Switch to Dark Mode");

  return (
    <button
      type="button"
      onClick={toggle}
      title={title}
      aria-label={title}
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold transition ${
        isDark
          ? "border-white/15 bg-slate-900/80 text-amber-300 hover:border-amber-400/50 hover:bg-slate-800 shadow-[0_0_10px_rgba(255,158,0,0.2)]"
          : "border-slate-300 bg-white text-slate-800 hover:border-emerald-400 hover:bg-slate-50 shadow-sm"
      } ${className}`}
    >
      <span>{isDark ? lightLabel : darkLabel}</span>
    </button>
  );
}
