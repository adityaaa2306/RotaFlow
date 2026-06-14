import sharp from "sharp";
import { analyzeImageSafe } from "@/lib/vision";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function sanitizeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_").slice(0, 80);
  return base || "photo";
}

async function convertToJpeg(inputBuffer: Buffer, fileName: string): Promise<Buffer> {
  try {
    return await sharp(inputBuffer).rotate().jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  } catch (sharpError) {
    const lowerName = fileName.toLowerCase();
    const isHeic = lowerName.endsWith(".heic") || lowerName.endsWith(".heif");

    if (isHeic) {
      try {
        const heicConvert = (await import("heic-convert")).default;
        const converted = await heicConvert({
          buffer: inputBuffer,
          format: "JPEG",
          quality: 0.88,
        });
        return Buffer.from(converted);
      } catch {
        throw new Error("Unsupported HEIC image. Try exporting as JPG.");
      }
    }

    throw sharpError instanceof Error ? sharpError : new Error("Unsupported image format");
  }
}

export async function uploadProjectPhoto(
  projectId: string,
  file: File
): Promise<{ storageUrl: string; caption: string; isHighlight: boolean }> {
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  let jpegBuffer: Buffer;

  try {
    jpegBuffer = await convertToJpeg(inputBuffer, file.name);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unsupported image format";
    throw new Error(`Could not process ${file.name}: ${message}`);
  }

  const path = `${projectId}/${Date.now()}_${sanitizeFileName(file.name)}.jpg`;

  const { error: uploadError } = await getSupabaseAdmin().storage
    .from("photos")
    .upload(path, jpegBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
  }

  const { data } = getSupabaseAdmin().storage.from("photos").getPublicUrl(path);
  const storageUrl = data.publicUrl;

  const vision = await analyzeImageSafe(jpegBuffer.toString("base64"), "image/jpeg");

  const { error: insertError } = await getSupabaseAdmin().from("photos").insert({
    project_id: projectId,
    storage_url: storageUrl,
    caption: vision.caption ?? "",
    is_highlight: Boolean(vision.is_highlight),
  });

  if (insertError) {
    throw new Error(`Failed to save ${file.name}: ${insertError.message}`);
  }

  return {
    storageUrl,
    caption: vision.caption ?? "",
    isHighlight: Boolean(vision.is_highlight),
  };
}
