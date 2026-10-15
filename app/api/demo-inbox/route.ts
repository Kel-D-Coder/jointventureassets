/**
 * Demo inbox: enquiries and listing submissions made on the website, read and
 * updated by the admin dashboard. Replace with the real API when it's back.
 *
 * GET    /api/demo-inbox?kind=enquiry|listing-submission|account&email=…
 * POST   /api/demo-inbox            { kind: "enquiry" | "listing-submission", … }
 * DELETE /api/demo-inbox            puts the demo data back to the seed
 */
import { addItem, listItems, resetInbox, toPublic } from "@/lib/inbox/store";
import { filled, readyForReview } from "@/lib/inbox/rules";
import type { InboxItem, NewEnquiry, NewListingSubmission } from "@/lib/inbox/types";
import { json, preflight } from "./cors";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return preflight();
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind");
  const email = params.get("email")?.trim().toLowerCase();
  const items = (await listItems()).filter(
    (item) =>
      (!kind || item.kind === kind) &&
      (!email || (item.kind === "listing-submission" ? item.contact.email : item.email).toLowerCase() === email),
  );
  return json(items.map(toPublic));
}

const id = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as (NewEnquiry | NewListingSubmission) | null;
  const now = new Date().toISOString();

  if (body?.kind === "enquiry") {
    if (!filled(body.target?.id) || !filled(body.fullName) || !filled(body.email) || !filled(body.message)) {
      return json({ message: "Please fill in your name, email and message." }, 400);
    }
    if (body.jv && body.jv.acceptedFeeTerms !== true) {
      return json({ message: "Please accept the facilitation fee terms to send your enquiry." }, 400);
    }
    if (body.jv?.generateLoi && !body.jv.companyProfile) {
      return json({ message: "Please upload your company profile so we can prepare your LOI." }, 400);
    }
    const item: InboxItem = { ...body, id: id("enq"), status: "new", createdAt: now };
    return json(await addItem(item), 201);
  }

  if (body?.kind === "listing-submission") {
    const { draft, ...submission } = body;
    // A draft only needs an email, so its owner can find it again; a submission needs the basics.
    if (draft ? !filled(submission.contact?.email) : !readyForReview(submission)) {
      return json({ message: draft ? "Add your email so you can come back to this draft." : "Please give the property a title, add a title document and your contact details." }, 400);
    }
    const item: InboxItem = { ...submission, id: id("sub"), status: draft ? "draft" : "pending", createdAt: now, updatedAt: now };
    return json(await addItem(item), 201);
  }

  return json({ message: "Unknown request." }, 400);
}

export async function DELETE() {
  await resetInbox();
  return json({ message: "Demo inbox reset." });
}
