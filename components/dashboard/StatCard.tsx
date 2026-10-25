import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  note?: string;
}

export default function StatCard({ icon, label, value, note }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgb(14_17_22/0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgb(14_17_22/0.35)]">
      {/* A gold hairline along the top, brighter on hover. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-gold/60 to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-lg text-gold shadow-[inset_0_0_0_1px_rgb(201_162_74/0.25)]">{icon}</span>
        <p className="text-sm font-semibold text-muted">{label}</p>
      </div>
      <p className="mt-5 font-display text-5xl leading-none tracking-tight text-ink tabular-nums">{value}</p>
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
    </div>
  );
}
