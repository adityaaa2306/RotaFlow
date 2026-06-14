export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getGetXSetupMessage, getXUsername, isGetXConfigured } from "@/lib/getxapi";

export async function GET() {
  try {
    if (!isGetXConfigured()) {
      return NextResponse.json({
        connected: false,
        configured: false,
        setup_message: getGetXSetupMessage(),
      });
    }

    return NextResponse.json({
      connected: true,
      configured: true,
      username: getXUsername(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load X status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
