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
        <p className={cx("eyebrow", dark ? "text-gold" : "text-gold-deep")}>{eyebrow}</p>
        <h2 className={cx("mt-3 font-display text-3xl leading-tight sm:text-4xl", dark ? "text-white" : "text-ink")}>{title}</h2>
        {intro ? <p className={cx("mt-4 text-base leading-relaxed", dark ? "text-gray-300" : "text-muted")}>{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}
