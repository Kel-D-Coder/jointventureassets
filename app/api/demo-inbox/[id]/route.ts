/**
 * GET    /api/demo-inbox/{id}
 * PATCH  /api/demo-inbox/{id}   fields allowed depend on the kind of item (see EDITABLE)
 * DELETE /api/demo-inbox/{id}
 */
import { getItem, removeItem, toPublic, updateItem } from "@/lib/inbox/store";
import { readyForReview } from "@/lib/inbox/rules";
import type { InboxItem } from "@/lib/inbox/types";
import { json, preflight } from "../cors";

type Context = { params: Promise<{ id: string }> };

/** What can change after an item is created. */
const EDITABLE: Record<string, readonly string[]> = {
  enquiry: ["status"],
  "listing-submission": ["status", "reviewNote", "listingId"],
  /** While a listing submission is a draft, its owner can still change the content. */
  "listing-draft": ["status", "reviewNote", "listingId", "listing", "contact", "documents", "isOwner"],
  /** The admin sets status; the member edits their own details and documents. */
  account: ["status", "fullName", "phoneNumber", "category", "profile", "documents", "profileCompleted"],
};

export function OPTIONS() {
  return preflight();
}

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  const item = await getItem(id);
  return item ? json(toPublic(item)) : json({ message: "That item no longer exists." }, 404);
}

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const current = await getItem(id);
  if (!current) return json({ message: "That item no longer exists." }, 404);

  const body = ((await request.json().catch(() => ({}))) ?? {}) as Record<string, unknown>;
  const isDraft = current.kind === "listing-submission" && current.status === "draft";
  const allowed = EDITABLE[isDraft ? "listing-draft" : current.kind] ?? [];
  const patch = Object.fromEntries(allowed.filter((key) => key in body).map((key) => [key, body[key]])) as Partial<InboxItem>;

  // Sending a draft for review needs the same basics as a new submission.
  if (isDraft && patch.status === "pending" && !readyForReview({ ...current, ...patch } as Parameters<typeof readyForReview>[0])) {
    return json({ message: "Please give the property a title, add a title document and your contact details." }, 400);
  }
  // An investor's profile isn't complete without a company profile document.
  if (current.kind === "account" && current.role === "Investor" && "documents" in patch) {
    const documents = (patch as { documents?: { companyProfile?: unknown } }).documents;
    if (!documents?.companyProfile) return json({ message: "Investors need to upload a company profile." }, 400);
  }

  const updated = await updateItem(id, patch);
  return updated ? json(toPublic(updated)) : json({ message: "That item no longer exists." }, 404);
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  return (await removeItem(id)) ? json({ message: "Deleted." }) : json({ message: "That item no longer exists." }, 404);
}
