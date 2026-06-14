import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** iOS Safari rejects invalid values on type="date" with "The string did not match the pattern". */
export function toDateInputValue(value: string | null | undefined): string {
  if (!value?.trim()) {
    return "";
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return "";
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }

  return trimmed;
}

export function toNumberInputValue(value: number | "" | null | undefined): string {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  if (!Number.isFinite(value) || value < 0) {
    return "";
  }

  return String(value);
}
