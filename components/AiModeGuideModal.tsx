"use client";

import { Mic, Sparkles, Type, CheckCircle2, X } from "lucide-react";
import { lux } from "@/lib/theme";

const STORAGE_KEY = "rotaflow-ai-guide-dismissed";

export function shouldShowAiGuide(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}

export function dismissAiGuide(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

const steps = [
  {
    icon: Type,
    title: "Tell the story",
    body: "Paste or type what happened — club name, event, who helped, and the impact. Or use a sample narrative to try it out.",
  },
  {
    icon: Mic,
    title: "Or speak it",
    body: "Tap the mic to record. We transcribe your voice, then you can edit the text before extracting.",
  },
  {
    icon: Sparkles,
    title: "Auto-fill with AI",
    body: "Hit Auto-Fill. AI pulls out structured fields and tags each one as confirmed, inferred, or missing.",
  },
  {
    icon: CheckCircle2,
    title: "Review & submit",
    body: "Check the form below, fill any gaps, add photos if you want, then Generate Report.",
  },
];

interface AiModeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export function AiModeGuideModal({ open, onClose }: AiModeGuideModalProps) {
  if (!open) return null;

  function handleClose() {
    dismissAiGuide();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-guide-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Close guide"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-lux-lg">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#2A85FF]">
              AI Mode
            </p>
            <h2
              id="ai-guide-title"
              className="mt-1 text-xl font-bold tracking-tight text-ink"
            >
              How to document with AI
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Skip the blank form. Describe the event once — we structure the
              report for you.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ol className="flex flex-col gap-4 px-6 py-5">
          {steps.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A85FF]/10 text-[#2A85FF]">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-ink">
                  <span className="mr-1.5 text-slate-400">{index + 1}.</span>
                  {title}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={handleClose} className={`${lux.btnPrimary} w-full`}>
            Got it — let&apos;s go
          </button>
        </div>
      </div>
    </div>
  );
}
