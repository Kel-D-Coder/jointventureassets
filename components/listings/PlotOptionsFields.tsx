"use client";

import { FiPlus, FiX } from "react-icons/fi";
import { emptyPlotRow, priceNegotiableLabel, priceNegotiableOptions, type EstateKind, type PlotRow } from "@/components/listings/labels";
import { MoneyInput, inputClass } from "@/components/ui/form";
import { cx } from "@/lib/format";
import type { PriceNegotiable } from "@/types";

/**
 * An estate's options, one row each. Plots: size, price, how negotiable, optional initial deposit.
 * Houses / apartments: unit type, price, how negotiable, optional size and initial deposit.
 * Rows can be added and removed; at least one row always stays.
 */
export function PlotOptionsFields({
  rows,
  onChange,
  error,
  kind = "plots",
}: {
  rows: PlotRow[];
  onChange: (rows: PlotRow[]) => void;
  error?: string;
  kind?: EstateKind;
}) {
  const units = kind === "units";
  const columns = units ? "md:grid-cols-[1.6fr_1.2fr_1.2fr_0.8fr_1fr_2.5rem]" : "md:grid-cols-[1fr_1.3fr_1.3fr_1.2fr_2.5rem]";
  const sizeField = (row: PlotRow, index: number) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink md:sr-only">{units ? "Size (sqm), optional" : "Plot size (sqm)"}</span>
      <MoneyInput value={row.sizeSqm} onChange={(digits) => update(index, { sizeSqm: digits })} placeholder={units ? "Optional" : "e.g. 500"} />
    </label>
  );
  const update = (index: number, changes: Partial<PlotRow>) => onChange(rows.map((row, i) => (i === index ? { ...row, ...changes } : row)));
  const remove = (index: number) => onChange(rows.length > 1 ? rows.filter((_, i) => i !== index) : [emptyPlotRow()]);

  return (
    <div>
      <div className={cx("hidden gap-3 px-1 pb-2 text-sm font-semibold text-ink md:grid", columns)}>
        {units ? <span>Unit type</span> : <span>Plot size (sqm)</span>}
        <span>Price (₦)</span>
        <span>Negotiable?</span>
        {units ? <span>Size (sqm)</span> : null}
        <span>Initial deposit (₦)</span>
        <span className="sr-only">Remove</span>
      </div>
      <ul className="space-y-3">
        {rows.map((row, index) => (
          <li
            key={index}
            className={cx("grid gap-3 rounded-2xl border border-line bg-white p-4 md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0", columns)}
          >
            {units ? (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-ink md:sr-only">Unit type</span>
                <input value={row.label} onChange={(e) => update(index, { label: e.target.value })} placeholder="e.g. 2 Bedroom Apartment + BQ" className={inputClass} />
              </label>
            ) : (
              sizeField(row, index)
            )}
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
            {units ? sizeField(row, index) : null}
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink md:sr-only">Initial deposit (₦), optional</span>
              <MoneyInput value={row.deposit} onChange={(digits) => update(index, { deposit: digits })} placeholder="Optional" />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={units ? `Remove unit type ${index + 1}` : `Remove plot size ${index + 1}`}
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
        <FiPlus aria-hidden="true" /> {units ? "Add a unit type" : "Add a plot size"}
      </button>
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-700">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-muted">Buyers see every {units ? "unit type" : "size"} with its price; the cheapest shows as &ldquo;From ₦…&rdquo;.</p>
      )}
    </div>
  );
}
