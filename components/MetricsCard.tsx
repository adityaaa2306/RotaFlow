import type { ComponentType } from "react";

export interface MetricsCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  unit?: string;
  color?: "blue" | "green" | "purple" | "orange";
  description?: string;
}

const iconColorClasses: Record<
  NonNullable<MetricsCardProps["color"]>,
  string
> = {
  blue: "text-primary bg-primary/15",
  green: "text-emerald-300 bg-emerald-500/15",
  purple: "text-violet-300 bg-violet-500/15",
  orange: "text-amber-300 bg-amber-500/15",
};

export function MetricsCard({
  label,
  value,
  icon: Icon,
  unit,
  color = "blue",
  description,
}: MetricsCardProps) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl tracking-tight text-foreground">
            {value}
            {unit && (
              <span className="ml-1 font-sans text-lg font-normal text-muted-foreground">
                {unit}
              </span>
            )}
          </p>
        </div>
        <div className={`rounded-2xl p-2.5 ${iconColorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {description && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
