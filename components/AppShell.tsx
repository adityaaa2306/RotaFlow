"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, LayoutDashboard, Sparkles } from "lucide-react";

const navItems = [
  { href: "/submit", label: "Submit Project", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/archive", label: "Archive", icon: Archive },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 flex-col justify-center px-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
            ImpactPilot AI
          </Link>
          <span className="text-xs text-slate-400">by RotaFlow</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700"
                    : "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-slate-200 px-6 py-4">
          <p className="text-xs text-slate-400">ImpactPilot AI</p>
          <p className="text-xs text-slate-300">Powered by NVIDIA NIM</p>
        </div>
      </aside>
      <main className="ml-64 min-h-screen bg-slate-50">{children}</main>
    </div>
  );
}
