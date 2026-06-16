"use client";

import { useEffect, useMemo, useState } from "react";
import { lux } from "@/lib/theme";
import { parseDateInput } from "@/lib/utils";

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function splitIsoDate(value: string): { year: string; month: string; day: string } {
  const iso = parseDateInput(value);
  if (!iso) {
    return { year: "", month: "", day: "" };
  }

  const [year, month, day] = iso.split("-");
  return { year, month, day };
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export interface DateSelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

export function DateSelectField({ id, value, onChange, hasError = false }: DateSelectFieldProps) {
  const [parts, setParts] = useState(() => splitIsoDate(value));

  useEffect(() => {
    setParts(splitIsoDate(value));
  }, [value]);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, index) => String(current - 5 + index));
  }, []);

  const dayOptions = useMemo(() => {
    if (!parts.year || !parts.month) {
      return Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
    }

    const total = daysInMonth(Number(parts.year), Number(parts.month));
    return Array.from({ length: total }, (_, index) => String(index + 1).padStart(2, "0"));
  }, [parts.year, parts.month]);

  const selectClassName = hasError
    ? `${lux.inputError} h-11`
    : `${lux.input} h-11`;

  function update(nextParts: { year: string; month: string; day: string }) {
    setParts(nextParts);

    if (nextParts.year && nextParts.month && nextParts.day) {
      onChange(parseDateInput(`${nextParts.year}-${nextParts.month}-${nextParts.day}`));
      return;
    }

    onChange("");
  }

  return (
    <div id={id} className="grid grid-cols-3 gap-2">
      <select
        aria-label="Event month"
        value={parts.month}
        onChange={(event) => update({ ...parts, month: event.target.value })}
        className={selectClassName}
      >
        <option value="">Month</option>
        {MONTHS.map((entry) => (
          <option key={entry.value} value={entry.value}>
            {entry.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Event day"
        value={parts.day}
        onChange={(event) => update({ ...parts, day: event.target.value })}
        className={selectClassName}
      >
        <option value="">Day</option>
        {dayOptions.map((entry) => (
          <option key={entry} value={entry}>
            {Number(entry)}
          </option>
        ))}
      </select>

      <select
        aria-label="Event year"
        value={parts.year}
        onChange={(event) => update({ ...parts, year: event.target.value })}
        className={selectClassName}
      >
        <option value="">Year</option>
        {years.map((entry) => (
          <option key={entry} value={entry}>
            {entry}
          </option>
        ))}
      </select>
    </div>
  );
}
