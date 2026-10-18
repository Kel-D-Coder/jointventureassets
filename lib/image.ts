import { stampWatermark } from "@/lib/photoWatermark";

const MAX_EDGE = 1400;
const QUALITY = 0.78;

/**
 * Reads an uploaded photo, stamps the JVA watermark on it and shrinks it to a
 * JPEG data URL no wider or taller than 1400px, so photos stay small enough to send with the form.
 * With a real backend this becomes an upload that returns the stored file URL.
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
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  await stampWatermark(canvas);
  return canvas.toDataURL("image/jpeg", QUALITY);
}
