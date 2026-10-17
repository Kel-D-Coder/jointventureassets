import type { ListingSubmission } from "@/lib/inbox/types";

export const filled = (value: unknown) => typeof value === "string" && value.trim().length > 0;

/** The minimum the admin needs to review a listing submission: a title, a title document and a way to reach the person. */
export function readyForReview(submission: Partial<Pick<ListingSubmission, "listing" | "contact" | "documents">>): boolean {
  return (
    filled(submission.listing?.title) &&
    filled(submission.contact?.fullName) &&
    filled(submission.contact?.email) &&
    Boolean(submission.documents?.length)
  );
}
