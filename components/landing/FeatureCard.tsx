import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  tag: string;
}

export function FeatureCard({ icon: Icon, title, body, tag }: FeatureCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl glass-card p-7 transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, oklch(0.55 0.28 258 / 0.25), transparent 65%)",
        }}
        aria-hidden
      />
      <div className="relative flex items-start justify-between">
        <div className="btn-glow grid h-11 w-11 place-items-center rounded-2xl">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <span className="font-display text-2xl text-foreground/20">{tag}</span>
      </div>
      <h3 className="font-display relative mt-6 text-2xl tracking-tight text-foreground">
        {title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <p className="relative mt-6 flex items-center gap-1.5 text-sm text-primary opacity-0 transition duration-300 group-hover:opacity-100">
        Learn more
        <ArrowUpRight className="h-4 w-4" />
      </p>
    </article>
  );
}
