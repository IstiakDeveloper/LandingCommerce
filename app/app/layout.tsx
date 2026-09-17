import { requireSeller } from "@/lib/auth";
import { AppNav, BottomNav } from "@/components/mobile/BottomNav";
import { NewOrderWatch } from "@/components/app/NewOrderWatch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSeller();
  if (!user) redirect("/login");
  if (!user.shop) redirect("/#register");

  return (
    <div
      className={`min-h-dvh bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9] cyber-bg md:grid md:grid-cols-[250px_1fr] ${
        user.fontScale === "large" ? "big-text" : ""
      }`}
    >
      <aside className="hidden border-r border-slate-200 dark:border-white/10 md:block">
        <div className="sticky top-0 h-dvh">
          <AppNav variant="side" />
        </div>
      </aside>
      <div className="min-w-0">
        {/* Mobile top header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#07090e]/85 px-4 py-2.5 backdrop-blur-md md:hidden">
          <Link href="/" className="flex items-center gap-2 group transition hover:opacity-90">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 text-xs font-black text-black shadow-[0_0_10px_rgba(0,245,155,0.3)]">
              হ
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[180px] group-hover:text-emerald-500 transition">
              {user.shop.name}
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
        <NewOrderWatch />
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
