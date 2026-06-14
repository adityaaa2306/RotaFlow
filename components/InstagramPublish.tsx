"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertCircle, Instagram, Loader2 } from "lucide-react";
import { lux } from "@/lib/theme";

export interface InstagramPublishProps {
  projectId: string;
}

interface InstagramStatus {
  connected: boolean;
  configured?: boolean;
  setup_message?: string;
  username?: string | null;
}

export function InstagramPublish({ projectId }: InstagramPublishProps) {
  const pathname = usePathname();
  const [status, setStatus] = useState<InstagramStatus>({ connected: false });
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectHref = `/api/instagram/auth?return=${encodeURIComponent(pathname)}`;

  const loadStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const response = await fetch("/api/instagram/status");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to check Instagram connection");
      }
      setStatus(data as InstagramStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to check Instagram connection";
      setError(message);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function handlePublish() {
    setIsPublishing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/instagram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to publish to Instagram");
      }

      setSuccessMessage(
        `Published ${data.photo_count} photo${data.photo_count === 1 ? "" : "s"} to Instagram${
          status.username ? ` (@${status.username})` : ""
        }.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish to Instagram";
      setError(message);
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="lux-card">
      <div className="mb-4 flex items-center gap-2">
        <Instagram className="h-5 w-5 text-pink-600" />
        <h3 className="text-base font-semibold text-slate-800">Publish to Instagram</h3>
      </div>

      <p className="text-sm text-slate-600">
        Connect your Instagram Professional account (e.g. <strong>@rotaractdummy</strong>), then
        publish project photos with a caption built from the report, social kit, and AI photo
        captions.
      </p>

      {status.configured === false && status.setup_message && (
        <div className={`mt-4 ${lux.alertWarning}`}>
          <p className="font-medium">Meta app not configured yet</p>
          <p className="mt-2">{status.setup_message}</p>
          <p className="mt-2 text-xs text-amber-700">
            In Meta for Developers, add redirect URI:{" "}
            <code className="rounded bg-white px-1 py-0.5">
              {typeof window !== "undefined"
                ? `${window.location.origin}/api/instagram/callback`
                : "http://localhost:PORT/api/instagram/callback"}
            </code>
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isLoadingStatus ? (
          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking connection...
          </span>
        ) : status.connected ? (
          <>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Connected{status.username ? ` as @${status.username}` : ""}
            </span>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="lux-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPublishing && <Loader2 className="h-4 w-4 animate-spin" />}
              Publish to Instagram
            </button>
          </>
        ) : status.configured === false ? (
          <span className="text-sm text-slate-500">
            Configure Meta credentials in `.env.local` first.
          </span>
        ) : (
          <a
            href={connectHref}
            className={lux.btnSecondary}
          >
            <Instagram className="h-4 w-4" />
            Connect @rotaractdummy
          </a>
        )}
      </div>

      {status.configured !== false && !status.connected && !isLoadingStatus && (
        <p className="mt-3 text-xs text-slate-500">
          When Instagram opens, log in as <strong>@rotaractdummy</strong> and approve access. The
          account must be a Professional (Business/Creator) account.
        </p>
      )}

      {successMessage && <p className="mt-4 text-sm text-green-700">{successMessage}</p>}

      {error && (
        <div className={`mt-4 flex gap-3 ${lux.bannerError}`}>
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
