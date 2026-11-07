import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { cx } from "@/lib/format";
import type { RequestStatus } from "@/types";

const statusStyles: Record<RequestStatus, { label: string; className: string; icon: typeof FiClock }> = {
  pending: { label: "Under review", className: "bg-amber-50 text-amber-800", icon: FiClock },
  accepted: { label: "Accepted", className: "bg-green-50 text-green-800", icon: FiCheckCircle },
  rejected: { label: "Not accepted", className: "bg-red-50 text-red-800", icon: FiXCircle },
};

/** Status always shown with an icon and a word, never colour alone. */
export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  const { label, className: tone, icon: Icon } = statusStyles[status] ?? statusStyles.pending;
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", tone, className)}>
      <Icon aria-hidden="true" /> {label}
    </span>
  );
}

export { requestTypeHint, requestTypeLabel } from "@/lib/requests";

/** "1450000000" or "₦1,450,000,000" -> "₦1.45bn"; free text is shown as typed. */
export function formatBudget(budget: string): string {
  const amount = Number(budget.replace(/[^\d.]/g, ""));
  if (!amount) return budget || "Not specified";
  if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")}bn`;
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}m`;
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** "residential", "property_consultant" -> "Residential", "Property consultant" */
export function humanise(value?: string): string {
  if (!value) return "";
  const text = value.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
