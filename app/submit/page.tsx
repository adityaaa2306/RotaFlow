"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, ClipboardList, Loader2, Sparkles } from "lucide-react";
import {
  AiModeGuideModal,
  shouldShowAiGuide,
} from "@/components/AiModeGuideModal";
import { ConversationalInput } from "@/components/ConversationalInput";
import { MissingFieldsPanel } from "@/components/MissingFieldsPanel";
import { SubmitForm } from "@/components/SubmitForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { preparePhotoForUpload } from "@/lib/client-image";
import { fetchJson } from "@/lib/fetch-json";
import { insertPhoto, insertProject, uploadPhoto } from "@/lib/supabase";
import { lux } from "@/lib/theme";
import { parseDateInput } from "@/lib/utils";
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
    club_name: data.club_name.trim(),
    project_name: data.project_name.trim(),
    category: (data.category || "Other") as ProjectCategory,
    date: parseDateInput(data.date),
    volunteers: typeof data.volunteers === "number" ? data.volunteers : 0,
    beneficiaries: typeof data.beneficiaries === "number" ? data.beneficiaries : 0,
    duration_hours: typeof data.duration_hours === "number" ? data.duration_hours : 0,
    partners: data.partners,
    activities: data.activities,
    description: data.description,
    raw_narrative: data.raw_narrative,
  };
}

async function processPhotos(projectId: string, files: File[]): Promise<void> {
  for (const originalFile of files) {
    const file = await preparePhotoForUpload(originalFile);
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("file", file);

    try {
      const { response, data } = await fetchJson<{ error?: string }>("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(data.error ?? `Failed to upload ${originalFile.name}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to upload ${originalFile.name}`;

      if (!message.includes("Server returned non-JSON")) {
        throw new Error(`Could not upload ${originalFile.name}: ${message}`);
      }

      try {
        const storageUrl = await uploadPhoto(projectId, file);
        await insertPhoto(projectId, storageUrl, "", false);
      } catch (fallbackErr) {
        const fallbackMessage =
          fallbackErr instanceof Error ? fallbackErr.message : "Fallback upload failed";
        throw new Error(
          `Could not upload ${originalFile.name}: ${fallbackMessage}. API upload also failed: ${message}`
        );
      }
    }
  }
}

function isFormValid(data: ProjectFormData): boolean {
  const normalizedDate = parseDateInput(data.date);

  return (
    data.club_name.trim().length > 0 &&
    data.project_name.trim().length > 0 &&
    Boolean(data.category) &&
    Boolean(normalizedDate) &&
    data.volunteers !== "" &&
    data.beneficiaries !== ""
  );
}

export default function SubmitPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("ai");
  const [showAiGuide, setShowAiGuide] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(EMPTY_FORM_DATA);
  const [extractedResult, setExtractedResult] = useState<ExtractedProject | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "ai" && shouldShowAiGuide()) {
      setShowAiGuide(true);
    }
  }, [activeTab]);

  function handleFormChange(updates: Partial<ProjectFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  function handleExtracted(result: ExtractedProject, narrative: string) {
    setExtractedResult(result);
    setFormData((prev) => {
      const updates: Partial<ProjectFormData> = {
        raw_narrative: narrative,
      };

      if (result.club_name !== null) {
        updates.club_name = result.club_name;
      }
      if (result.project_name !== null) {
        updates.project_name = result.project_name;
      }
      if (result.category !== null) {
        updates.category = result.category;
      }
      if (result.date != null && String(result.date).trim()) {
        updates.date = parseDateInput(String(result.date));
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
      if (result.description?.trim()) {
        updates.description = result.description.trim();
      } else if (narrative.trim()) {
        updates.description = narrative.trim().slice(0, 500);
      }

      return { ...prev, ...updates };
    });
  }

  async function handleSubmit() {
    setFormTouched(true);

    const normalizedFormData: ProjectFormData = {
      ...formData,
      date: parseDateInput(formData.date),
    };

    if (normalizedFormData.date !== formData.date) {
      setFormData(normalizedFormData);
    }

    if (!isFormValid(normalizedFormData)) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const project = await insertProject(toInsertProject(normalizedFormData));

      if (photos.length > 0) {
        await processPhotos(project.id, photos);
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
    <>
      <AiModeGuideModal open={showAiGuide} onClose={() => setShowAiGuide(false)} />

      <form
        noValidate
        className="mx-auto max-w-5xl p-8"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <header className={lux.pageHeader}>
          <h1 className={lux.pageTitle}>Submit Project</h1>
          <p className={lux.pageSubtitle}>
            Document your club&apos;s impact in seconds — AI Mode fills the form from
            your story.
          </p>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "manual" | "ai")}
        >
          <TabsList>
            <TabsTrigger value="ai">
              <Sparkles className="h-4 w-4" />
              AI Mode ✨
            </TabsTrigger>
            <TabsTrigger value="manual">
              <ClipboardList className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

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
                  <div className={lux.divider} />
                  <span className={lux.mutedText}>Review and complete the form below</span>
                  <div className={lux.divider} />
                </div>
              )}

              <SubmitForm {...submitFormProps} />
            </div>
          </TabsContent>

          <TabsContent value="manual">
            <SubmitForm {...submitFormProps} />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${lux.btnPrimary} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting && photos.length > 0 ? "Uploading photos..." : "Generate Report →"}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>

          {submitError && (
            <div className={`mt-4 flex gap-3 ${lux.bannerError}`}>
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
