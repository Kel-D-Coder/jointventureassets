import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowRight } from "react-icons/fi";

interface SectionCardProps {
  title: string;
  /** A short line under the title saying what the section is for. */
  subtitle?: string;
  action?: { label: string; href: string };
  children: ReactNode;
}

export default function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgb(14_17_22/0.04),0_24px_48px_-36px_rgb(14_17_22/0.25)]">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 pt-6 pb-5 sm:px-7">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2.5 font-display text-2xl text-ink">
            <span aria-hidden="true" className="h-5 w-1 rounded-full bg-linear-to-b from-gold to-gold-deep" />
            {title}
          </h2>
          {subtitle ? <p className="mt-1.5 pl-3.5 text-sm text-muted">{subtitle}</p> : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="group inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-gold hover:bg-gold-soft/40"
          >
            {action.label}
            <FiArrowRight aria-hidden="true" className="text-gold-deep transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
      <div className="border-t border-line/70 px-6 py-6 sm:px-7">{children}</div>
    </section>
  );
}
