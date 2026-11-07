"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FiX } from "react-icons/fi";

/** A centred modal: closes on Escape, the ✕ button or a click on the backdrop, and stops the page scrolling behind it. */
export function Dialog({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl outline-none sm:rounded-3xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mt-1 -mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-ivory hover:text-ink">
            <FiX aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
