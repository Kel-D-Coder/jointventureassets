import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** Eyebrow + serif heading + intro, used to open every homepage section. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-6 self-start", align === "center" && "flex-col items-center text-center")}>
      <div className={cx("max-w-2xl", align === "center" && "mx-auto")}>
        <p className={cx("inline-flex items-center gap-3 text-xs font-bold tracking-[0.18em] uppercase", dark ? "text-gold" : "text-gold-deep")}>
          <span aria-hidden="true" className="h-px w-8 bg-linear-to-r from-gold to-gold/30" />
          {eyebrow}
        </p>
        <h2 className={cx("mt-4 font-display text-3xl leading-tight sm:text-[2.6rem]", dark ? "text-white" : "text-ink")}>{title}</h2>
        {intro ? <p className={cx("mt-4 text-base leading-relaxed", dark ? "text-white/65" : "text-muted")}>{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** The outlined pill used for "View all" style links next to a SectionHeading. */
export const sectionAction =
  "group inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-gold hover:bg-gold-soft/40";
