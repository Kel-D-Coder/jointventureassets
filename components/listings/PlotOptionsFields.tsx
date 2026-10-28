"use client";

import { FiPlus, FiX } from "react-icons/fi";
import { emptyPlotRow, priceNegotiableLabel, priceNegotiableOptions, type PlotRow } from "@/components/listings/labels";
import { MoneyInput, inputClass } from "@/components/ui/form";
import { cx } from "@/lib/format";
import type { PriceNegotiable } from "@/types";

/**
 * An estate's plot sizes, one row each: size, price, how negotiable, and an optional initial
 * deposit. Rows can be added and removed; at least one row always stays.
 */
export function PlotOptionsFields({ rows, onChange, error }: { rows: PlotRow[]; onChange: (rows: PlotRow[]) => void; error?: string }) {
  const update = (index: number, changes: Partial<PlotRow>) => onChange(rows.map((row, i) => (i === index ? { ...row, ...changes } : row)));
  const remove = (index: number) => onChange(rows.length > 1 ? rows.filter((_, i) => i !== index) : [emptyPlotRow()]);

  return (
    <div>
      <div className="hidden grid-cols-[1fr_1.3fr_1.3fr_1.2fr_2.5rem] gap-3 px-1 pb-2 text-sm font-semibold text-ink md:grid">
        <span>Plot size (sqm)</span>
        <span>Price (₦)</span>
        <span>Negotiable?</span>
        <span>Initial deposit (₦)</span>
        <span className="sr-only">Remove</span>
      </div>
      <ul className="space-y-3">
        {rows.map((row, index) => (
          <li
            key={index}
            className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-[1fr_1.3fr_1.3fr_1.2fr_2.5rem] md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0"
          >
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink md:sr-only">Plot size (sqm)</span>
              <MoneyInput value={row.sizeSqm} onChange={(digits) => update(index, { sizeSqm: digits })} placeholder="e.g. 500" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink md:sr-only">Price (₦)</span>
              <MoneyInput value={row.price} onChange={(digits) => update(index, { price: digits })} placeholder="e.g. 30,000,000" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink md:sr-only">Negotiable?</span>
              <select
                value={row.priceNegotiable}
                onChange={(e) => update(index, { priceNegotiable: e.target.value as "" | PriceNegotiable })}
                className={cx(inputClass, "pr-10", !row.priceNegotiable && "text-gray-400")}
              >
                <option value="">Choose…</option>
                {priceNegotiableOptions.map((option) => (
                  <option key={option} value={option}>
                    {priceNegotiableLabel[option]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink md:sr-only">Initial deposit (₦), optional</span>
              <MoneyInput value={row.deposit} onChange={(digits) => update(index, { deposit: digits })} placeholder="Optional" />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Remove plot size ${index + 1}`}
              className="grid h-10 w-10 place-items-center justify-self-end rounded-full text-muted transition hover:bg-red-50 hover:text-red-700"
            >
              <FiX aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...rows, emptyPlotRow()])}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-gold/50 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-gold hover:bg-gold-soft/40"
      >
        <FiPlus aria-hidden="true" /> Add a plot size
      </button>
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-700">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-muted">Buyers see every size with its price; the cheapest shows as &ldquo;From ₦…&rdquo;.</p>
      )}
    </div>
  );
}
