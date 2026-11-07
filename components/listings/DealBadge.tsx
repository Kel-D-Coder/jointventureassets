import { cx } from "@/lib/format";
import { dealTypeLabel } from "@/components/listings/labels";
import type { DealType } from "@/types";

/** Gold for joint ventures, ink for sales — the same pairing the admin dashboard uses. */
export function DealBadge({ dealType, className }: { dealType: DealType; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        dealType === "jv" ? "bg-gold text-ink" : "bg-ink text-white",
        className,
      )}
    >
      {dealTypeLabel[dealType]}
    </span>
  );
}
