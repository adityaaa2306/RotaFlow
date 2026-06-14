import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "@fontsource/aileron/400.css";
import "@fontsource/aileron/600.css";
import "@fontsource/aileron/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImpactPilot AI",
  description: "Tell us what happened. We'll handle the paperwork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
