import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowRight } from "react-icons/fi";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gold/40 bg-linear-to-b from-ivory/80 to-white px-6 py-12 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-gold shadow-[0_12px_28px_-12px_rgb(14_17_22/0.6)] ring-1 ring-gold/30">
        {icon}
      </span>
      <h3 className="mt-5 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {action ? (
        <Link
          href={action.href}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink-soft"
        >
          {action.label}
          <FiArrowRight aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
