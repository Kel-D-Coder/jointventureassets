import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowRight } from "react-icons/fi";

interface SectionCardProps {
  title: string;
  action?: { label: string; href: string };
  children: ReactNode;
}

export default function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {action ? (
          <Link href={action.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:underline">
            {action.label} <FiArrowRight aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}
