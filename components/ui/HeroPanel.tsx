import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { cx } from "@/lib/format";

/**
 * The panel that opens a page, in the members' dashboard style: a rounded card with a soft
 * gold light and a fine grid. Dark (ink) by default; "light" is an ivory version for quieter pages.
 */
export function HeroPanel({
  eyebrow,
  title,
  intro,
  back,
  meta,
  actions,
  children,
  tone = "dark",
  width = "max-w-7xl",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** A link back to the parent page, shown above the panel. */
  back?: { label: string; href: string };
  /** Small chips under the intro: status, type, dates. */
  meta?: ReactNode;
  /** Buttons on the right (below on phones). */
  actions?: ReactNode;
  /** Anything else under the intro, e.g. stats. */
  children?: ReactNode;
  tone?: "dark" | "light";
  /** Match the page's content width. */
  width?: string;
}) {
  const dark = tone === "dark";
  return (
    <section className="bg-linear-to-b from-ivory to-white">
      <div className={cx("mx-auto px-4 pt-8 pb-2 sm:px-6 lg:px-8", width)}>
        {back ? (
          <Link href={back.href} className="group mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink">
            <FiArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" /> {back.label}
          </Link>
        ) : null}
        <div
          className={cx(
            "relative overflow-hidden rounded-3xl px-6 py-9 sm:px-10 sm:py-11",
            dark ? "bg-ink text-white shadow-[0_24px_60px_-30px_rgb(14_17_22/0.6)]" : "border border-line bg-white text-ink shadow-[0_24px_48px_-36px_rgb(14_17_22/0.3)]",
          )}
        >
          <div aria-hidden="true" className={cx("pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full blur-3xl", dark ? "bg-gold/25" : "bg-gold-soft")} />
          <div aria-hidden="true" className={cx("pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full blur-3xl", dark ? "bg-gold/10" : "bg-ivory")} />
          <div
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute inset-0 [background-size:44px_44px] [mask-image:linear-gradient(to_left,black,transparent_70%)]",
              dark
                ? "opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]"
                : "opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)]",
            )}
          />

          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <div className="min-w-0 max-w-3xl">
              {eyebrow ? <p className={cx("text-xs font-bold tracking-[0.18em] uppercase", dark ? "text-gold" : "text-gold-deep")}>{eyebrow}</p> : null}
              <h1 className={cx("mt-3 font-display text-4xl leading-tight sm:text-5xl", dark ? "text-white" : "text-ink")}>{title}</h1>
              {intro ? <p className={cx("mt-4 max-w-2xl text-[0.9375rem] leading-relaxed sm:text-base", dark ? "text-white/70" : "text-muted")}>{intro}</p> : null}
              {meta ? <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">{meta}</div> : null}
              {children ? <div className="mt-8">{children}</div> : null}
            </div>
            {actions ? <div className="flex w-full flex-wrap gap-3 sm:w-auto">{actions}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** A chip for HeroPanel's `meta`, readable on both tones. */
export function HeroChip({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1", tone === "dark" ? "bg-white/8 text-white/85 ring-white/15" : "bg-ivory text-ink ring-line")}>
      {children}
    </span>
  );
}

/** Button styles for HeroPanel's `actions`. */
export const heroButton = {
  primary:
    "inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink shadow-[0_8px_24px_-8px_rgb(201_162_74/0.7)] transition hover:-translate-y-0.5 hover:bg-gold-soft sm:flex-none",
  secondary:
    "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/8 hover:ring-white/50 sm:flex-none",
};
