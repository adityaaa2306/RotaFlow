export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getMetaSetupMessage, isMetaConfigured } from "@/lib/instagram";
import { getInstagramConnection } from "@/lib/supabase-admin";

export async function GET() {
  try {
    if (!isMetaConfigured()) {
      return NextResponse.json({
        connected: false,
        configured: false,
        setup_message: getMetaSetupMessage(),
        redirect_uri_hint: "Add this exact URL in Meta → Instagram → Business login settings",
      });
    }

    const connection = await getInstagramConnection();

    if (!connection) {
      return NextResponse.json({
        connected: false,
        configured: true,
      });
    }

    return NextResponse.json({
      connected: true,
      configured: true,
      username: connection.username,
      ig_user_id: connection.ig_user_id,
      token_expires_at: connection.token_expires_at,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load Instagram status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
