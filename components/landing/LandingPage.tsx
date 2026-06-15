import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";
import { FeatureCard } from "@/components/landing/FeatureCard";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#sdg", label: "SDG" },
  { href: "#about", label: "About" },
];

const features = [
  {
    icon: Sparkles,
    title: "AI Extraction",
    body: "Describe your event in plain language and let AI structure the data for you.",
    tag: "01",
  },
  {
    icon: Target,
    title: "SDG Mapping",
    body: "Every project is automatically aligned to the right UN Sustainable Development Goals.",
    tag: "02",
  },
  {
    icon: FileText,
    title: "Instant Reports",
    body: "Generate professional impact reports, social posts, and PDF exports in one click.",
    tag: "03",
  },
];

const trustChips = ["SDG-aligned", "One-click PDF", "AI extraction"];

export function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <div className="landing-theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="relative z-20 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="btn-glow grid h-8 w-8 place-items-center rounded-lg">
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="font-display text-xl tracking-tight text-foreground">
              ImpactPilot<span className="text-primary"> AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          <Link
            href="/submit"
            className="btn-glow inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          >
            Submit Project
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-12 text-center md:pt-20">
        <div className="glass-card inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
          Conversational documentation copilot
        </div>

        <h1 className="font-display mt-8 text-5xl leading-[0.95] tracking-tight md:text-7xl">
          <span className="block">
            Tell us what{" "}
            <em className="text-gradient-blue italic">happened</em>.
          </span>
          <span className="mt-2 block">
            We&apos;ll handle the{" "}
            <span className="text-gradient-blue">paperwork</span>.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
          ImpactPilot AI turns volunteer stories into structured reports, SDG alignment,
          and share-ready content for social impact organizations.
        </p>

        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/submit"
            className="group btn-glow inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium transition-transform duration-200 hover:scale-[1.02]"
          >
            Submit a Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href="#how"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm text-muted-foreground shadow-sm transition-colors duration-200 hover:border-slate-300 hover:text-foreground"
          >
            See how it works
          </a>
        </div>

        <div id="how" className="mt-8 flex flex-wrap justify-center gap-5">
          {trustChips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Features</p>
        <h2 className="font-display mt-4 text-4xl tracking-tight md:text-5xl">
          Built for the people doing{" "}
          <em className="text-gradient-blue italic">real work</em>.
        </h2>
        <div id="sdg" className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.tag} {...feature} />
          ))}
        </div>
      </section>

      <footer
        id="about"
        className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-slate-200/60 px-6 py-10 text-xs text-muted-foreground"
      >
        <p>© {year} RotaFlow · ImpactPilot AI</p>
        <div className="flex flex-wrap gap-6">
          {["Privacy", "Terms", "Contact"].map((label) => (
            <a
              key={label}
              href="#"
              className="transition-colors duration-200 hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
