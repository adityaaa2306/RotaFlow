"use client";

const JPEG_MIME_TYPE = "image/jpeg";
const TARGET_UPLOAD_BYTES = 1_500_000;
const MAX_DIRECT_UPLOAD_BYTES = 3_500_000;
const MAX_IMAGE_DIMENSION = 1600;

function isJpeg(file: File): boolean {
  const type = file.type.toLowerCase();
  return type === "image/jpeg" || type === "image/jpg";
}

function isHeic(file: File): boolean {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return (
    type.includes("heic") ||
    type.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function toJpegFileName(name: string): string {
  const withoutExtension = name.replace(/\.[^.]+$/, "");
  return `${withoutExtension || "photo"}.jpg`;
}

function getCanvasSize(width: number, height: number): { width: number; height: number } {
  const longestSide = Math.max(width, height);
  const scale = longestSide > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / longestSide : 1;

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Safari could not read this image for optimization"));
    };

    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not optimize image"));
          return;
        }

        resolve(blob);
      },
      JPEG_MIME_TYPE,
      quality
    );
  });
}

async function renderJpeg(file: File, image: HTMLImageElement, quality: number): Promise<File> {
  const canvas = document.createElement("canvas");
  const size = getCanvasSize(image.naturalWidth || image.width, image.naturalHeight || image.height);
  canvas.width = size.width;
  canvas.height = size.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not optimize image");
  }

  context.drawImage(image, 0, 0, size.width, size.height);

  const blob = await canvasToBlob(canvas, quality);
  return new File([blob], toJpegFileName(file.name), {
    type: JPEG_MIME_TYPE,
    lastModified: file.lastModified,
  });
}

export async function preparePhotoForUpload(file: File): Promise<File> {
  const shouldOptimize = isHeic(file) || !isJpeg(file) || file.size > TARGET_UPLOAD_BYTES;

  if (!shouldOptimize) {
    return file;
  }

  try {
    const image = await loadImage(file);
    let quality = 0.86;
    let optimized = await renderJpeg(file, image, quality);

    while (optimized.size > TARGET_UPLOAD_BYTES && quality > 0.58) {
      quality = Number((quality - 0.08).toFixed(2));
      optimized = await renderJpeg(file, image, quality);
    }

    if (optimized.size < file.size || isHeic(file) || file.size > MAX_DIRECT_UPLOAD_BYTES) {
      return optimized;
    }

    return file;
  } catch (error) {
    if (file.size <= MAX_DIRECT_UPLOAD_BYTES) {
      return file;
    }

    const message = error instanceof Error ? error.message : "The image could not be optimized";
    throw new Error(
      `${message}. "${file.name}" is too large for this mobile upload. Please choose a smaller JPG/PNG image or switch iPhone Camera > Formats to Most Compatible and try again.`
    );
  }
}
