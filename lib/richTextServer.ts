import sanitizeHtml from "sanitize-html";
import { toEditorHtml } from "@/lib/richText";

/** The formatting the description editor can produce; everything else is removed. */
const allowed: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "h2", "h3", "ul", "ol", "li", "a", "blockquote"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Links open in a new tab and can't reach back into the page.
  transformTags: { a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer nofollow" }) },
};

/** A description as safe HTML to show on the page (plain-text descriptions become paragraphs). */
export const cleanRichText = (text: string) => sanitizeHtml(toEditorHtml(text), allowed);

/** A description as one line of plain text, e.g. for search engines. */
export function richTextToPlain(text: string): string {
  const spaced = toEditorHtml(text).replace(/<\/(p|h2|h3|li|blockquote)>|<br\s*\/?>/gi, " ");
  return sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
