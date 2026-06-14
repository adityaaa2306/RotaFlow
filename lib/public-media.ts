import sharp from "sharp";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function ensurePublicJpegUrl(
  sourceUrl: string,
  projectId: string,
  folder = "social-ready"
): Promise<string> {
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch image for social publish: ${response.status}`);
  }

  const inputBuffer = Buffer.from(await response.arrayBuffer());
  const jpegBuffer = await sharp(inputBuffer)
    .rotate()
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  const path = `${folder}/${projectId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { error } = await getSupabaseAdmin().storage.from("photos").upload(path, jpegBuffer, {
    contentType: "image/jpeg",
    upsert: true,
  });

  if (error) {
    throw new Error(`Failed to upload JPEG for social publish: ${error.message}`);
  }

  const { data } = getSupabaseAdmin().storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}
