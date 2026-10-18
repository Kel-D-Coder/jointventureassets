"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiFileText, FiUploadCloud, FiX } from "react-icons/fi";
import { createRequest } from "@/lib/api/requests";
import { errorMessage } from "@/lib/api/errors";
import { useAppSelector } from "@/hooks/hooks";
import { PageHero } from "@/components/ui/PageHero";
import { Alert, Field, SubmitButton, inputClass } from "@/components/ui/form";
import { RequestBriefFields } from "@/components/requests/RequestBriefFields";
import { briefPayload, briefProblem, emptyBrief, requestSummary, requestTypeHint, requestTypeLabel, requestTypes, type Brief } from "@/lib/requests";
import { cx } from "@/lib/format";
import type { RequestType } from "@/types";

const MAX_FILE_MB = 10;

export default function SubmitRequestPage() {
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [type, setType] = useState<RequestType>("jv");
  const [brief, setBrief] = useState<Brief>(emptyBrief);
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState({ fullName: user?.fullName ?? "", email: user?.email ?? "", phoneNumber: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onContact = (e: ChangeEvent<HTMLInputElement>) => setContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.filter((file) => file.size > MAX_FILE_MB * 1024 * 1024);
    setError(tooBig.length ? `${tooBig.map((f) => f.name).join(", ")} ${tooBig.length === 1 ? "is" : "are"} over ${MAX_FILE_MB} MB.` : "");
    setFiles((prev) => [...prev, ...incoming.filter((file) => !tooBig.includes(file))]);
    if (fileInput.current) fileInput.current.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = briefProblem(type, brief);
    if (problem) {
      setError(problem);
      return;
    }
    const fields = briefPayload(type, brief);
    // The brief in words comes first, so whoever reads the request sees what's wanted at a glance.
    const description = [requestSummary(fields), notes.trim()].filter(Boolean).join("\n\n");

    try {
      setIsSubmitting(true);
      setError("");
      await createRequest(token, { ...fields, ...contact, description, files });
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught: unknown) {
      setError(errorMessage(caught, "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <main className="bg-ivory px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-700">
            <FiCheckCircle aria-hidden="true" className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl text-ink">Request submitted</h1>
          <p className="mt-3 text-muted">
            Thank you. Our team will review it within 24–48 hours and start sourcing it for you. Once approved, members can see it and send enquiries. Follow its status on your dashboard.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">
              Go to my dashboard <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/listings" className="rounded-full border border-line px-6 py-3 text-sm font-bold text-ink hover:border-ink">
              Browse listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white pb-24">
      <PageHero
        eyebrow="Post a request"
        title="Tell us what you want, we'll find it"
        intro="Didn't see it in our listings? Describe what you're looking for and your budget. Our team sources it for you, and once your request is approved, members on the platform can respond."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8">
        {!isAuthenticated ? (
          <div className="rounded-2xl border border-line bg-ivory p-8 text-center lg:col-span-2">
            <h2 className="font-display text-2xl text-ink">Log in to post a request</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">You&apos;ll need an account so we can keep you updated and you can track your request.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/login" className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">
                Log in
              </Link>
              <Link href="/register" className="rounded-full border border-line bg-white px-6 py-3 text-sm font-bold text-ink hover:border-ink">
                Create an account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <section>
              <h2 className="font-display text-2xl text-ink">1. What do you want us to find?</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Request type">
                {requestTypes.map((option) => {
                  const active = option === type;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setType(option);
                        setError("");
                      }}
                      className={cx(
                        "rounded-2xl border p-5 text-left transition",
                        active ? "border-gold bg-gold-soft/40 ring-2 ring-gold/30" : "border-line bg-white hover:border-gray-400",
                      )}
                    >
                      <span className="font-bold text-ink">{requestTypeLabel[option]}</span>
                      <span className="mt-1 block text-sm text-muted">{requestTypeHint[option]}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-line p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">2. Your brief</h2>
              <p className="mt-1 text-sm text-muted">The more specific you are, the faster we can find a match.</p>
              <div className="mt-6">
                <RequestBriefFields type={type} value={brief} onChange={setBrief} />
              </div>
              <Field label="Anything else we should know?" htmlFor="notes" hint="Optional. Must-haves, things to avoid, how soon you can move." className="mt-5">
                <textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} />
              </Field>
            </section>

            <section className="rounded-2xl border border-line p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">3. Your contact details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" htmlFor="fullName" required>
                  <input id="fullName" name="fullName" autoComplete="name" required value={contact.fullName} onChange={onContact} className={inputClass} />
                </Field>
                <Field label="Email" htmlFor="email" required>
                  <input id="email" name="email" type="email" autoComplete="email" required value={contact.email} onChange={onContact} className={inputClass} />
                </Field>
                <Field label="Phone number" htmlFor="phoneNumber">
                  <input id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel" value={contact.phoneNumber} onChange={onContact} className={inputClass} placeholder="+234" />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-line p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">4. Attachments</h2>
              <p className="mt-1 text-sm text-muted">Optional. Proof of funds, reference photos or plans help us find the right match.</p>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cx("mt-5 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors", dragging ? "border-gold bg-gold-soft/40" : "border-line")}
              >
                <FiUploadCloud aria-hidden="true" className="mx-auto h-8 w-8 text-gold-deep" />
                <p className="mt-3 font-semibold text-ink">Drag files here</p>
                <p className="mt-1 text-xs text-muted">PDF, DOC, JPG or PNG, up to {MAX_FILE_MB} MB each</p>
                <button type="button" onClick={() => fileInput.current?.click()} className="mt-4 rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-ink hover:border-ink">
                  Choose files
                </button>
                <input ref={fileInput} type="file" multiple hidden accept=".pdf,.doc,.docx,image/*" onChange={(e) => addFiles(e.target.files)} />
              </div>
              {files.length ? (
                <ul className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <li key={file.name + index} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm">
                      <FiFileText aria-hidden="true" className="shrink-0 text-gold-deep" />
                      <span className="min-w-0 flex-1 truncate text-ink">{file.name}</span>
                      <span className="shrink-0 text-xs text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                        aria-label={`Remove ${file.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                      >
                        <FiX aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            {error ? <Alert tone="error">{error}</Alert> : null}

            <div className="sm:w-72">
              <SubmitButton loading={isSubmitting} loadingText="Submitting…">
                Post request <FiArrowRight aria-hidden="true" />
              </SubmitButton>
            </div>
          </form>
        )}

        {isAuthenticated ? (
          <aside className="self-start rounded-2xl bg-ink p-7 text-white lg:sticky lg:top-28">
            <p className="eyebrow text-gold">What happens next</p>
            <ol className="mt-5 space-y-5 text-sm">
              {[
                ["We review it", "Our team checks your brief within 24–48 hours."],
                ["We source it", "We search our network of landowners, developers and sellers for a match within your budget."],
                ["Members respond", "Approved requests appear on Browse requests, where members who have what you want can send enquiries. We make the introduction."],
              ].map(([title, body], index) => (
                <li key={title} className="flex gap-4">
                  <span className="font-display text-2xl leading-none text-gold">{index + 1}</span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-0.5 block text-gray-400">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
