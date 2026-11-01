"use client";

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
  return (
    <div className={cx("rich-text-editor", invalid && "rich-text-editor-invalid")}>
      <ReactQuill
        id={id}
        theme="snow"
        value={toEditorHtml(value)}
        onChange={(html) => onChange(isBlankRichText(html) ? "" : normalSpaces(html))}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
