"use client";

import { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { Dialog } from "@/components/ui/Dialog";
import { EnquiryForm } from "@/components/enquiries/EnquiryForm";
import { requestTypeLabel } from "@/components/requests/StatusBadge";
import type { PartnerRequest } from "@/types";

/** "Enquire" on a member's request: opens the enquiry form in a dialog. */
export function RequestEnquiryButton({ request }: { request: PartnerRequest }) {
  const [open, setOpen] = useState(false);
  const title = request.title || "Untitled request";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-ink"
      >
        <FiMessageSquare aria-hidden="true" /> Enquire
      </button>
      <Dialog title={`Enquire about "${title}"`} open={open} onClose={() => setOpen(false)}>
        <EnquiryForm
          target={{
            type: "request",
            id: request._id,
            title,
            subtitle: `${requestTypeLabel[request.requestType]}${request.location ? ` · ${request.location}` : ""}`,
          }}
          eyebrow="Request enquiry"
          defaultMessage={`I'm interested in "${title}". Please introduce me to the member who posted it.`}
          submitLabel="Send enquiry"
        />
      </Dialog>
    </>
  );
}
