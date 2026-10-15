"use client";

import { demoAccounts } from "@/lib/data/demo";

/** Shown under the login form while the site runs on demo data. */
export function DemoLoginHint({ onUse }: { onUse: (email: string, password: string) => void }) {
  return (
    <div className="mt-6 rounded-xl border border-gold/40 bg-gold-soft/40 p-4 text-sm text-ink">
      <p className="font-semibold">Demo mode: no backend connected</p>
      <ul className="mt-2 space-y-1.5">
        {demoAccounts.map((account) => (
          <li key={account.email} className="flex flex-wrap items-center justify-between gap-2 text-muted">
            <span>
              <span className="font-semibold text-ink">{account.role}:</span> {account.email} / {account.password}
            </span>
            <button type="button" onClick={() => onUse(account.email, account.password)} className="font-semibold text-gold-deep underline underline-offset-2">
              Use
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
