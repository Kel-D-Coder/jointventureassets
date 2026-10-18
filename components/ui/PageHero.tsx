import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** The banner that opens an inner page: eyebrow, serif title, intro. Ivory by default, ink for emphasis. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Extra content under the intro (buttons, stats). */
  children?: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <section className={cx("border-b", dark ? "border-white/10 bg-ink" : "border-line bg-ivory")}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <p className={cx("eyebrow", dark ? "text-gold" : "text-gold-deep")}>{eyebrow}</p>
        <h1 className={cx("mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl", dark ? "text-white" : "text-ink")}>{title}</h1>
        {intro ? <p className={cx("mt-4 max-w-2xl text-base leading-relaxed sm:text-lg", dark ? "text-gray-300" : "text-muted")}>{intro}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
