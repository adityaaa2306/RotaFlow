import { buildInstagramCaption } from "@/lib/instagram-caption";
import { ensurePublicJpegUrl } from "@/lib/public-media";
import { getInstagramConnection } from "@/lib/supabase-admin";
import {
  fetchPhotosByProjectId,
  fetchProjectWithReportById,
} from "@/lib/supabase";
import type { ReportData } from "@/types";

const GRAPH_HOST = "https://graph.instagram.com";
const API_VERSION = "v21.0";

export function isMetaConfigured(): boolean {
  return Boolean(process.env.META_APP_ID?.trim() && process.env.META_APP_SECRET?.trim());
}

export function getMetaSetupMessage(): string {
  const missing: string[] = [];
  if (!process.env.META_APP_ID?.trim()) missing.push("META_APP_ID");
  if (!process.env.META_APP_SECRET?.trim()) missing.push("META_APP_SECRET");

  if (missing.length === 0) {
    return "";
  }

  return `Add ${missing.join(" and ")} to .env.local from Meta for Developers, then restart npm run dev.`;
}

export function resolveAppBaseUrl(request: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL?.trim()) {
    return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "");
  }

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function resolveRedirectUri(request: Request): string {
  if (process.env.META_REDIRECT_URI?.trim()) {
    return process.env.META_REDIRECT_URI.trim();
  }

  return `${resolveAppBaseUrl(request)}/api/instagram/callback`;
}

function getMetaSecrets() {
  const appId = process.env.META_APP_ID?.trim();
  const appSecret = process.env.META_APP_SECRET?.trim();

  if (!appId || !appSecret) {
    throw new Error(getMetaSetupMessage() || "Meta app credentials are not configured");
  }

  return { appId, appSecret };
}

function encodeOAuthState(redirectUri: string, returnPath: string): string {
  return Buffer.from(JSON.stringify({ redirectUri, returnPath })).toString("base64url");
}

export function decodeOAuthState(state: string | null): {
  redirectUri: string | null;
  returnPath: string | null;
} {
  if (!state) {
    return { redirectUri: null, returnPath: null };
  }

  try {
    const parsed = JSON.parse(Buffer.from(state, "base64url").toString()) as {
      redirectUri?: string;
      returnPath?: string;
    };

    return {
      redirectUri: parsed.redirectUri ?? null,
      returnPath: parsed.returnPath ?? null,
    };
  } catch {
    return { redirectUri: null, returnPath: null };
  }
}

export function getInstagramAuthUrl(request: Request, returnPath = "/archive"): string {
  const { appId } = getMetaSecrets();
  const redirectUri = resolveRedirectUri(request);
  const scope = [
    "instagram_business_basic",
    "instagram_business_content_publish",
  ].join(",");

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope,
    response_type: "code",
    state: encodeOAuthState(redirectUri, returnPath),
  });

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
}

export async function exchangeInstagramCode(
  code: string,
  redirectUri: string
): Promise<{
  igUserId: string;
  username: string | null;
  accessToken: string;
  tokenExpiresAt: string | null;
}> {
  const { appId, appSecret } = getMetaSecrets();

  const shortLivedResponse = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    }),
  });

  const shortLivedPayload = (await shortLivedResponse.json()) as {
    access_token?: string;
    user_id?: string;
    error_message?: string;
  };

  if (!shortLivedResponse.ok || !shortLivedPayload.access_token) {
    throw new Error(
      shortLivedPayload.error_message ?? "Failed to exchange Instagram authorization code"
    );
  }

  const longLivedUrl = new URL(`${GRAPH_HOST}/access_token`);
  longLivedUrl.searchParams.set("grant_type", "ig_exchange_token");
  longLivedUrl.searchParams.set("client_secret", appSecret);
  longLivedUrl.searchParams.set("access_token", shortLivedPayload.access_token);

  const longLivedResponse = await fetch(longLivedUrl);
  const longLivedPayload = (await longLivedResponse.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: { message?: string };
  };

  if (!longLivedResponse.ok || !longLivedPayload.access_token) {
    throw new Error(
      longLivedPayload.error?.message ?? "Failed to obtain long-lived Instagram token"
    );
  }

  const profileUrl = new URL(`${GRAPH_HOST}/${API_VERSION}/me`);
  profileUrl.searchParams.set("fields", "user_id,username");
  profileUrl.searchParams.set("access_token", longLivedPayload.access_token);

  const profileResponse = await fetch(profileUrl);
  const profilePayload = (await profileResponse.json()) as {
    user_id?: string;
    username?: string;
    error?: { message?: string };
  };

  if (!profileResponse.ok || !profilePayload.user_id) {
    throw new Error(profilePayload.error?.message ?? "Failed to load Instagram profile");
  }

  const tokenExpiresAt = longLivedPayload.expires_in
    ? new Date(Date.now() + longLivedPayload.expires_in * 1000).toISOString()
    : null;

  return {
    igUserId: profilePayload.user_id,
    username: profilePayload.username ?? null,
    accessToken: longLivedPayload.access_token,
    tokenExpiresAt,
  };
}

async function graphPost<T>(
  path: string,
  accessToken: string,
  body: Record<string, string | boolean>
): Promise<T> {
  const response = await fetch(`${GRAPH_HOST}/${API_VERSION}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as T & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? `Instagram API error (${response.status})`);
  }

  return payload;
}

function reportRowToReportData(
  row: NonNullable<Awaited<ReturnType<typeof fetchProjectWithReportById>>>["report"],
  project: NonNullable<Awaited<ReturnType<typeof fetchProjectWithReportById>>>["project"]
): ReportData {
  if (!row) {
    throw new Error("Report is required before publishing to Instagram");
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

export async function publishProjectToInstagram(projectId: string): Promise<{
  mediaId: string;
  caption: string;
  photoCount: number;
}> {
  const connection = await getInstagramConnection();
  if (!connection) {
    throw new Error("Instagram is not connected. Connect your account first.");
  }

  const projectBundle = await fetchProjectWithReportById(projectId);
  if (!projectBundle?.report) {
    throw new Error("Project report not found");
  }

  const photos = await fetchPhotosByProjectId(projectId);
  if (photos.length === 0) {
    throw new Error("Add at least one photo before publishing to Instagram");
  }

  const report = reportRowToReportData(projectBundle.report, projectBundle.project);
  const caption = buildInstagramCaption(projectBundle.project, report, photos);
  const selectedPhotos = photos.slice(0, 10);
  const jpegUrls = await Promise.all(
    selectedPhotos.map((photo) => ensurePublicJpegUrl(photo.storage_url, projectId))
  );

  const { access_token: accessToken, ig_user_id: igUserId } = connection;

  if (jpegUrls.length === 1) {
    const container = await graphPost<{ id: string }>(`${igUserId}/media`, accessToken, {
      image_url: jpegUrls[0],
      caption,
    });

    const published = await graphPost<{ id: string }>(
      `${igUserId}/media_publish`,
      accessToken,
      { creation_id: container.id }
    );

    return { mediaId: published.id, caption, photoCount: 1 };
  }

  const childIds: string[] = [];
  for (const imageUrl of jpegUrls) {
    const child = await graphPost<{ id: string }>(`${igUserId}/media`, accessToken, {
      image_url: imageUrl,
      is_carousel_item: true,
    });
    childIds.push(child.id);
  }

  const carousel = await graphPost<{ id: string }>(`${igUserId}/media`, accessToken, {
    media_type: "CAROUSEL",
    children: childIds.join(","),
    caption,
  });

  const published = await graphPost<{ id: string }>(
    `${igUserId}/media_publish`,
    accessToken,
    { creation_id: carousel.id }
  );

  return {
    mediaId: published.id,
    caption,
    photoCount: jpegUrls.length,
  };
}
