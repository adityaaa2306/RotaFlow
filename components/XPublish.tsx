"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { lux } from "@/lib/theme";

export interface XPublishProps {
  projectId: string;
}

interface XStatus {
  connected: boolean;
  configured?: boolean;
  setup_message?: string;
  username?: string | null;
}

export function XPublish({ projectId }: XPublishProps) {
  const [status, setStatus] = useState<XStatus>({ connected: false });
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [errorTone, setErrorTone] = useState<"amber" | "red">("red");

  const loadStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const response = await fetch("/api/x/status");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to check X connection");
      }
      setStatus(data as XStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to check X connection";
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
    setErrorTone("red");

    try {
      const response = await fetch("/api/x/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "INSUFFICIENT_CREDITS") {
          setErrorTone("amber");
          setError(
            <>
              Your GetXAPI account has no credits left. Add funds at{" "}
              <a
                href="https://getxapi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-900"
              >
                getxapi.com
              </a>{" "}
              (~$0.002 per tweet), restart isn&apos;t needed — just click Publish again after
              topping up.
            </>
          );
          return;
        }

        throw new Error(data.error ?? "Failed to publish to X");
      }

      const tweetLink = data.tweet_url ? (
        <>
          {" "}
          <a
            href={data.tweet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-800"
          >
            View on X
          </a>
        </>
      ) : null;

      setSuccessMessage(
        <>
          Published {data.photo_count} photo{data.photo_count === 1 ? "" : "s"} to X
          {status.username ? ` (@${status.username})` : ""}.{tweetLink}
        </>
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish to X";
      setError(message);
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="lux-card">
      <div className="mb-4 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-900" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <h3 className="text-base font-semibold text-slate-800">Publish to X</h3>
      </div>

      <p className="text-sm text-slate-600">
        Posts to <strong>@codeappetizer</strong> via GetXAPI using{" "}
        <code className="rounded bg-slate-100 px-1">GETXAPI_API_KEY</code> and{" "}
        <code className="rounded bg-slate-100 px-1">GETXAPI_AUTH_TOKEN</code> in{" "}
        <code className="rounded bg-slate-100 px-1">.env.local</code>. Up to 4 project photos
        with a tweet from the report and social kit.
      </p>

      {status.configured === false && status.setup_message && (
        <div className={`mt-4 ${lux.alertWarning}`}>
          <p className="font-medium">GetXAPI not configured yet</p>
          <p className="mt-2">{status.setup_message}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isLoadingStatus ? (
          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking configuration...
          </span>
        ) : status.connected ? (
          <>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Ready as @{status.username ?? "codeappetizer"}
            </span>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="lux-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPublishing && <Loader2 className="h-4 w-4 animate-spin" />}
              Publish to X
            </button>
          </>
        ) : (
          <span className="text-sm text-slate-500">
            Add GETXAPI_API_KEY and GETXAPI_AUTH_TOKEN to `.env.local`, then restart the dev
            server.
          </span>
        )}
      </div>

      {successMessage && <p className="mt-4 text-sm text-green-700">{successMessage}</p>}

      {error && (
        <div
          className={`mt-4 flex gap-3 p-4 ${
            errorTone === "amber" ? lux.alertWarning : lux.bannerError
          }`}
        >
          <AlertCircle
            className={`h-5 w-5 shrink-0 ${
              errorTone === "amber" ? "text-amber-700" : "text-red-600"
            }`}
          />
          <p
            className={`text-sm ${errorTone === "amber" ? "text-amber-900" : "text-red-700"}`}
          >
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
