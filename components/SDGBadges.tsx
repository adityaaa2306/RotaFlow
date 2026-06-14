import type { SDGItem } from "@/types";

export interface SDGBadgesProps {
  sdgs: SDGItem[];
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SDGBadges({ sdgs }: SDGBadgesProps) {
  if (!sdgs || sdgs.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {sdgs.map((sdg) => (
        <div
          key={sdg.number}
          className="flex gap-4 rounded-[1.75rem] border border-slate-200/70 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          style={{ borderLeftColor: sdg.color }}
        >
          <div
            className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full"
            style={{ backgroundColor: hexToRgba(sdg.color, 0.15), color: sdg.color }}
          >
            <span className="text-xs font-medium">SDG</span>
            <span className="text-lg font-bold leading-none">{sdg.number}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{sdg.name}</p>
            <p className="mt-1 text-xs text-slate-500">{sdg.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
