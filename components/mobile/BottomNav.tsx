"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

const tabs = [
  { href: "/app", key: "home" as const, icon: HomeIcon },
  { href: "/app/orders", key: "orders" as const, icon: BagIcon },
  { href: "/app/products", key: "products" as const, icon: GridIcon },
  { href: "/app/shop", key: "shop" as const, icon: StoreIcon },
];

export function AppNav({
  variant,
  demo = false,
  demoTab = "home",
  onDemoTabChange,
}: {
  variant: "side" | "bottom";
  demo?: boolean;
  demoTab?: string;
  onDemoTabChange?: (tab: string) => void;
}) {
  const pathname = usePathname();
  const t = useTranslations();
  const side = variant === "side";

  return (
    <nav
      className={
        side
          ? "flex h-full flex-col justify-between p-4 bg-white/95 dark:bg-[#0c121e]/90 border-r border-slate-200 dark:border-white/10 backdrop-blur-xl"
          : "fixed bottom-0 left-0 z-40 grid w-full grid-cols-4 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden shadow-lg"
      }
    >
      <div>
        {side ? (
          <div className="mb-6 flex flex-col gap-3 px-2 py-1">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                title={t("nav.backToHome")}
                className="flex items-center gap-2.5 transition hover:opacity-90 group"
              >
                <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-[13px] font-black text-black shadow-[0_0_12px_rgba(0,245,155,0.35)]">
                  {t("brand")[0] || "হ"}
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 border border-white dark:border-[#0c121e] animate-neon-pulse" />
                </span>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 dark:text-white text-base leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {t("brand")}
                  </span>
                  {demo ? (
                    <span className="mt-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      DEMO MODE
                    </span>
                  ) : (
                    <span className="mt-1 text-[9px] font-medium text-slate-500 dark:text-slate-400">
                      ← {t("nav.backToHome")}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        ) : null}

        <div className={side ? "flex flex-col gap-1.5" : "contents"}>
          {tabs.map((tab) => {
            const active = demo
              ? demoTab === tab.key
              : tab.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            if (demo && onDemoTabChange) {
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onDemoTabChange(tab.key)}
                  className={
                    side
                      ? `flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-bold transition text-left ${
                          active
                            ? "border border-emerald-400/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-[0_0_12px_rgba(0,245,155,0.15)]"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                        }`
                      : `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition ${
                          active
                            ? "text-emerald-600 dark:text-emerald-400 font-black"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`
                  }
                >
                  <Icon active={active} />
                  <span>{t(`nav.${tab.key}`)}</span>
                </button>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={
                  side
                    ? `flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-bold transition ${
                        active
                          ? "border border-emerald-400/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-[0_0_12px_rgba(0,245,155,0.15)]"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                      }`
                    : `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition ${
                        active
                          ? "text-emerald-600 dark:text-emerald-400 font-black"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`
                }
              >
                <Icon active={active} />
                <span>{t(`nav.${tab.key}`)}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {side && (
        <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex flex-col gap-2">
          <Link
            href="/s/demo"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
          >
            <span>👁️ {t("try.viewLandingDemo")}</span>
          </Link>
          {demo && (
            <Link
              href="/#register"
              className="neon-btn flex min-h-9 items-center justify-center text-xs font-black shadow-[0_0_15px_rgba(0,245,155,0.3)]"
            >
              {t("try.openRealShop")}
            </Link>
          )}
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
          >
            <span>🏠</span>
            <span>{t("nav.backToHome")}</span>
          </Link>
          <p className="mt-1 text-[10px] text-center text-slate-500 dark:text-slate-400">
            DokanDari v1.0 · {t("header.perOrderRate")}
          </p>
        </div>
      )}
    </nav>
  );
}

export function BottomNav({
  demo = false,
  demoTab = "home",
  onDemoTabChange,
}: {
  demo?: boolean;
  demoTab?: string;
  onDemoTabChange?: (tab: string) => void;
}) {
  return (
    <AppNav
      variant="bottom"
      demo={demo}
      demoTab={demoTab}
      onDemoTabChange={onDemoTabChange}
    />
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#00f59b" : "none"} stroke={active ? "#00bd77" : "currentColor"} strokeWidth="2">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function BagIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#00bd77" : "currentColor"} strokeWidth="2">
      <path d="M6 7h12l-1 13H7L6 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#00bd77" : "currentColor"} strokeWidth="2">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  );
}
function StoreIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#00bd77" : "currentColor"} strokeWidth="2">
      <path d="M4 10 6 5h12l2 5v9H4z" />
      <path d="M4 10h16" />
    </svg>
  );
}
