"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/**
 * Long listing description, clamped to a few lines with a "Show full description" toggle.
 * `html` must already be cleaned on the server (see cleanRichText).
 */
export function ExpandableDescription({ html, lines = 5 }: { html: string; lines?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  // Only show the toggle when the clamped text is actually cut off.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (!expanded) setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, html]);

  return (
    <div>
      <div
        ref={ref}
        className="rich-text leading-relaxed text-gray-700"
        // About this many lines of text, faded out at the cut.
        style={
          expanded
            ? undefined
            : {
                maxHeight: `${lines * 1.625}rem`,
                overflow: "hidden",
                maskImage: overflows ? "linear-gradient(to bottom, black 70%, transparent)" : undefined,
              }
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {overflows || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep transition hover:text-ink"
        >
          {expanded ? "Show less" : "Show full description"}
          <FiChevronDown aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      ) : null}
    </div>
  );
}
