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
  blue: "text-blue-700 bg-blue-50",
  green: "text-green-700 bg-green-50",
  purple: "text-purple-700 bg-purple-50",
  orange: "text-orange-700 bg-orange-50",
};

const defaultIconClassName = "text-rota-blue bg-rota-blue/10";

export function MetricsCard({
  label,
  value,
  icon: Icon,
  unit,
  color,
  description,
}: MetricsCardProps) {
  const iconClassName = color ? iconColorClasses[color] : defaultIconClassName;

  return (
    <div className="lux-card min-w-0 overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink">
            {value}
            {unit && <span className="ml-1 text-lg font-normal text-slate-400">{unit}</span>}
          </p>
        </div>
        <div className={`shrink-0 self-start rounded-2xl p-2.5 ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {description && (
        <p className="mt-3 text-xs leading-relaxed text-slate-500">{description}</p>
      )}
    </div>
  );
}
