"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, ArrowUpRight, LayoutDashboard, Sparkles } from "lucide-react";
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
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "url(/images/blue-aurora.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 0%, black 0%, transparent 75%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-15%] z-0 h-[600px] w-[900px] max-w-[200vw] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden
      />

      <header className="relative z-20 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="btn-glow grid h-8 w-8 place-items-center rounded-lg">
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="font-display text-xl tracking-tight text-foreground">
              ImpactPilot<span className="text-primary"> AI</span>
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

          <Link
            href="/submit"
            className="glass-card inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground transition-colors duration-200 hover:bg-white/10 sm:text-sm"
          >
            Submit Project
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <nav className="relative z-20 flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 md:hidden">
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
