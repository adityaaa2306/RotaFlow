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

/** Normalize free-text / locale dates to yyyy-mm-dd for storage and validation. */
export function parseDateInput(value: string | null | undefined): string {
  const iso = toDateInputValue(value);
  if (iso) {
    return iso;
  }

  if (!value?.trim()) {
    return "";
  }

  const trimmed = value.trim();

  const isoDate = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoDate) {
    return toDateInputValue(
      `${isoDate[1]}-${isoDate[2].padStart(2, "0")}-${isoDate[3].padStart(2, "0")}`
    );
  }

  const dmy = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    return toDateInputValue(
      `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`
    );
  }

  const ymd = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymd) {
    return toDateInputValue(
      `${ymd[1]}-${ymd[2].padStart(2, "0")}-${ymd[3].padStart(2, "0")}`
    );
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return toDateInputValue(`${year}-${month}-${day}`);
  }

  return "";
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
