import Link from "next/link";
import { FiArrowRight, FiFileText } from "react-icons/fi";
import { StatusBadge, formatBudget, requestTypeLabel } from "@/components/requests/StatusBadge";
import type { PartnerRequest } from "@/types";

const dateFormat = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

const given = (value?: string) => Boolean(value && value !== "Not specified");

export default function RequestList({ requests }: { requests: PartnerRequest[] }) {
  return (
    <ul className="space-y-3">
      {requests.map((request) => {
        const budget = formatBudget(request.budget);
        return (
          <li key={request._id}>
            <Link
              href={`/requests/${request._id}`}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_14px_32px_-22px_rgb(14_17_22/0.4)]"
            >
              <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-ivory text-gold-deep ring-1 ring-line sm:grid">
                <FiFileText aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={request.status} />
                  <span className="text-xs font-medium text-muted">
                    {requestTypeLabel[request.requestType]} · {dateFormat.format(new Date(request.createdAt))}
                  </span>
                </div>
                <p className="mt-1.5 truncate font-semibold text-ink">{request.title || "Untitled request"}</p>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {given(request.location) ? request.location : null}
                  {given(request.location) && given(budget) ? " · " : null}
                  {given(budget) ? <span className="font-semibold text-ink/80">{budget}</span> : null}
                </p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition group-hover:border-ink group-hover:bg-ink group-hover:text-gold">
                <FiArrowRight aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
