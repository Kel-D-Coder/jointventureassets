import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { StatusBadge, formatBudget, requestTypeLabel } from "@/components/requests/StatusBadge";
import type { PartnerRequest } from "@/types";

const dateFormat = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

export default function RequestList({ requests }: { requests: PartnerRequest[] }) {
  return (
    <ul className="-my-2 divide-y divide-line">
      {requests.map((request) => (
        <li key={request._id}>
          <Link href={`/requests/${request._id}`} className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-4 hover:bg-ivory">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={request.status} />
                <span className="text-xs text-muted">
                  {requestTypeLabel[request.requestType]} · {dateFormat.format(new Date(request.createdAt))}
                </span>
              </div>
              <p className="mt-2 truncate font-semibold text-ink">{request.title || "Untitled request"}</p>
              <p className="truncate text-sm text-muted">
                {[request.location, formatBudget(request.budget)].filter((part) => part && part !== "Not specified").join(" · ")}
              </p>
            </div>
            <FiChevronRight aria-hidden="true" className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
