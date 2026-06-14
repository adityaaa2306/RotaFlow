"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, LayoutDashboard, Sparkles } from "lucide-react";
import { RotaFlowWordmark } from "@/components/RotaFlowWordmark";
import { lux } from "@/lib/theme";

const navItems = [
  { href: "/submit", label: "Submit", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/archive", label: "Archive", icon: Archive },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={lux.shell}>
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <RotaFlowWordmark className="text-2xl" />
            <p className="mt-0.5 text-[11px] font-normal tracking-wide text-slate-500">
              ImpactPilot AI · Social impact documentation
            </p>
          </Link>

          {!isHome && (
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
          )}

          <Link href="/submit" className={`${lux.btnPrimary} shrink-0 text-xs sm:text-sm`}>
            Submit Project
          </Link>
        </div>

        {!isHome && (
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
        )}
      </header>

      <main className={lux.main}>{children}</main>
    </div>
  );
}
