import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** A white card with a gold-accented serif title, matching the members' dashboard sections. */
export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Shown at the right of the title, e.g. a link. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgb(14_17_22/0.04),0_24px_48px_-36px_rgb(14_17_22/0.25)]",
        className,
      )}
    >
      {title ? (
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line/70 px-6 pt-6 pb-5 sm:px-7">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2.5 font-display text-2xl text-ink">
              <span aria-hidden="true" className="h-5 w-1 rounded-full bg-linear-to-b from-gold to-gold-deep" />
              {title}
            </h2>
            {subtitle ? <p className="mt-1.5 pl-3.5 text-sm text-muted">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className="px-6 py-6 sm:px-7">{children}</div>
    </section>
  );
}
