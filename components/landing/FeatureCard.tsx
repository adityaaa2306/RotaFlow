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
    <article className="group relative overflow-hidden rounded-3xl glass-card p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lux-lg">
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
