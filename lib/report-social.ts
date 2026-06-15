import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { SocialPostRecord, SocialPosts } from "@/types";

export async function recordSocialPost(
  projectId: string,
  platform: keyof SocialPosts,
  record: Omit<SocialPostRecord, "platform" | "published_at">
): Promise<void> {
  const admin = getSupabaseAdmin();

  const { data: report, error: fetchError } = await admin
    .from("reports")
    .select("id, social_posts")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError || !report) {
    return;
  }

  const existing = (report.social_posts as SocialPosts | null) ?? {};
  const socialPosts: SocialPosts = {
    ...existing,
    [platform]: {
      ...record,
      platform,
      published_at: new Date().toISOString(),
    },
  };

  const { error: updateError } = await admin
    .from("reports")
    .update({ social_posts: socialPosts })
    .eq("id", report.id);

  if (updateError) {
    throw new Error(`Failed to save social post status: ${updateError.message}`);
  }
}
