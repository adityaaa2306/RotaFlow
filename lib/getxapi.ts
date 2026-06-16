import { buildXTweetText } from "@/lib/x-caption";
import { ensurePublicJpegUrl } from "@/lib/public-media";
import {
  fetchPhotosByProjectId,
  fetchProjectWithReportById,
} from "@/lib/supabase";
import type { ReportData } from "@/types";

const GETXAPI_BASE_URL = "https://api.getxapi.com";
const DEFAULT_X_USERNAME = "codeappetizer";

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function getGetXApiKey(): string {
  return readEnv("GETXAPI_API_KEY") || readEnv("GETXAPI_KEY");
}

export function getGetXAuthToken(): string {
  return readEnv("GETXAPI_AUTH_TOKEN") || readEnv("X_AUTH_TOKEN");
}

export function isGetXConfigured(): boolean {
  return Boolean(getGetXApiKey() && getGetXAuthToken());
}

export function getGetXSetupMessage(): string {
  const missing: string[] = [];
  if (!getGetXApiKey()) {
    missing.push("GETXAPI_API_KEY");
  }
  if (!getGetXAuthToken()) {
    missing.push("GETXAPI_AUTH_TOKEN");
  }
  if (missing.length === 0) {
    return "";
  }
  return `Add ${missing.join(" and ")} to your Vercel environment variables (or .env.local for local dev), then redeploy.`;
}

export function getXUsername(): string {
  return (readEnv("X_USERNAME") || DEFAULT_X_USERNAME).replace(/^@/, "");
}

export class GetXApiError extends Error {
  code: "INSUFFICIENT_CREDITS" | "AUTH" | "API";

  constructor(message: string, code: GetXApiError["code"]) {
    super(message);
    this.name = "GetXApiError";
    this.code = code;
  }
}

export function getPublishErrorStatus(error: unknown): number {
  if (error instanceof GetXApiError) {
    if (error.code === "INSUFFICIENT_CREDITS") {
      return 402;
    }
    if (error.code === "AUTH") {
      return 401;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("not configured") || error.message.includes("not connected")) {
      return 400;
    }
    if (error.message.includes("not found") || error.message.includes("Add at least one photo")) {
      return 400;
    }
  }

  return 500;
}

function reportRowToReportData(
  row: NonNullable<Awaited<ReturnType<typeof fetchProjectWithReportById>>>["report"],
  project: NonNullable<Awaited<ReturnType<typeof fetchProjectWithReportById>>>["project"]
): ReportData {
  if (!row) {
    throw new Error("Report is required before publishing to X");
  }

  return {
    id: row.id,
    project_id: row.project_id,
    executive_summary: row.executive_summary ?? "",
    objectives: row.objectives ?? "",
    activities_conducted: row.activities_conducted ?? "",
    outcomes: row.outcomes ?? "",
    recommendations: row.recommendations ?? "",
    closing_statement: row.closing_statement ?? "",
    sdgs: row.sdgs ?? [],
    metrics: {
      volunteer_hours: row.volunteer_hours ?? 0,
      beneficiaries_reached: project.beneficiaries,
      partnerships_mobilized: project.partners.length,
      outcome_indicators: [],
    },
    social_kit: row.social_kit ?? {
      instagram: { caption: "", hashtags: [] },
      linkedin: { post: "" },
      twitter: { post: "" },
    },
    created_at: row.created_at,
  };
}

async function createTweet(input: {
  text: string;
  mediaUrls?: string[];
}): Promise<{ tweetId: string | null; status: string; tweetUrl: string | null }> {
  const apiKey = getGetXApiKey();
  const authToken = getGetXAuthToken();

  if (!apiKey || !authToken) {
    throw new Error(getGetXSetupMessage() || "GetXAPI is not configured");
  }

  const body: Record<string, string | string[]> = {
    auth_token: authToken,
    text: input.text,
  };

  if (input.mediaUrls && input.mediaUrls.length > 0) {
    body.media_urls = input.mediaUrls;
  }

  const response = await fetch(`${GETXAPI_BASE_URL}/twitter/tweet/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const rawBody = await response.text();
  let payload: {
    status?: string;
    error?: string;
    data?: {
      id?: string | null;
      text?: string;
    };
  };

  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    throw new GetXApiError(
      `GetXAPI returned a non-JSON response (${response.status}). Check GETXAPI_API_KEY on Vercel.`,
      "API"
    );
  }

  if (!response.ok) {
    const apiError = payload.error ?? `GetXAPI error (${response.status})`;
    const lowerError = apiError.toLowerCase();

    if (lowerError.includes("insufficient credits") || lowerError.includes("not enough credits")) {
      throw new GetXApiError(
        "Your GetXAPI account has no credits left. Top up at getxapi.com (~$0.002 per tweet), then try again.",
        "INSUFFICIENT_CREDITS"
      );
    }

    if (
      lowerError.includes("auth") ||
      lowerError.includes("token") ||
      lowerError.includes("login") ||
      response.status === 401
    ) {
      throw new GetXApiError(
        "X session expired. Update GETXAPI_AUTH_TOKEN in .env.local with a fresh auth_token from x.com cookies.",
        "AUTH"
      );
    }

    throw new GetXApiError(apiError, "API");
  }

  const tweetId = payload.data?.id ?? null;
  const username = getXUsername();

  return {
    tweetId,
    status: payload.status ?? "success",
    tweetUrl: tweetId ? `https://x.com/${username}/status/${tweetId}` : null,
  };
}

export async function publishProjectToX(projectId: string): Promise<{
  tweetId: string | null;
  tweetUrl: string | null;
  text: string;
  photoCount: number;
  status: string;
}> {
  if (!isGetXConfigured()) {
    throw new Error(getGetXSetupMessage() || "GetXAPI is not configured");
  }

  const projectBundle = await fetchProjectWithReportById(projectId);
  if (!projectBundle?.report) {
    throw new Error("Project report not found");
  }

  const photos = await fetchPhotosByProjectId(projectId);
  if (photos.length === 0) {
    throw new Error("Add at least one photo before publishing to X");
  }

  const report = reportRowToReportData(projectBundle.report, projectBundle.project);
  const text = buildXTweetText(projectBundle.project, report, photos);
  const selectedPhotos = photos.slice(0, 4);
  const mediaUrls = await Promise.all(
    selectedPhotos.map((photo) =>
      ensurePublicJpegUrl(photo.storage_url, projectId, "x-ready")
    )
  );

  const result = await createTweet({
    text,
    mediaUrls,
  });

  return {
    tweetId: result.tweetId,
    tweetUrl: result.tweetUrl,
    text,
    photoCount: mediaUrls.length,
    status: result.status,
  };
}
