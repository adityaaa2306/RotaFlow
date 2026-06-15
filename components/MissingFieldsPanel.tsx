"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { lux } from "@/lib/theme";
import type {
  ConfidenceLevel,
  ExtractionConfidence,
  ProjectFormData,
} from "@/types";

export interface MissingFieldsPanelProps {
  confidence: ExtractionConfidence;
  values: Partial<ProjectFormData>;
}

const FIELDS = [
  { key: "club_name", label: "Club Name" },
  { key: "project_name", label: "Project Name" },
  { key: "category", label: "Category" },
  { key: "date", label: "Event Date" },
  { key: "volunteers", label: "Volunteers" },
  { key: "beneficiaries", label: "Beneficiaries" },
  { key: "duration_hours", label: "Duration (hours)" },
  { key: "partners", label: "Partner Organizations" },
  { key: "description", label: "Description" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

function formatFieldValue(key: FieldKey, values: Partial<ProjectFormData>): string {
  const value = values[key];

  if (key === "partners") {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return "—";
    }
    return value.join(", ");
  }

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

function StatusBadge({ level }: { level: ConfidenceLevel }) {
  if (level === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle2 className="h-3 w-3" />
        Confirmed
      </span>
    );
  }

  if (level === "inferred") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        <AlertCircle className="h-3 w-3" />
        Please verify
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
      <XCircle className="h-3 w-3" />
      Required
    </span>
  );
}

function countByLevel(confidence: ExtractionConfidence, level: ConfidenceLevel): number {
  return Object.values(confidence).filter((status) => status === level).length;
}

export function MissingFieldsPanel({ confidence, values }: MissingFieldsPanelProps) {
  if (!confidence) {
    return null;
  }

  const confirmedCount = countByLevel(confidence, "confirmed");
  const inferredCount = countByLevel(confidence, "inferred");
  const missingCount = countByLevel(confidence, "missing");

  return (
    <div className={lux.card}>
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <h2 className={lux.sectionTitle}>Extraction Results</h2>
      </div>

      <div className="divide-y divide-slate-100">
        {FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-3"
          >
            <span className="w-1/3 text-sm font-medium text-slate-700">{label}</span>
            <span className="flex-1 text-center text-sm text-slate-600">
              {formatFieldValue(key, values)}
            </span>
            <div className="flex w-1/3 justify-end">
              <StatusBadge level={confidence[key]} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {confirmedCount} fields confirmed · {inferredCount} need verification ·{" "}
        {missingCount} missing
      </p>
    </div>
  );
}
