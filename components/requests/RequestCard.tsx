import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { formatBudget, humanise, requestTypeLabel } from "@/components/requests/StatusBadge";
import { RequestEnquiryButton } from "@/components/requests/RequestEnquiryButton";
import type { PartnerRequest } from "@/types";

const dateFormat = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

/** A member's request as other members see it on Browse Requests. */
export function RequestCard({ request, canEnquire = true }: { request: PartnerRequest; canEnquire?: boolean }) {
  const subtype = humanise(request.developmentType || request.partnershipType || (request.propertyWanted ? `Wants: ${request.propertyWanted}` : ""));
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition hover:shadow-[0_18px_40px_-24px_rgb(14_17_22/0.35)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className={request.requestType === "land" || request.requestType === "purchase" ? "rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-ink" : "rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white"}>
          {requestTypeLabel[request.requestType]}
        </span>
        {subtype ? <span className="rounded-full bg-ivory px-2.5 py-1 text-xs font-semibold text-muted">{subtype}</span> : null}
        {request.sharingFormula ? (
          <span className="rounded-full bg-ivory px-2.5 py-1 text-xs font-semibold text-muted">
            {request.sharingFormula.replace("_", "/")} sharing
            {request.sharingNegotiable !== undefined ? `, ${request.sharingNegotiable ? "negotiable" : "fixed"}` : ""}
          </span>
        ) : null}
        {request.premium ? <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-deep">{formatBudget(String(request.premium))} premium</span> : null}
      </div>

      <h3 className="mt-4 font-display text-xl leading-snug text-ink">{request.title || "Untitled request"}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{request.description}</p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-xs text-muted">
        <div className="col-span-2 flex items-center gap-1.5">
          <FiMapPin aria-hidden="true" className="shrink-0" />
          <dt className="sr-only">Location</dt>
          <dd className="truncate">{request.location || "Not specified"}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <FiClock aria-hidden="true" className="shrink-0" />
          <dt className="sr-only">Timeline</dt>
          <dd>{request.timeline || "Not specified"}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <FiCalendar aria-hidden="true" className="shrink-0" />
          <dt className="sr-only">Posted</dt>
          <dd>{dateFormat.format(new Date(request.createdAt))}</dd>
        </div>
        <div className="col-span-2 flex items-center gap-1.5">
          <FiUser aria-hidden="true" className="shrink-0" />
          <dt className="sr-only">Posted by</dt>
          <dd className="truncate">{request.fullName}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[0.6875rem] font-bold tracking-wider text-muted uppercase">{request.requestType === "land" ? "Value" : "Budget"}</p>
          <p className="text-lg font-extrabold text-ink">{formatBudget(request.budget)}</p>
        </div>
        {canEnquire ? <RequestEnquiryButton request={request} /> : <span className="text-xs font-semibold text-muted">Your request</span>}
      </div>
    </article>
  );
}
