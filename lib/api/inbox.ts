import { ApiError, wait } from "@/lib/api/mock";
import type { InboxEnquiry, ListingSubmission, NewEnquiry, NewListingSubmission } from "@/lib/inbox/types";

const BASE = "/api/demo-inbox";

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  await wait(250, 300);
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } }).catch(() => {
    throw new ApiError("Couldn't reach the server. Check your connection and try again.");
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError((body as { message?: string }).message ?? "Something went wrong. Please try again.");
  return body as T;
}

/** POST an enquiry about a listing or a member's request. Shows up in the dashboard's Enquiries. */
export function sendEnquiry(input: Omit<NewEnquiry, "kind">): Promise<InboxEnquiry> {
  return call(BASE, { method: "POST", body: JSON.stringify({ ...input, kind: "enquiry" }) });
}

export type SubmissionInput = Omit<NewListingSubmission, "kind" | "draft">;

/**
 * Saves a property listing. With `draft`, it's kept for the person to finish
 * later and the admin doesn't see it; otherwise it goes to the dashboard's
 * Listing requests as pending. Pass `id` to update an existing draft.
 */
export function saveSubmission(input: SubmissionInput, { id, draft }: { id?: string; draft: boolean }): Promise<ListingSubmission> {
  if (id) {
    return call(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(draft ? input : { ...input, status: "pending" }),
    });
  }
  return call(BASE, { method: "POST", body: JSON.stringify({ ...input, kind: "listing-submission", draft }) });
}

/** One submission, e.g. a draft being reopened. */
export function getSubmission(id: string): Promise<ListingSubmission> {
  return call(`${BASE}/${encodeURIComponent(id)}`);
}

/** Deletes a draft the person no longer wants. */
export function deleteSubmission(id: string): Promise<unknown> {
  return call(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** The listing submissions made with this email, newest first, with their review status. */
export function getMySubmissions(email: string): Promise<ListingSubmission[]> {
  return call(`${BASE}?kind=listing-submission&email=${encodeURIComponent(email)}`);
}
