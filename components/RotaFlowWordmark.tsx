import { cn } from "@/lib/utils";
import { brandClasses } from "@/lib/brand";

export function RotaFlowWordmark({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <span className={cn("font-bold tracking-tight", className)}>
      <span className={isDark ? "text-foreground" : brandClasses.rota}>Rota</span>
      <span className={isDark ? "text-foreground/90" : brandClasses.flow}>Flow</span>
    </span>
  );
}
