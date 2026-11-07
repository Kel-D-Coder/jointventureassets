import { stampWatermark } from "@/lib/photoWatermark";

/** Only bigger photos are scaled down; smaller ones keep their size. */
const MAX_EDGE = 3200;
/** High enough that the saved photo looks the same as the original. */
const QUALITY = 0.92;

/**
 * Reads an uploaded photo and stamps the JVA watermark on it, keeping the photo as sharp as the
 * original: its own size unless it's over 3200px on the longest side (sharper than any screen
 * shows), and saved as a high-quality JPEG. Returns a data URL; it's uploaded when the form is saved.
 */
export async function resizeImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} isn't an image.`);

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error(`Couldn't read ${file.name}. Try a JPG or PNG.`);
  });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  await stampWatermark(canvas);
  return canvas.toDataURL("image/jpeg", QUALITY);
}
