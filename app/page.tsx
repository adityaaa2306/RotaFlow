import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "RotaFlow — ImpactPilot AI",
  description:
    "Turn volunteer stories into structured reports, SDG alignment and share-ready content. Tell us what happened — we'll handle the paperwork.",
  openGraph: {
    title: "RotaFlow — ImpactPilot AI",
    description:
      "Turn volunteer stories into structured reports, SDG alignment and share-ready content. Tell us what happened — we'll handle the paperwork.",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
