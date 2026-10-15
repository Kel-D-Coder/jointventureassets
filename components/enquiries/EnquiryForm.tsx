"use client";

import { useState, type FormEvent } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useAppSelector } from "@/hooks/hooks";
import { sendEnquiry } from "@/lib/api/inbox";
import { errorMessage } from "@/lib/api/mock";
import { cx } from "@/lib/format";
import { Alert, SubmitButton, inputClass } from "@/components/ui/form";
import { DocumentUpload } from "@/components/ui/DocumentUpload";
import type { InboxEnquiry, SubmittedDocument } from "@/lib/inbox/types";

/**
 * Asks about a listing or a member's request. Every enquiry lands in the
 * dashboard's Enquiries page, labelled with what it's about. Joint-venture
 * listings also ask about the LOI and require the facilitation fee terms.
 */
export function EnquiryForm({
  target,
  eyebrow,
  defaultMessage,
  submitLabel,
  jointVenture = false,
}: {
  target: InboxEnquiry["target"];
  eyebrow: string;
  defaultMessage: string;
  submitLabel: string;
  jointVenture?: boolean;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phoneNumber: "",
    message: defaultMessage,
  });
  const [generateLoi, setGenerateLoi] = useState<"" | "yes" | "no">("");
  const [companyProfile, setCompanyProfile] = useState<SubmittedDocument>();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [jvErrors, setJvErrors] = useState<{ generateLoi?: string; companyProfile?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (jointVenture) {
      const problems = {
        generateLoi: generateLoi ? undefined : "Choose yes or no.",
        companyProfile: generateLoi === "yes" && !companyProfile ? "Upload your company profile so we can prepare your LOI." : undefined,
      };
      setJvErrors(problems);
      if (problems.generateLoi || problems.companyProfile || !acceptedTerms) return;
    }
    setSending(true);
    try {
      await sendEnquiry({
        ...form,
        target,
        jv: jointVenture
          ? { generateLoi: generateLoi === "yes", companyProfile: generateLoi === "yes" ? companyProfile : undefined, acceptedFeeTerms: true }
          : undefined,
      });
      setSent(true);
    } catch (caught) {
      setError(errorMessage(caught, "Couldn't send your enquiry. Please try again."));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <FiCheckCircle aria-hidden="true" className="mx-auto h-8 w-8 text-green-700" />
        <p className="mt-3 font-semibold text-ink">Enquiry sent</p>
        <p className="mt-1 text-sm text-muted">Thanks. The JVA team will contact you within one working day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="eyebrow text-gold-deep">{eyebrow}</p>
      <label className="block">
        <span className="sr-only">Full name</span>
        <input required value={form.fullName} onChange={set("fullName")} placeholder="Full name" autoComplete="name" className={inputClass} />
      </label>
      <label className="block">
        <span className="sr-only">Email</span>
        <input required type="email" value={form.email} onChange={set("email")} placeholder="Email" autoComplete="email" className={inputClass} />
      </label>
      <label className="block">
        <span className="sr-only">Phone number</span>
        <input required type="tel" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="Phone number" autoComplete="tel" className={inputClass} />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea required rows={4} value={form.message} onChange={set("message")} className={inputClass} />
      </label>
      {jointVenture ? (
        <>
          <fieldset className="rounded-xl border border-line bg-ivory/60 p-4">
            <legend className="px-1 text-sm font-semibold text-ink">
              Do you want us to generate your Letter of Intent (LOI) when you move forward?
              <span className="ml-0.5 text-gold-deep" aria-hidden="true">*</span>
            </legend>
            <div className="mt-1 grid gap-2">
              {([
                ["yes", "Yes, prepare it for me"],
                ["no", "No, I'll provide my own"],
              ] as const).map(([value, label]) => (
                <label
                  key={value}
                  className={cx(
                    "flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-2.5 text-sm has-checked:border-gold has-checked:bg-gold-soft/40",
                    jvErrors.generateLoi ? "border-red-300" : "border-line",
                  )}
                >
                  <input
                    type="radio"
                    name="generateLoi"
                    checked={generateLoi === value}
                    onChange={() => {
                      setGenerateLoi(value);
                      setJvErrors({});
                    }}
                    className="accent-[#c9a24a]"
                  />
                  {label}
                </label>
              ))}
            </div>
            {jvErrors.generateLoi ? <p className="mt-1.5 text-xs font-medium text-red-700">{jvErrors.generateLoi}</p> : null}
            {generateLoi === "yes" ? (
              <div className="mt-4">
                <DocumentUpload
                  id="enquiryCompanyProfile"
                  label="Company profile"
                  description="We use it to prepare the LOI on your company's behalf. PDF or image."
                  required
                  value={companyProfile}
                  onChange={(doc) => {
                    setCompanyProfile(doc);
                    setJvErrors({});
                  }}
                  error={jvErrors.companyProfile}
                />
              </div>
            ) : null}
          </fieldset>

          <div className="rounded-xl border border-line p-4">
            <p className="text-sm font-semibold text-ink">Terms and conditions</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              The Facilitation Fee Agreement is prepared by Joint Venture Assets. The facilitation fee is <strong className="text-ink">10% of the land value</strong>{" "}
              and is <strong className="text-ink">non-negotiable</strong>.
            </p>
            <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9a24a]"
              />
              I agree to the facilitation fee terms.
            </label>
          </div>
        </>
      ) : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <SubmitButton loading={sending} loadingText="Sending…" disabled={jointVenture && !acceptedTerms}>
        {submitLabel}
      </SubmitButton>
      <p className="text-center text-xs text-muted">The JVA team replies within one working day.</p>
    </form>
  );
}
