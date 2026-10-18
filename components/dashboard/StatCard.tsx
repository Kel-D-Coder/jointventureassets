import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  note?: string;
}

export default function StatCard({ icon, label, value, note }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow text-muted">{label}</p>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-soft text-gold-deep">{icon}</span>
      </div>
      <p className="mt-3 font-display text-4xl leading-none text-ink">{value}</p>
      {note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
    </div>
  );
}
