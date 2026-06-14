import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin client is not configured");
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey);
  return adminClient;
}

export interface InstagramConnection {
  id: string;
  ig_user_id: string;
  username: string | null;
  access_token: string;
  token_expires_at: string | null;
  updated_at: string;
}

export async function getInstagramConnection(): Promise<InstagramConnection | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("instagram_connections")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as InstagramConnection;
}

export async function saveInstagramConnection(input: {
  ig_user_id: string;
  username: string | null;
  access_token: string;
  token_expires_at: string | null;
}): Promise<void> {
  const { error } = await getSupabaseAdmin().from("instagram_connections").upsert(
    {
      ig_user_id: input.ig_user_id,
      username: input.username,
      access_token: input.access_token,
      token_expires_at: input.token_expires_at,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "ig_user_id" }
  );

  if (error) {
    throw new Error(`Failed to save Instagram connection: ${error.message}`);
  }
}
