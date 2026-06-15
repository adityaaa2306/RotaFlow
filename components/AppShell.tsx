"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, LayoutDashboard, Sparkles } from "lucide-react";
import { lux } from "@/lib/theme";

const navItems = [
  { href: "/submit", label: "Submit", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/archive", label: "Archive", icon: Archive },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <div className={lux.shell}>
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2A85FF] text-white shadow-[0_4px_14px_rgb(42,133,255,0.35)]">
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-xl font-bold tracking-tight text-ink">
              ImpactPilot<span className="text-rota-blue"> AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={isActive ? lux.navActive : lux.navInactive}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <Link href="/submit" className={`${lux.btnPrimary} shrink-0 text-xs sm:text-sm`}>
            Submit Project
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-slate-100/80 px-4 py-2 md:hidden">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`${isActive ? lux.navActive : lux.navInactive} shrink-0`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className={lux.main}>{children}</main>
    </div>
  );
}
