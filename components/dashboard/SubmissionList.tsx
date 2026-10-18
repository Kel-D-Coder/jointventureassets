import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiClock, FiEdit3, FiXCircle } from "react-icons/fi";
import { formatNairaShort } from "@/lib/format";
import { dealTypeLabel } from "@/components/listings/labels";
import type { ListingSubmission, SubmissionStatus } from "@/lib/inbox/types";

const statusStyle: Record<SubmissionStatus, { label: string; className: string; icon: typeof FiClock }> = {
  draft: { label: "Draft", className: "bg-ivory text-ink", icon: FiEdit3 },
  pending: { label: "Pending review", className: "bg-amber-50 text-amber-800", icon: FiClock },
  approved: { label: "Approved", className: "bg-green-50 text-green-800", icon: FiCheckCircle },
  rejected: { label: "Not approved", className: "bg-red-50 text-red-800", icon: FiXCircle },
};

/** A member's own listing submissions, with where each one is in review. */
export default function SubmissionList({ submissions }: { submissions: ListingSubmission[] }) {
  return (
    <ul className="-my-2 divide-y divide-line">
      {submissions.map((submission) => {
        const { label, className, icon: Icon } = statusStyle[submission.status];
        return (
          <li key={submission.id} className="flex gap-4 py-4">
            {submission.listing.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={submission.listing.images[0]} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
                  <Icon aria-hidden="true" /> {label}
                </span>
                <span className="text-xs text-muted">
                  {dealTypeLabel[submission.listing.dealType]} · Ref {submission.id.toUpperCase()}
                </span>
              </div>
              <p className="mt-2 truncate font-semibold text-ink">{submission.listing.title || "Untitled draft"}</p>
              <p className="truncate text-sm text-muted">
                {[
                  [submission.listing.area, submission.listing.city].filter(Boolean).join(", "),
                  submission.listing.price ? formatNairaShort(submission.listing.price) : "",
                ]
                  .filter(Boolean)
                  .join(" · ") || "Not finished yet"}
              </p>
              {submission.status === "draft" ? (
                <Link href={`/listings/submit?draft=${submission.id}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:underline">
                  Continue editing <FiArrowRight aria-hidden="true" />
                </Link>
              ) : null}
              {submission.reviewNote ? <p className="mt-2 rounded-lg bg-ivory px-3 py-2 text-sm text-ink">{submission.reviewNote}</p> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
