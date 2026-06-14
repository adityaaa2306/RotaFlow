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
      {/* Background layers */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          backgroundImage: "url(/images/blue-aurora.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-10%] z-0 h-[800px] w-[1200px] max-w-[200vw] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden
      />

      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6">
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

        <a
          href="#submit"
          className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-white/10"
        >
          Submit Project
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </header>

      {/* Hero */}
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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/submit"
            className="group btn-glow inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium transition-transform duration-200 hover:scale-[1.02]"
          >
            Submit a Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href="#how"
            className="inline-flex items-center rounded-full border border-white/10 px-6 py-4 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
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

      {/* Features */}
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

      {/* CTA */}
      <section id="submit" className="relative z-10 mx-auto max-w-5xl px-6 pb-32">
        <div className="glass-card relative overflow-hidden rounded-3xl p-12 text-center md:p-20">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
            style={{
              background:
                "radial-gradient(ellipse at 50% 120%, oklch(0.55 0.28 258 / 0.7), transparent 60%)",
            }}
            aria-hidden
          />
          <p className="relative text-xs uppercase tracking-[0.25em] text-muted-foreground">
            RotaFlow · ImpactPilot AI
          </p>
          <h3 className="font-display relative mt-6 text-5xl leading-[1.02] tracking-tight md:text-6xl">
            Turn the story you just lived into impact on{" "}
            <em className="text-gradient-blue italic">paper</em>.
          </h3>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/submit"
              className="btn-glow inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium"
            >
              Submit a Project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-white/10 px-7 py-4 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Book a demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 pb-10 text-xs text-muted-foreground"
      >
        <p>
          © {year} RotaFlow · ImpactPilot AI
        </p>
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
