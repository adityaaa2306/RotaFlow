import type { ComponentType } from "react";

export interface MetricsCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  unit?: string;
  color?: "blue" | "green" | "purple" | "orange";
}

const iconColorClasses: Record<
  NonNullable<MetricsCardProps["color"]>,
  string
> = {
  blue: "text-blue-600 bg-blue-50 rounded-lg p-1.5",
  green: "text-green-600 bg-green-50 rounded-lg p-1.5",
  purple: "text-purple-600 bg-purple-50 rounded-lg p-1.5",
  orange: "text-orange-600 bg-orange-50 rounded-lg p-1.5",
};

const defaultIconClassName = "text-slate-600 bg-slate-50 rounded-lg p-1.5";

export function MetricsCard({
  label,
  value,
  icon: Icon,
  unit,
  color,
}: MetricsCardProps) {
  const iconClassName = color ? iconColorClasses[color] : defaultIconClassName;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start">
        <Icon className={`h-8 w-8 ${iconClassName}`} />
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">
        {value}
        {unit && <span className="ml-1 text-lg text-slate-500">{unit}</span>}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
