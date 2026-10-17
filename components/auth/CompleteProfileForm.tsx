"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { updateProfile } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/mock";
import { useAppSelector } from "@/hooks/hooks";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupSteps } from "@/components/auth/SignupSteps";
import { ProfileFields, profileFieldsFor } from "@/components/auth/ProfileFields";
import { InvestorDocuments } from "@/components/auth/InvestorDocuments";
import { Alert, Field, SubmitButton, inputClass } from "@/components/ui/form";
import type { ProfileDocuments } from "@/lib/inbox/types";

interface CompleteProfileFormProps {
  role?: string;
  category?: string;
}

export default function CompleteProfileForm({ role = "Investor", category = "Cooperative" }: CompleteProfileFormProps) {
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const token = useAppSelector((state) => state.auth.token);
  const fields = useMemo(() => profileFieldsFor(role, category), [role, category]);
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [documents, setDocuments] = useState<ProfileDocuments>({});
  const [documentError, setDocumentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInvestor = role === "Investor";


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvestor && !documents.companyProfile) {
      setDocumentError("Upload your company profile to continue.");
      setError("Investors need to upload a company profile.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await updateProfile(token ?? "", { phoneNumber, profile, ...(isInvestor ? { documents } : {}) });
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(errorMessage(error, "Something went wrong. Please try again."));
      setLoading(false);
    }
  };

  return (
    <AuthShell
      wide
      eyebrow={`${role} · ${category}`}
      title="Complete your profile"
      intro="Our team reviews every profile before approving an account. You can update these details later from your dashboard."
      back={{ href: "/dashboard", label: "Skip for now" }}
    >
      <SignupSteps current={3} />
      <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileFields fields={fields} values={profile} onChange={(name, value) => setProfile((current) => ({ ...current, [name]: value }))} />
          <Field label="Phone number" htmlFor="phoneNumber" required hint="We'll call you about matches.">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          {isInvestor ? (
            <InvestorDocuments
              value={documents}
              onChange={(next) => {
                setDocuments(next);
                if (next.companyProfile) setDocumentError("");
              }}
              companyProfileError={documentError}
              token={token ?? undefined}
            />
          ) : null}
        </div>

        {error ? <Alert tone="error" className="mt-6">{error}</Alert> : null}

        <div className="mt-8">
          <SubmitButton loading={loading} loadingText="Saving your profile…">
            Finish and go to my dashboard <FiArrowRight aria-hidden="true" />
          </SubmitButton>
        </div>
      </form>
    </AuthShell>
  );
}
