import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiClock, FiEdit3, FiHome, FiXCircle } from "react-icons/fi";
import { formatNairaShort } from "@/lib/format";
import { dealTypeLabel } from "@/components/listings/labels";
import type { ListingSubmission, SubmissionStatus } from "@/lib/inbox/types";
import { coverOf } from "@/lib/videoWatermark";

const statusStyle: Record<SubmissionStatus, { label: string; className: string; icon: typeof FiClock }> = {
  draft: { label: "Draft", className: "bg-ivory text-ink ring-line", icon: FiEdit3 },
  pending: { label: "Pending review", className: "bg-amber-50 text-amber-800 ring-amber-200", icon: FiClock },
  approved: { label: "Approved", className: "bg-green-50 text-green-800 ring-green-200", icon: FiCheckCircle },
  rejected: { label: "Not approved", className: "bg-red-50 text-red-800 ring-red-200", icon: FiXCircle },
};

/** A member's own listing submissions, with where each one is in review. */
export default function SubmissionList({ submissions }: { submissions: ListingSubmission[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {submissions.map((submission) => {
        const { label, className, icon: Icon } = statusStyle[submission.status];
        const cover = coverOf(submission.listing.images);
        return (
          <li
            key={submission.id}
            className="flex gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-gold/50 hover:shadow-[0_14px_32px_-22px_rgb(14_17_22/0.4)]"
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover ring-1 ring-line" />
            ) : (
              <span className="grid h-20 w-24 shrink-0 place-items-center rounded-xl bg-ivory text-xl text-gold-deep ring-1 ring-line">
                <FiHome aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${className}`}>
                  <Icon aria-hidden="true" /> {label}
                </span>
                <span className="text-xs font-medium text-muted">{dealTypeLabel[submission.listing.dealType]}</span>
              </div>
              <p className="mt-1.5 truncate font-semibold text-ink">{submission.listing.title || "Untitled draft"}</p>
              <p className="mt-0.5 truncate text-sm text-muted">
                {[
                  [submission.listing.area, submission.listing.city].filter(Boolean).join(", "),
                  submission.listing.landValueTbd ? "Land value TBD" : submission.listing.price ? formatNairaShort(submission.listing.price) : "",
                ]
                  .filter(Boolean)
                  .join(" · ") || "Not finished yet"}
              </p>
              <p className="mt-1 truncate font-mono text-[0.6875rem] tracking-wide text-muted/80">Ref {submission.id.toUpperCase()}</p>
              {submission.status === "draft" ? (
                <Link
                  href={`/listings/submit?draft=${submission.id}`}
                  className="group mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:underline"
                >
                  Continue editing <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : null}
              {submission.reviewNote ? (
                <p className="mt-2 rounded-lg border-l-2 border-gold bg-ivory px-3 py-2 text-sm text-ink">{submission.reviewNote}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
