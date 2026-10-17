import { uploadFile } from "@/lib/api/auth";
import type { InboxEnquiry, ListingSubmission, NewEnquiry, SubmittedDocument } from "@/lib/inbox/types";

// ── Listing submissions → real FastAPI backend ──────────────────────────────

const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

async function call<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    signal: AbortSignal.timeout(60000),
  }).catch(() => {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { message?: string }).message ?? "Something went wrong.");
  return body as T;
}

export type SubmissionInput = {
  isOwner: boolean;
  contact: { fullName: string; email: string; phoneNumber: string };
  documents: SubmittedDocument[];
  listing: {
    title: string;
    dealType: string;
    propertyType: string;
    area: string;
    city: string;
    state: string;
    sizeSqm: number;
    price: number;
    titleDocument: string;
    description: string;
    highlights: string[];
    images: string[];
    jv?: { sharingFormula: string; sharingNegotiable?: boolean; premium?: number; proposal: string; duration: string };
    ownerName: string;
  };
};

/**
 * Converts a base64 data URL to a File and uploads it to Supabase Storage.
 * If the URL is already a public https:// URL, returns it unchanged.
 */
async function uploadDataUrl(dataUrl: string, filename: string, token: string): Promise<string> {
  if (!dataUrl.startsWith("data:")) return dataUrl;
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext = blob.type.split("/")[1] || "jpg";
  const name = filename.includes(".") ? filename : `${filename}.${ext}`;
  return uploadFile(new File([blob], name, { type: blob.type }), token);
}

/**
 * Uploads any base64 images and documents in the input to Supabase Storage,
 * replacing them with public URLs before sending to the backend.
 */
async function prepareInput(input: SubmissionInput, token: string): Promise<SubmissionInput> {
  const uploadedImages = await Promise.all(
    input.listing.images.map((url, i) => uploadDataUrl(url, `photo-${i}`, token)),
  );
  const uploadedDocuments = await Promise.all(
    input.documents.map(async (doc) => ({
      ...doc,
      url: await uploadDataUrl(doc.url, doc.name, token),
    })),
  );
  return {
    ...input,
    documents: uploadedDocuments,
    listing: { ...input.listing, images: uploadedImages },
  };
}

/**
 * Saves a property listing submission. With `draft: true` it stays private;
 * otherwise it goes to the admin for review. Pass `id` to update an existing draft.
 */
export async function saveSubmission(
  input: SubmissionInput,
  { id, draft }: { id?: string; draft: boolean },
  token: string,
): Promise<ListingSubmission> {
  const prepared = await prepareInput(input, token);
  if (id) {
    const data = await call<{ submission: ListingSubmission }>(
      `/listings/submit/${encodeURIComponent(id)}`,
      { method: "PATCH", body: JSON.stringify({ ...prepared, draft }) },
      token,
    );
    return data.submission;
  }
  const data = await call<{ submission: ListingSubmission }>(
    "/listings/submit",
    { method: "POST", body: JSON.stringify({ ...prepared, draft }) },
    token,
  );
  return data.submission;
}

/** GET /listings/submit/{id} */
export function getSubmission(id: string, token: string): Promise<ListingSubmission> {
  return call<ListingSubmission>(`/listings/submit/${encodeURIComponent(id)}`, undefined, token);
}

/** DELETE /listings/submit/{id} — drafts only */
export function deleteSubmission(id: string, token: string): Promise<unknown> {
  return call(`/listings/submit/${encodeURIComponent(id)}`, { method: "DELETE" }, token);
}

/** GET /listings/my-submissions */
export async function getMySubmissions(token: string): Promise<ListingSubmission[]> {
  const data = await call<{ submissions: ListingSubmission[] }>("/listings/my-submissions", undefined, token);
  return data.submissions;
}

// ── Enquiries → demo inbox (listings are still seed data) ───────────────────

const DEMO_BASE = "/api/demo-inbox";

async function demoCall<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } }).catch(() => {
    throw new Error("Couldn't reach the server.");
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { message?: string }).message ?? "Something went wrong.");
  return body as T;
}

/** POST an enquiry about a listing or a member's request. */
export function sendEnquiry(input: Omit<NewEnquiry, "kind">): Promise<InboxEnquiry> {
  return demoCall(DEMO_BASE, { method: "POST", body: JSON.stringify({ ...input, kind: "enquiry" }) });
}
