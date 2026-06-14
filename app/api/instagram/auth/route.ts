export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  getInstagramAuthUrl,
  getMetaSetupMessage,
  isMetaConfigured,
  resolveAppBaseUrl,
} from "@/lib/instagram";

export async function GET(request: Request) {
  const baseUrl = resolveAppBaseUrl(request);
  const returnPath =
    new URL(request.url).searchParams.get("return")?.trim() || "/archive";

  if (!isMetaConfigured()) {
    const message = getMetaSetupMessage();
    return NextResponse.redirect(
      `${baseUrl}${returnPath}?instagram_error=${encodeURIComponent(message)}`
    );
  }

  try {
    return NextResponse.redirect(getInstagramAuthUrl(request, returnPath));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Instagram auth is not configured";
    return NextResponse.redirect(
      `${baseUrl}${returnPath}?instagram_error=${encodeURIComponent(message)}`
    );
  }
}
