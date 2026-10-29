"use client";

import type { PaymentPlanDraft } from "@/components/listings/labels";
import { Field, MoneyInput, inputClass } from "@/components/ui/form";

/** An estate's payment plan: initial deposit, interest-free months, longest plan, notes. All optional. */
export function PaymentPlanFields({ value, onChange }: { value: PaymentPlanDraft; onChange: (next: PaymentPlanDraft) => void }) {
  const set = <K extends keyof PaymentPlanDraft>(key: K, next: PaymentPlanDraft[K]) => onChange({ ...value, [key]: next });
  return (
    <fieldset className="mt-6 rounded-2xl border border-line bg-white p-4 sm:p-5">
      <legend className="px-1 text-sm font-semibold text-ink">Payment plan (optional)</legend>
      <p className="mb-4 text-xs text-muted">If buyers can pay in installments, tell them how.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Initial deposit (₦)" htmlFor="planDeposit">
          <MoneyInput id="planDeposit" value={value.initialDeposit} onChange={(digits) => set("initialDeposit", digits)} placeholder="e.g. 20,000,000" />
        </Field>
        <Field label="Interest-free (months)" htmlFor="planInterestFree">
          <MoneyInput id="planInterestFree" value={value.interestFreeMonths} onChange={(digits) => set("interestFreeMonths", digits)} placeholder="e.g. 12" />
        </Field>
        <Field label="Longest plan (months)" htmlFor="planMaxMonths">
          <MoneyInput id="planMaxMonths" value={value.maxMonths} onChange={(digits) => set("maxMonths", digits)} placeholder="e.g. 18" />
        </Field>
        <Field label="Notes" htmlFor="planNotes" className="sm:col-span-3">
          <input id="planNotes" value={value.notes} onChange={(e) => set("notes", e.target.value)} placeholder="e.g. Installments are paid monthly" className={inputClass} />
        </Field>
      </div>
    </fieldset>
  );
}
