import { cn } from "@/lib/utils";
import { brandClasses } from "@/lib/brand";

export function RotaFlowWordmark({ className }: { className?: string }) {
  return (
    <span className={cn(brandClasses.wordmark, className)}>
      <span className={brandClasses.rota}>Rota</span>
      <span className={brandClasses.flow}>Flow</span>
    </span>
  );
}
