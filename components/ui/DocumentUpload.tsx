"use client";

import { useRef, useState } from "react";
import { FiExternalLink, FiFileText, FiUploadCloud, FiX } from "react-icons/fi";
import { MAX_DOCUMENT_MB, fileSize, openDocument, toDocument } from "@/lib/files";
import { cx } from "@/lib/format";
import type { SubmittedDocument } from "@/lib/inbox/types";

/** One labelled document slot: upload, view, replace or remove a single PDF or image. */
export function DocumentUpload({
  id,
  label,
  description,
  required,
  value,
  onChange,
  error,
  imagesOnly = false,
}: {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  value?: SubmittedDocument;
  onChange: (doc: SubmittedDocument | undefined) => void;
  error?: string;
  /** Accept only PNG or JPG, e.g. a letterhead that gets printed on a document. */
  imagesOnly?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState("");
  const [reading, setReading] = useState(false);

  const choose = async (file?: File) => {
    if (!file) return;
    setProblem("");
    if (imagesOnly && !(file.type === "image/png" || file.type === "image/jpeg")) {
      setProblem(`${file.name} isn't a PNG or JPG image.`);
      if (input.current) input.current.value = "";
      return;
    }
    setReading(true);
    try {
      onChange(await toDocument(file));
    } catch (caught) {
      setProblem((caught as Error).message);
    } finally {
      setReading(false);
      if (input.current) input.current.value = "";
    }
  };

  const message = problem || error;

  return (
    <div className="sm:col-span-2">
      <p id={`${id}-label`} className="mb-1.5 text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ml-0.5 text-gold-deep" aria-hidden="true">*</span> : <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </p>
      <div className={cx("flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4", message ? "border-red-300" : "border-line")}>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-deep">
          {value ? <FiFileText aria-hidden="true" /> : <FiUploadCloud aria-hidden="true" />}
        </span>
        <div className="min-w-0 flex-1">
          {value ? (
            <>
              <p className="truncate text-sm font-semibold text-ink">{value.name}</p>
              <p className="text-xs text-muted">
                {value.type === "application/pdf" ? "PDF" : "Image"} · {fileSize(value.size)}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-ink">{description}</p>
              <p className="text-xs text-muted">{imagesOnly ? "PNG or JPG" : "PDF, JPG or PNG"}, up to {MAX_DOCUMENT_MB} MB</p>
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {value ? (
            <button type="button" onClick={() => void openDocument(value)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gold-deep hover:bg-ivory">
              <FiExternalLink aria-hidden="true" /> View
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={reading}
            aria-describedby={`${id}-label`}
            className="rounded-lg border border-line px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink disabled:opacity-50"
          >
            {reading ? "Reading…" : value ? "Replace" : "Upload"}
          </button>
          {value && !required ? (
            <button type="button" onClick={() => onChange(undefined)} aria-label={`Remove ${label}`} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700">
              <FiX aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <input id={id} ref={input} type="file" accept={imagesOnly ? "image/png,image/jpeg" : "application/pdf,image/*"} hidden onChange={(event) => choose(event.target.files?.[0])} />
      </div>
      {message ? <p className="mt-1.5 text-xs font-medium text-red-700">{message}</p> : null}
    </div>
  );
}
