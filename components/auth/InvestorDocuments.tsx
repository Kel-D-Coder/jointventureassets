"use client";

import { DocumentUpload } from "@/components/ui/DocumentUpload";
import type { ProfileDocuments } from "@/lib/inbox/types";

/** The investor's company profile (required) and proof of funds (optional), on sign-up and on the profile page. */
export function InvestorDocuments({
  value,
  onChange,
  companyProfileError,
}: {
  value: ProfileDocuments;
  onChange: (documents: ProfileDocuments) => void;
  companyProfileError?: string;
}) {
  return (
    <>
      <div className="border-t border-line pt-5 sm:col-span-2">
        <p className="font-display text-xl text-ink">Investor documents</p>
        <p className="mt-1 text-sm text-muted">Only the JVA team sees these. They help us approve your account and introduce you to landowners.</p>
      </div>
      <DocumentUpload
        id="companyProfile"
        label="Company profile"
        description="Your company or personal investment profile: track record, projects and team."
        required
        value={value.companyProfile}
        onChange={(doc) => onChange({ ...value, companyProfile: doc })}
        error={companyProfileError}
      />
      <DocumentUpload
        id="proofOfFunds"
        label="Proof of funds"
        description="A bank statement or reference letter showing you can fund the projects you're after."
        value={value.proofOfFunds}
        onChange={(doc) => onChange({ ...value, proofOfFunds: doc })}
      />
    </>
  );
}
