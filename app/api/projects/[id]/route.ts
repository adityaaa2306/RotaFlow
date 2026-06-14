export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { deleteProjectById } from "@/lib/project-delete";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id?.trim();

    if (!projectId) {
      return NextResponse.json({ error: "Project id is required" }, { status: 400 });
    }

    await deleteProjectById(projectId);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
