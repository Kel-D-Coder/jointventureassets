"use client";

import { DocumentUpload } from "@/components/ui/DocumentUpload";
import { uploadFile } from "@/lib/api/auth";
import type { ProfileDocuments } from "@/lib/inbox/types";

/** The buyer's proof of funds (optional), on sign-up and on the profile page. */
export function BuyerDocuments({
  value,
  onChange,
  token,
}: {
  value: ProfileDocuments;
  onChange: (documents: ProfileDocuments) => void;
  /** Auth token — when provided files are uploaded immediately on selection. */
  token?: string;
}) {
  return (
    <>
      <div className="border-t border-line pt-5 sm:col-span-2">
        <p className="font-display text-xl text-ink">Buyer documents</p>
        <p className="mt-1 text-sm text-muted">Only the JVA team sees this. It helps sellers take your offer seriously.</p>
      </div>
      <DocumentUpload
        id="proofOfFunds"
        label="Proof of funds"
        description="A bank statement or reference letter showing you can afford the property you're after."
        value={value.proofOfFunds}
        onChange={(doc) => onChange({ ...value, proofOfFunds: doc })}
        upload={token ? (file: File) => uploadFile(file, token) : undefined}
      />
    </>
  );
}
