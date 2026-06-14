import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function removeStoragePrefix(prefix: string): Promise<void> {
  const admin = getSupabaseAdmin();
  const { data: files, error } = await admin.storage.from("photos").list(prefix, {
    limit: 1000,
  });

  if (error || !files?.length) {
    return;
  }

  const paths = files.map((file) => `${prefix}/${file.name}`);
  await admin.storage.from("photos").remove(paths);
}

export async function deleteProjectById(projectId: string): Promise<void> {
  const admin = getSupabaseAdmin();

  await Promise.all([
    removeStoragePrefix(projectId),
    removeStoragePrefix(`x-ready/${projectId}`),
    removeStoragePrefix(`social-ready/${projectId}`),
  ]);

  const { error } = await admin.from("projects").delete().eq("id", projectId);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}
