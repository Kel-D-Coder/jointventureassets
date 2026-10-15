import type { SubmittedDocument } from "@/lib/inbox/types";

export const MAX_DOCUMENT_MB = 5;

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Couldn't read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

/** 1_258_291 -> "1.2 MB", 45_000 -> "44 KB" */
export function fileSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Turns an uploaded PDF or image into a document record, or throws a sentence
 * explaining why it can't be used. With a real backend this becomes an upload.
 */
export async function toDocument(file: File): Promise<SubmittedDocument> {
  if (!(file.type === "application/pdf" || file.type.startsWith("image/"))) throw new Error(`${file.name} isn't a PDF or image.`);
  if (file.size > MAX_DOCUMENT_MB * 1024 * 1024) throw new Error(`${file.name} is over ${MAX_DOCUMENT_MB} MB.`);
  return { name: file.name, type: file.type, size: file.size, url: await readAsDataUrl(file) };
}

/** Browsers block opening data: URLs in a new tab, so uploaded files open as blob URLs instead. */
export async function openDocument(doc: SubmittedDocument): Promise<void> {
  const url = doc.url.startsWith("data:") ? URL.createObjectURL(await (await fetch(doc.url)).blob()) : doc.url;
  window.open(url, "_blank", "noopener");
}
