"use client";

import { useRef, useState } from "react";
import { AlertCircle, Loader2, Mic, Sparkles } from "lucide-react";
import { SAMPLE_NARRATIVES } from "@/lib/sample-data";
import type { ExtractedProject } from "@/types";

export interface ConversationalInputProps {
  onExtracted: (result: ExtractedProject) => void;
}

export function ConversationalInput({ onExtracted }: ConversationalInputProps) {
  const [narrative, setNarrative] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const canExtract = narrative.trim().length >= 20 && !isExtracting && !isTranscribing;
  const voiceBusy = isRecording || isTranscribing;

  async function handleAutoFill(textOverride?: string) {
    const text = (textOverride ?? narrative).trim();

    if (text.length < 20) {
      if (textOverride) {
        setError("Transcript too short to extract project data.");
      }
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ narrative: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to extract project data");
      }

      onExtracted(data as ExtractedProject);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extract project data";
      setError(message);
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleVoiceToggle() {
    if (isTranscribing) {
      return;
    }

    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsRecording(false);
      return;
    }

    setError(null);
    setAudioChunks([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          setAudioChunks([...chunks]);
        }
      };

      recorder.onstop = async () => {
        setIsTranscribing(true);

        try {
          const mimeType = recorder.mimeType || "audio/webm";
          const blob = new Blob(chunks.length > 0 ? chunks : audioChunks, {
            type: mimeType,
          });

          const response = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": mimeType },
            body: blob,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error ?? "Failed to transcribe audio");
          }

          const transcript = data.transcript as string;
          setNarrative(transcript);
          setAudioChunks([]);
          await handleAutoFill(transcript);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to transcribe audio";
          setError(message);
        } finally {
          setIsTranscribing(false);
          setMediaRecorder(null);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      if (
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
      ) {
        setError(
          "Microphone access denied. Please allow microphone access and try again."
        );
      } else {
        const message =
          err instanceof Error ? err.message : "Failed to start voice recording";
        setError(message);
      }
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-800">Describe Your Event</h2>
      </div>

      <textarea
        className="min-h-40 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Yesterday our club organized a blood donation camp with Ruby Hall Clinic. Around 48 volunteers collected 62 units of blood between 9 AM and 2 PM..."
        value={narrative}
        onChange={(event) => setNarrative(event.target.value)}
      />

      <p className="mt-1 text-right text-xs text-slate-400">{narrative.length} characters</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setNarrative(SAMPLE_NARRATIVES[0].text)}
          disabled={voiceBusy}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Load Demo
        </button>
        <button
          type="button"
          onClick={() => handleAutoFill()}
          disabled={!canExtract}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExtracting && <Loader2 className="h-4 w-4 animate-spin" />}
          ✨ Auto-Fill with AI
        </button>
      </div>

      <button
        type="button"
        onClick={handleVoiceToggle}
        disabled={isTranscribing || isExtracting}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
          isRecording
            ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        {isTranscribing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing audio...
          </>
        ) : isRecording ? (
          <>🔴 Recording... Click to stop</>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            🎙 Record Voice Note
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
