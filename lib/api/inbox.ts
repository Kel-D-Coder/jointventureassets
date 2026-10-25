import { API_TIMEOUT_MS, fetchFailure, reportUnauthorized } from "@/lib/api/session";
import { uploadFile } from "@/lib/api/auth";
import type { ListingSubmission, NewEnquiry, SubmittedDocument } from "@/lib/inbox/types";
import { joinMedia, splitMedia } from "@/lib/videoWatermark";

// ── Listing submissions → real FastAPI backend ──────────────────────────────

const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

async function call<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  }).catch((caught: unknown) => {
    throw fetchFailure(caught);
  });
  reportUnauthorized(response, Boolean(token));
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
    videos?: string[];
    jv?: { sharingFormula: string; sharingNegotiable?: boolean; premium?: number; proposal: string; duration: string };
    saleTerms?: { acceptedFeeTerms: true; feeRate: number };
    ownerName: string;
  };
};

/**
 * Converts a base64 data URL to a File and uploads it to Supabase Storage.
 * If the URL is already a public https:// URL, returns it unchanged.
 */
async function uploadDataUrl(dataUrl: string, filename: string, token: string): Promise<string> {
  // data: URLs are photos and documents from the form; blob: URLs are prepared videos (see videoWatermark.ts).
  if (!dataUrl.startsWith("data:") && !dataUrl.startsWith("blob:")) return dataUrl;
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext = blob.type.split(";")[0]!.split("/")[1] || "jpg";
  const name = filename.includes(".") ? filename : `${filename}.${ext}`;
  return uploadFile(new File([blob], name, { type: blob.type }), token);
}

/**
 * Uploads any new photos, video and documents in the input to Supabase Storage,
 * replacing them with public URLs before sending to the backend. Photos go in
 * `images` and the video in `videos`.
 */
async function prepareInput(input: SubmissionInput, token: string): Promise<SubmissionInput> {
  const media = splitMedia(joinMedia(input.listing.images, input.listing.videos));
  const uploadedImages = await Promise.all(media.images.map((url, i) => uploadDataUrl(url, `photo-${i}`, token)));
  const uploadedVideos = await Promise.all(media.videos.map((url) => uploadDataUrl(url, "video", token)));
  const uploadedDocuments = await Promise.all(
    input.documents.map(async (doc) => ({
      ...doc,
      url: await uploadDataUrl(doc.url, doc.name, token),
    })),
  );
  return {
    ...input,
    documents: uploadedDocuments,
    listing: { ...input.listing, images: uploadedImages, videos: uploadedVideos },
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

/**
 * Sends an enquiry about a listing or a member's request. The server has no
 * enquiries endpoint yet, so it goes through POST /contact with the details
 * attached; the JVA team receives it with the other contact messages.
 * TODO(backend): switch to a dedicated enquiries endpoint when there is one.
 */
export async function sendEnquiry(input: Omit<NewEnquiry, "kind">, token?: string | null): Promise<void> {
  let letterheadUrl: string | undefined;
  if (input.jv?.letterhead) {
    if (!token) throw new Error("Please log in to upload your letterhead, so we can prepare your LOI on it.");
    letterheadUrl = await uploadDataUrl(input.jv.letterhead.url, input.jv.letterhead.name, token);
  }
  const about = `${input.target.type === "listing" ? "Listing" : "Request"}: ${input.target.title} (${input.target.id})`;
  const jvLines = input.jv
    ? [
        `Wants JVA to prepare their LOI: ${input.jv.generateLoi ? "Yes" : "No"}`,
        letterheadUrl ? `Letterhead: ${letterheadUrl}` : "",
        "Accepted the facilitation fee terms (10% of land value, non-negotiable): Yes",
      ].filter(Boolean)
    : [];
  const saleLines = input.sale
    ? [
        `Accepted the facilitation fee terms (${input.sale.feeRate * 100}% of the agreed price, paid on top of the price): Yes`,
        `Asking price: ₦${input.sale.askingPrice.toLocaleString("en-NG")}`,
      ]
    : [];
  await call(
    "/contact",
    {
      method: "POST",
      body: JSON.stringify({
        fullName: input.fullName,
        emailAddress: input.email,
        phoneNumber: input.phoneNumber,
        consultationType: input.target.type === "listing" ? "Listing enquiry" : "Request enquiry",
        subject: `Enquiry: ${input.target.title}`,
        message: [input.message, "", about, ...jvLines, ...saleLines].join("\n"),
        enquiry: { target: input.target, sale: input.sale, jv: input.jv ? { ...input.jv, letterhead: letterheadUrl ? { ...input.jv.letterhead, url: letterheadUrl } : undefined } : undefined },
      }),
    },
    token ?? undefined,
  );
}
