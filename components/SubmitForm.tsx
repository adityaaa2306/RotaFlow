"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lux } from "@/lib/theme";
import { toDateInputValue, toNumberInputValue } from "@/lib/utils";
import type { ProjectCategory, ProjectFormData } from "@/types";

type RequiredField =
  | "club_name"
  | "project_name"
  | "category"
  | "date"
  | "volunteers"
  | "beneficiaries";

export interface SubmitFormProps {
  formData: ProjectFormData;
  onChange: (updates: Partial<ProjectFormData>) => void;
  onPhotosChange: (files: File[]) => void;
  photos: File[];
  formTouched?: boolean;
}

const REQUIRED_FIELD_ERRORS: Record<RequiredField, string> = {
  club_name: "Club name is required",
  project_name: "Project name is required",
  category: "Category is required",
  date: "Date is required",
  volunteers: "Volunteers is required",
  beneficiaries: "Beneficiaries is required",
};

const CATEGORIES: ProjectCategory[] = [
  "Healthcare",
  "Education",
  "Environment",
  "Hunger Relief",
  "Women Empowerment",
  "Sanitation",
  "Community Development",
  "Other",
];

const inputClassName = lux.input;

function isRequiredFieldEmpty(
  field: RequiredField,
  formData: ProjectFormData
): boolean {
  switch (field) {
    case "club_name":
      return !formData.club_name.trim();
    case "project_name":
      return !formData.project_name.trim();
    case "category":
      return !formData.category;
    case "date":
      return !formData.date;
    case "volunteers":
      return formData.volunteers === "" || formData.volunteers < 0;
    case "beneficiaries":
      return formData.beneficiaries === "" || formData.beneficiaries < 0;
  }
}

function getFieldClassName(
  field: RequiredField,
  formData: ProjectFormData,
  formTouched: boolean
): string {
  const hasError = formTouched && isRequiredFieldEmpty(field, formData);
  return hasError ? lux.inputError : inputClassName;
}

function FieldError({
  field,
  formData,
  formTouched,
}: {
  field: RequiredField;
  formData: ProjectFormData;
  formTouched: boolean;
}) {
  if (!formTouched || !isRequiredFieldEmpty(field, formData)) {
    return null;
  }

  return <p className="mt-1 text-xs text-red-600">{REQUIRED_FIELD_ERRORS[field]}</p>;
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
      {children}
      <span className="ml-0.5 text-red-500">*</span>
    </label>
  );
}

function OptionalLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={lux.card}>
      <h2 className="mb-4 text-base font-semibold tracking-tight text-neutral-900">{title}</h2>
      {children}
    </div>
  );
}

interface TagInputProps {
  label: string;
  tags: string[];
  placeholder: string;
  onTagsChange: (tags: string[]) => void;
}

function TagInput({ label, tags, placeholder, onTagsChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  function addTag() {
    const trimmed = inputValue.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setInputValue("");
      return;
    }
    onTagsChange([...tags, trimmed]);
    setInputValue("");
  }

  function removeTag(tag: string) {
    onTagsChange(tags.filter((item) => item !== tag));
  }

  return (
    <div>
      <OptionalLabel htmlFor={label}>{label}</OptionalLabel>
      <div className="flex gap-2">
        <input
          id={label}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className={inputClassName}
        />
        <button
          type="button"
          onClick={addTag}
          className={lux.btnSecondary}
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-neutral-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-slate-500 hover:text-slate-900"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SubmitForm({
  formData,
  onChange,
  onPhotosChange,
  photos,
  formTouched = false,
}: SubmitFormProps) {
  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    onPhotosChange(selected.slice(0, 5));
    event.target.value = "";
  }

  return (
    <div className="space-y-6">
      <FormCard title="Organization & Project">
        <div className="space-y-4">
          <div>
            <RequiredLabel htmlFor="club_name">Club Name</RequiredLabel>
            <input
              id="club_name"
              type="text"
              value={formData.club_name}
              onChange={(event) => onChange({ club_name: event.target.value })}
              className={getFieldClassName("club_name", formData, formTouched)}
            />
            <FieldError field="club_name" formData={formData} formTouched={formTouched} />
          </div>
          <div>
            <RequiredLabel htmlFor="project_name">Project Name</RequiredLabel>
            <input
              id="project_name"
              type="text"
              value={formData.project_name}
              onChange={(event) => onChange({ project_name: event.target.value })}
              className={getFieldClassName("project_name", formData, formTouched)}
            />
            <FieldError field="project_name" formData={formData} formTouched={formTouched} />
          </div>
          <div>
            <RequiredLabel htmlFor="category">Category</RequiredLabel>
            <Select
              value={formData.category || undefined}
              onValueChange={(value) =>
                onChange({ category: value as ProjectCategory })
              }
            >
              <SelectTrigger
                id="category"
                className={
                  formTouched && isRequiredFieldEmpty("category", formData)
                    ? "border-red-400 focus:ring-red-500"
                    : undefined
                }
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError field="category" formData={formData} formTouched={formTouched} />
          </div>
          <div>
            <RequiredLabel htmlFor="date">Date</RequiredLabel>
            <input
              id="date"
              type="date"
              value={toDateInputValue(formData.date)}
              onChange={(event) =>
                onChange({ date: toDateInputValue(event.target.value) })
              }
              className={getFieldClassName("date", formData, formTouched)}
            />
            <FieldError field="date" formData={formData} formTouched={formTouched} />
          </div>
        </div>
      </FormCard>

      <FormCard title="People & Duration">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <RequiredLabel htmlFor="volunteers">Volunteers</RequiredLabel>
            <input
              id="volunteers"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={toNumberInputValue(formData.volunteers)}
              onChange={(event) => {
                const raw = event.target.value.replace(/[^\d]/g, "");
                onChange({
                  volunteers: raw === "" ? "" : Number(raw),
                });
              }}
              className={getFieldClassName("volunteers", formData, formTouched)}
            />
            <FieldError field="volunteers" formData={formData} formTouched={formTouched} />
          </div>
          <div>
            <RequiredLabel htmlFor="beneficiaries">Beneficiaries</RequiredLabel>
            <input
              id="beneficiaries"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={toNumberInputValue(formData.beneficiaries)}
              onChange={(event) => {
                const raw = event.target.value.replace(/[^\d]/g, "");
                onChange({
                  beneficiaries: raw === "" ? "" : Number(raw),
                });
              }}
              className={getFieldClassName("beneficiaries", formData, formTouched)}
            />
            <FieldError field="beneficiaries" formData={formData} formTouched={formTouched} />
          </div>
          <div>
            <RequiredLabel htmlFor="duration_hours">Duration Hours</RequiredLabel>
            <input
              id="duration_hours"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={toNumberInputValue(formData.duration_hours)}
              onChange={(event) => {
                const raw = event.target.value.replace(/[^\d.]/g, "");
                onChange({
                  duration_hours: raw === "" || raw === "." ? "" : Number(raw),
                });
              }}
              className={inputClassName}
            />
          </div>
        </div>
      </FormCard>

      <FormCard title="Partners & Activities">
        <div className="space-y-6">
          <TagInput
            label="Partners"
            tags={formData.partners}
            placeholder="Add a partner organization"
            onTagsChange={(partners) => onChange({ partners })}
          />
          <TagInput
            label="Activities"
            tags={formData.activities}
            placeholder="Add an activity"
            onTagsChange={(activities) => onChange({ activities })}
          />
        </div>
      </FormCard>

      <FormCard title="Description">
        <OptionalLabel htmlFor="description">Description</OptionalLabel>
        <textarea
          id="description"
          value={formData.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Brief description of the initiative..."
          className={`${inputClassName} min-h-24`}
        />
      </FormCard>

      <FormCard title="Photos (Optional)">
        <OptionalLabel htmlFor="photos">Upload photos</OptionalLabel>
        <input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border file:border-slate-200 file:bg-white file:px-5 file:py-2 file:text-sm file:font-medium file:text-neutral-900 hover:file:bg-neutral-50"
        />
        <p className="mt-2 text-xs text-slate-400">
          Up to 5 photos · JPG, PNG, or HEIC (converted automatically)
        </p>
        {photos.length > 0 && (
          <ul className="mt-4 space-y-2">
            {photos.map((file) => (
              <li key={`${file.name}-${file.size}`} className="text-sm text-slate-600">
                {file.name} · {formatFileSize(file.size)}
              </li>
            ))}
          </ul>
        )}
      </FormCard>
    </div>
  );
}
