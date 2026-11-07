"use client";

import { FiCheck } from "react-icons/fi";
import { splitTitles, titleDocuments, toggleTitle } from "@/components/listings/labels";
import { cx } from "@/lib/format";

/** Tick every title document the property has; they're saved comma-separated. */
export function TitleDocumentPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const chosen = splitTitles(value);
  return (
    <div role="group" aria-label="Title documents" className="flex flex-wrap gap-2">
      {titleDocuments.map((title) => {
        const on = chosen.includes(title);
        return (
          <button
            key={title}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(toggleTitle(value, title))}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
              on ? "border-gold bg-gold-soft/60 text-ink" : "border-line bg-white text-muted hover:border-ink hover:text-ink",
            )}
          >
            {on ? <FiCheck aria-hidden="true" className="h-3.5 w-3.5 text-gold-deep" /> : null}
            {title}
          </button>
        );
      })}
    </div>
  );
}
