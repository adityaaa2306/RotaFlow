import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  FileText,
  Mic,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";
import { FeatureCard } from "@/components/landing/FeatureCard";

const SUBMIT_HREF = "/submit";

const navLinks = [
  { href: "#what", label: "What it does" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
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

const whatItDoes = [
  {
    title: "Capture the story",
    body: "Type or speak what happened at your event — who ran it, who showed up, and what changed for the community.",
  },
  {
    title: "Get a full report",
    body: "ImpactPilot turns that story into a structured impact report with metrics, activities, and recommendations.",
  },
  {
    title: "Align to SDGs",
    body: "Projects are mapped to UN Sustainable Development Goals using consistent rules — ready for district and club reporting.",
  },
  {
    title: "Share & archive",
    body: "Export a PDF, draft Instagram / LinkedIn / X posts, publish where connected, and keep everything searchable.",
  },
];

const howSteps = [
  {
    icon: Mic,
    step: "01",
    title: "Describe the event",
    body: "Open Submit → AI Mode. Paste a narrative or record your voice. Mention club, date, volunteers, and outcomes if you can.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Auto-fill with AI",
    body: "We extract fields and flag what’s confirmed, inferred, or still missing so you know what to double-check.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Generate the report",
    body: "Review the form, add photos, then generate. You’ll get the full write-up, SDG alignment, and a social kit.",
  },
  {
    icon: Share2,
    step: "04",
    title: "Export or publish",
    body: "Download a PDF through SDG alignment, post to Instagram or X, and find the project later in Archive or Dashboard.",
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
            href={SUBMIT_HREF}
            className="btn-glow inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          >
            Submit Project
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-12 text-center md:pt-20">
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
          and share-ready content for Rotary, Rotaract, NGOs, and community groups.
        </p>

        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={SUBMIT_HREF}
            className="group btn-glow inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium transition-transform duration-200 hover:scale-[1.02]"
          >
            Submit a Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href="#what"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm text-muted-foreground shadow-sm transition-colors duration-200 hover:border-slate-300 hover:text-foreground"
          >
            What does it do?
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-5">
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

      <section id="what" className="relative z-10 mx-auto max-w-7xl px-6 pb-28">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          What it does
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl tracking-tight md:text-5xl">
          From a volunteer story to{" "}
          <em className="text-gradient-blue italic">complete impact docs</em>.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          After every community event, clubs spend hours writing reports, tallying metrics,
          mapping SDGs, and drafting social posts. ImpactPilot does that pipeline for you —
          so people doing the work spend less time on paperwork.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {whatItDoes.map((item, index) => (
            <div key={item.title}>
              <p className="font-display text-3xl text-foreground/15">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-xl tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 border-y border-slate-200/60 bg-white/60 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-4xl tracking-tight md:text-5xl">
            Four steps.{" "}
            <em className="text-gradient-blue italic">Minutes</em>, not hours.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            You land in AI Mode by default. Follow this flow the first time you submit a project.
          </p>

          <ol className="mt-14 grid gap-8 md:grid-cols-2">
            {howSteps.map(({ icon: Icon, step, title, body }) => (
              <li key={step} className="flex gap-5">
                <span className="btn-glow grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
                    Step {step}
                  </p>
                  <h3 className="mt-1 font-display text-2xl tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <Link
              href={SUBMIT_HREF}
              className="group btn-glow inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium"
            >
              Try AI Mode now
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Features</p>
        <h2 className="font-display mt-4 text-4xl tracking-tight md:text-5xl">
          Built for the people doing{" "}
          <em className="text-gradient-blue italic">real work</em>.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
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
        <p className="max-w-md text-right">
          Documentation copilot for social impact organizations — report, align, share.
        </p>
      </footer>
    </div>
  );
}
