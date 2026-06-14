"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, ClipboardList, Loader2, Sparkles } from "lucide-react";
import { ConversationalInput } from "@/components/ConversationalInput";
import { MissingFieldsPanel } from "@/components/MissingFieldsPanel";
import { SubmitForm } from "@/components/SubmitForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertPhoto, insertProject, uploadPhoto } from "@/lib/supabase";
import type {
  ExtractedProject,
  InsertProject,
  ProjectCategory,
  ProjectFormData,
} from "@/types";

const EMPTY_FORM_DATA: ProjectFormData = {
  club_name: "",
  project_name: "",
  category: "",
  date: "",
  volunteers: "",
  beneficiaries: "",
  duration_hours: "",
  partners: [],
  activities: [],
  description: "",
  raw_narrative: "",
};

function toInsertProject(data: ProjectFormData): InsertProject {
  return {
    club_name: data.club_name,
    project_name: data.project_name,
    category: (data.category || "Other") as ProjectCategory,
    date: data.date,
    volunteers: typeof data.volunteers === "number" ? data.volunteers : 0,
    beneficiaries: typeof data.beneficiaries === "number" ? data.beneficiaries : 0,
    duration_hours: typeof data.duration_hours === "number" ? data.duration_hours : 0,
    partners: data.partners,
    activities: data.activities,
    description: data.description,
    raw_narrative: data.raw_narrative,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("Failed to read photo"));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read photo"));
    reader.readAsDataURL(file);
  });
}

function processPhotosInBackground(projectId: string, files: File[]) {
  void (async () => {
    for (const file of files) {
      try {
        const url = await uploadPhoto(projectId, file);
        const imageBase64 = await fileToBase64(file);

        const visionResponse = await fetch("/api/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64,
            mimeType: file.type || "image/jpeg",
          }),
        });

        const visionData = await visionResponse.json();

        if (visionResponse.ok) {
          await insertPhoto(
            projectId,
            url,
            visionData.caption ?? "",
            Boolean(visionData.is_highlight)
          );
        } else {
          await insertPhoto(projectId, url, "", false);
        }
      } catch {
        // Fire-and-forget: photo processing failures should not block submission.
      }
    }
  })();
}

function isFormValid(data: ProjectFormData): boolean {
  return (
    data.club_name.trim().length > 0 &&
    data.project_name.trim().length > 0 &&
    Boolean(data.category) &&
    Boolean(data.date) &&
    data.volunteers !== "" &&
    data.beneficiaries !== ""
  );
}

export default function SubmitPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");
  const [formData, setFormData] = useState<ProjectFormData>(EMPTY_FORM_DATA);
  const [extractedResult, setExtractedResult] = useState<ExtractedProject | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleFormChange(updates: Partial<ProjectFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  function handleExtracted(result: ExtractedProject) {
    setExtractedResult(result);
    setFormData((prev) => {
      const updates: Partial<ProjectFormData> = {};

      if (result.project_name !== null) {
        updates.project_name = result.project_name;
      }
      if (result.category !== null) {
        updates.category = result.category;
      }
      if (result.date !== null) {
        updates.date = result.date;
      }
      if (result.volunteers !== null) {
        updates.volunteers = result.volunteers;
      }
      if (result.beneficiaries !== null) {
        updates.beneficiaries = result.beneficiaries;
      }
      if (result.duration_hours !== null) {
        updates.duration_hours = result.duration_hours;
      }
      if (result.partners.length > 0) {
        updates.partners = result.partners;
      }
      if (result.activities.length > 0) {
        updates.activities = result.activities;
      }

      return { ...prev, ...updates };
    });
  }

  async function handleSubmit() {
    setFormTouched(true);

    if (!isFormValid(formData)) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const project = await insertProject(toInsertProject(formData));

      if (photos.length > 0) {
        processPhotosInBackground(project.id, photos);
      }

      router.push(`/report/${project.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit project";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const submitFormProps = {
    formData,
    onChange: handleFormChange,
    photos,
    onPhotosChange: setPhotos,
    formTouched,
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900">Submit Project</h1>
        <p className="mt-1 text-sm text-slate-500">
          Document your club&apos;s impact in seconds.
        </p>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "manual" | "ai")}
      >
        <TabsList>
          <TabsTrigger value="manual">
            <ClipboardList className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=inactive]:text-blue-600">
            <Sparkles className="h-4 w-4" />
            AI Mode ✨
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <SubmitForm {...submitFormProps} />
        </TabsContent>

        <TabsContent value="ai">
          <div className="flex flex-col gap-6">
            <ConversationalInput onExtracted={handleExtracted} />

            {extractedResult && (
              <MissingFieldsPanel
                confidence={extractedResult.confidence}
                values={formData}
              />
            )}

            {extractedResult && (
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm text-slate-500">
                  Review and complete the form below
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            )}

            <SubmitForm {...submitFormProps} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Generate Report →
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </button>

        {submitError && (
          <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}
      </div>
    </div>
  );
}
