"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { cx } from "@/lib/format";
import { isBlankRichText, normalSpaces, toEditorHtml } from "@/lib/richText";

// The editor needs the browser, so it's loaded there only.
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-xl border border-line bg-ivory" aria-hidden="true" />,
});

const modules = {
  toolbar: [[{ header: [2, 3, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]],
};
/** What gets saved from the editor's HTML: "" when empty, ordinary spaces otherwise. */
const saved = (html: string) => (isBlankRichText(html) ? "" : normalSpaces(html));

const formats = ["header", "bold", "italic", "underline", "list", "link"];

/**
 * A rich text box (headings, bold, lists, links) that saves HTML. Plain text from older listings
 * loads as paragraphs. An empty editor reports "", so required checks keep working.
 */
export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
  invalid = false,
}: {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  // What the editor last produced, exactly as it produced it. We hand that back while it still
  // matches the saved value: giving it our cleaned-up copy instead makes it reload, report a
  // change, get the cleaned copy again, and loop forever (freezing the page).
  const [lastRaw, setLastRaw] = useState("");
  const shown = lastRaw && saved(lastRaw) === value ? lastRaw : toEditorHtml(value);

  return (
    <div className={cx("rich-text-editor", invalid && "rich-text-editor-invalid")}>
      <ReactQuill
        id={id}
        theme="snow"
        value={shown}
        onChange={(html) => {
            setLastRaw(html);
            const next = saved(html);
            if (next !== value) onChange(next);
          }}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
