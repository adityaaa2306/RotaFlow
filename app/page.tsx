import Link from "next/link";
import { ArrowRight, FileText, MessageSquare, Target } from "lucide-react";
import { RotaFlowWordmark } from "@/components/RotaFlowWordmark";
import { brandClasses } from "@/lib/brand";
import { lux } from "@/lib/theme";

const features = [
  {
    icon: MessageSquare,
    title: "AI Extraction",
    description:
      "Describe your event in plain language and let AI structure the data for you.",
  },
  {
    icon: Target,
    title: "SDG Mapping",
    description:
      "Every project is automatically aligned to the right UN Sustainable Development Goals.",
  },
  {
    icon: FileText,
    title: "Instant Reports",
    description:
      "Generate professional impact reports, social posts, and PDF exports in one click.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center px-6 py-20 lg:px-8">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className={lux.eyebrow}>Conversational documentation copilot</p>
        <div className="mt-8">
          <RotaFlowWordmark className="text-5xl sm:text-6xl" />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Tell us what happened.
        </h1>
        <p className="mt-4 text-2xl font-semibold tracking-tight text-flow-navy/40 sm:text-3xl">
          We&apos;ll handle the paperwork.
        </p>
        <p className={`mt-8 max-w-xl ${brandClasses.tagline}`}>
          ImpactPilot AI turns volunteer stories into structured reports, SDG alignment,
          and share-ready content for social impact organizations.
        </p>
        <Link href="/submit" className={`${lux.btnPrimary} mt-10 px-8 py-3 text-base`}>
          Submit a Project
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="mx-auto mt-24 grid w-full max-w-5xl gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className={lux.card}>
            <div className="mb-4 inline-flex rounded-2xl bg-rota-blue/10 p-3">
              <Icon className="h-6 w-6 text-rota-blue" />
            </div>
            <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-500">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
