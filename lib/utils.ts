import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip invisible whitespace and coerce unknown values before date parsing. */
export function sanitizeDateRaw(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return "";
    }
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "object") {
    return "";
  }

  return String(value).replace(/[\r\n\t\u00a0\u200b-\u200d\ufeff]/g, "").trim();
}

/** Safe string for a controlled date text input (never objects / hidden whitespace). */
export function toDateStringField(value: unknown): string {
  const cleaned = sanitizeDateRaw(value);
  if (!cleaned) {
    return "";
  }

  // Keep partial typing like 2026-05 while the user edits.
  if (/^\d{0,4}(-\d{0,2}(-\d{0,2})?)?$/.test(cleaned)) {
    return cleaned;
  }

  return parseDateInput(cleaned) || cleaned;
}

/** iOS Safari rejects invalid values on type="date" with "The string did not match the pattern". */
export function toDateInputValue(value: string | null | undefined): string {
  const trimmed = sanitizeDateRaw(value);
  if (!trimmed) {
    return "";
  }

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
export function parseDateInput(value: unknown): string {
  const trimmed = sanitizeDateRaw(value);
  if (!trimmed) {
    return "";
  }

  const iso = toDateInputValue(trimmed);
  if (iso) {
    return iso;
  }

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
