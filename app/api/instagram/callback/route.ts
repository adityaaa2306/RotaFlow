export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  decodeOAuthState,
  exchangeInstagramCode,
  resolveAppBaseUrl,
  resolveRedirectUri,
} from "@/lib/instagram";
import { saveInstagramConnection } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const { redirectUri: stateRedirectUri, returnPath } = decodeOAuthState(state);
  const baseUrl = resolveAppBaseUrl(request);
  const redirectTarget = returnPath?.startsWith("/") ? returnPath : "/archive";

  if (error) {
    return NextResponse.redirect(
      `${baseUrl}${redirectTarget}?instagram_error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}${redirectTarget}?instagram_error=missing_code`);
  }

  try {
    const redirectUri = stateRedirectUri ?? resolveRedirectUri(request);
    const connection = await exchangeInstagramCode(code, redirectUri);

    await saveInstagramConnection({
      ig_user_id: connection.igUserId,
      username: connection.username,
      access_token: connection.accessToken,
      token_expires_at: connection.tokenExpiresAt,
    });

    const usernameParam = connection.username
      ? `&instagram_username=${encodeURIComponent(connection.username)}`
      : "";

    return NextResponse.redirect(
      `${baseUrl}${redirectTarget}?instagram_connected=1${usernameParam}`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Instagram connection failed";
    return NextResponse.redirect(
      `${baseUrl}${redirectTarget}?instagram_error=${encodeURIComponent(message)}`
    );
  }
}
