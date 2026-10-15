"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiFileText, FiSave, FiStar, FiTrash2, FiUploadCloud, FiX } from "react-icons/fi";
import { useAppSelector } from "@/hooks/hooks";
import { deleteSubmission, getSubmission, saveSubmission, type SubmissionInput } from "@/lib/api/inbox";
import { errorMessage } from "@/lib/api/mock";
import { resizeImage } from "@/lib/image";
import { MAX_DOCUMENT_MB, fileSize, toDocument } from "@/lib/files";
import { cx } from "@/lib/format";
import { Alert, Field, MoneyInput, Select, SubmitButton, YesNo, booleanAnswer, inputClass, premiumAnswer, type YesNoValue } from "@/components/ui/form";
import { dealTypeLabel, propertyTypeLabel, sharingFormulas, titleDocuments } from "@/components/listings/labels";
import type { ListingSubmission, SubmittedDocument } from "@/lib/inbox/types";
import type { DealType, PropertyType } from "@/types";

const MAX_PHOTOS = 8;
const MAX_DOCUMENTS = 6;

const emptyForm = {
  dealType: "jv" as DealType,
  title: "",
  propertyType: "land" as PropertyType,
  titleDocument: "C of O",
  sizeSqm: "",
  price: "",
  sharingFormula: "40/60",
  sharingNegotiable: "" as YesNoValue,
  hasPremium: "" as YesNoValue,
  /** Digits only. */
  premium: "",
  duration: "",
  proposal: "",
  area: "",
  city: "",
  state: "Lagos",
  description: "",
  highlights: "",
  isOwner: true,
  ownerName: "",
  fullName: "",
  email: "",
  phoneNumber: "",
};

type FormState = typeof emptyForm;
type ErrorKey = keyof FormState | "images" | "documents";

/** Same required fields as publishing a listing in the admin dashboard, plus title documents and contact details. */
function validate(form: FormState, images: string[], documents: SubmittedDocument[]): Partial<Record<ErrorKey, string>> {
  const errors: Partial<Record<ErrorKey, string>> = {};
  if (!form.title.trim()) errors.title = "Give the property a short title.";
  if (!(Number(form.sizeSqm) > 0)) errors.sizeSqm = "Enter the size in square metres.";
  if (!(Number(form.price) > 0)) errors.price = "Enter an amount in naira.";
  if (form.dealType === "jv" && !form.proposal.trim()) errors.proposal = "What could a developer build here?";
  if (form.dealType === "jv" && !form.sharingNegotiable) errors.sharingNegotiable = "Choose negotiable or fixed.";
  if (form.dealType === "jv" && !form.hasPremium) errors.hasPremium = "Choose yes or no.";
  if (form.dealType === "jv" && form.hasPremium === "yes" && !(Number(form.premium) > 0)) errors.premium = "Enter the premium in naira.";
  if (!form.area.trim()) errors.area = "Add the area.";
  if (!form.city.trim()) errors.city = "Add the city.";
  if (!form.description.trim()) errors.description = "Describe the property.";
  if (!images.length) errors.images = "Add at least one photo.";
  if (!documents.length) errors.documents = "Upload at least one title document so we can verify ownership.";
  if (!form.isOwner && !form.ownerName.trim()) errors.ownerName = "Who owns the property?";
  if (!form.fullName.trim()) errors.fullName = "Enter your name.";
  if (!form.email.trim()) errors.email = "Enter your email.";
  if (!form.phoneNumber.trim()) errors.phoneNumber = "Enter a phone number we can call.";
  return errors;
}

function formFromSubmission(submission: ListingSubmission): FormState {
  const { listing, contact } = submission;
  return {
    dealType: listing.dealType,
    title: listing.title,
    propertyType: listing.propertyType,
    titleDocument: listing.titleDocument || emptyForm.titleDocument,
    sizeSqm: listing.sizeSqm ? String(listing.sizeSqm) : "",
    price: listing.price ? String(listing.price) : "",
    sharingFormula: listing.jv?.sharingFormula ?? emptyForm.sharingFormula,
    sharingNegotiable: booleanAnswer(listing.jv?.sharingNegotiable),
    hasPremium: premiumAnswer(listing.jv?.premium),
    premium: listing.jv?.premium ? String(listing.jv.premium) : "",
    duration: listing.jv?.duration ?? "",
    proposal: listing.jv?.proposal ?? "",
    area: listing.area,
    city: listing.city,
    state: listing.state,
    description: listing.description,
    highlights: listing.highlights.join("\n"),
    isOwner: submission.isOwner,
    ownerName: submission.isOwner ? "" : listing.ownerName,
    fullName: contact.fullName,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
  };
}

const timeFormat = new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" });

export function SubmitListingForm() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const pathname = usePathname();
  const draftParam = useSearchParams().get("draft");

  const [form, setForm] = useState<FormState>({ ...emptyForm, fullName: user?.fullName ?? "", email: user?.email ?? "" });
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<SubmittedDocument[]>([]);
  const [draftId, setDraftId] = useState<string | null>(draftParam);
  const [loadingDraft, setLoadingDraft] = useState(Boolean(draftParam));
  const [alreadySubmitted, setAlreadySubmitted] = useState<ListingSubmission | null>(null);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [busy, setBusy] = useState<"draft" | "submit" | "delete" | "files" | null>(null);
  const [dragging, setDragging] = useState<"photos" | "documents" | null>(null);
  const [submitted, setSubmitted] = useState<ListingSubmission | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const documentInput = useRef<HTMLInputElement>(null);

  // Reopen a saved draft from ?draft=…
  useEffect(() => {
    if (!draftParam) return;
    getSubmission(draftParam)
      .then((submission) => {
        if (submission.status !== "draft") {
          setAlreadySubmitted(submission);
          return;
        }
        setForm(formFromSubmission(submission));
        setImages(submission.listing.images);
        setDocuments(submission.documents ?? []);
        setSavedAt(new Date(submission.updatedAt));
      })
      .catch((caught) => {
        setDraftId(null);
        setError(errorMessage(caught, "Couldn't open that draft."));
      })
      .finally(() => setLoadingDraft(false));
  }, [draftParam]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const onText = (key: keyof FormState) => (event: { target: { value: string } }) => set(key, event.target.value as never);
  const digits = (key: "sizeSqm") => (event: { target: { value: string } }) => set(key, event.target.value.replace(/[^\d]/g, ""));

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy("files");
    const room = MAX_PHOTOS - images.length;
    const added: string[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      try {
        added.push(await resizeImage(file));
      } catch (caught) {
        setError((caught as Error).message);
      }
    }
    if (files.length > room) setError(`You can add up to ${MAX_PHOTOS} photos.`);
    setImages((current) => [...current, ...added]);
    setBusy(null);
    if (photoInput.current) photoInput.current.value = "";
  };

  const addDocuments = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy("files");
    const room = MAX_DOCUMENTS - documents.length;
    const added: SubmittedDocument[] = [];
    const problems: string[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      try {
        added.push(await toDocument(file));
      } catch (caught) {
        problems.push((caught as Error).message);
      }
    }
    if (files.length > room) problems.push(`You can upload up to ${MAX_DOCUMENTS} documents.`);
    setError(problems.join(" "));
    setDocuments((current) => [...current, ...added]);
    setBusy(null);
    if (documentInput.current) documentInput.current.value = "";
  };

  const dropOn = (zone: "photos" | "documents") => ({
    onDragOver: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(zone);
    },
    onDragLeave: () => setDragging(null),
    onDrop: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(null);
      void (zone === "photos" ? addPhotos(event.dataTransfer.files) : addDocuments(event.dataTransfer.files));
    },
  });

  const toInput = (): SubmissionInput => ({
    isOwner: form.isOwner,
    contact: { fullName: form.fullName.trim(), email: form.email.trim(), phoneNumber: form.phoneNumber.trim() },
    documents,
    listing: {
      title: form.title.trim(),
      dealType: form.dealType,
      propertyType: form.propertyType,
      area: form.area.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      sizeSqm: Number(form.sizeSqm) || 0,
      price: Number(form.price) || 0,
      titleDocument: form.titleDocument,
      description: form.description.trim(),
      highlights: form.highlights.split("\n").map((line) => line.trim()).filter(Boolean),
      images,
      jv:
        form.dealType === "jv"
          ? {
              sharingFormula: form.sharingFormula,
              sharingNegotiable: form.sharingNegotiable ? form.sharingNegotiable === "yes" : undefined,
              premium: form.hasPremium === "no" ? 0 : form.hasPremium === "yes" && Number(form.premium) > 0 ? Number(form.premium) : undefined,
              proposal: form.proposal.trim(),
              duration: form.duration.trim(),
            }
          : undefined,
      ownerName: form.isOwner ? form.fullName.trim() : form.ownerName.trim(),
    },
  });

  /** Saves whatever is filled in. Only an email is needed, so the draft can be found again. */
  const saveDraft = async () => {
    setErrors({});
    if (!form.email.trim()) {
      setErrors({ email: "Add your email so you can come back to this draft." });
      setError("Add your email (in the last section) to save a draft.");
      return;
    }
    setError("");
    setBusy("draft");
    try {
      const saved = await saveSubmission(toInput(), { id: draftId ?? undefined, draft: true });
      setDraftId(saved.id);
      setSavedAt(new Date());
      if (!draftId) router.replace(`${pathname}?draft=${saved.id}`, { scroll: false });
    } catch (caught) {
      setError(errorMessage(caught, "Couldn't save your draft. Please try again."));
    } finally {
      setBusy(null);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(form, images, documents);
    setErrors(found);
    if (Object.keys(found).length) {
      setError("Some details are missing. They're marked below. You can save a draft and finish later.");
      return;
    }
    setError("");
    setBusy("submit");
    try {
      const saved = await saveSubmission(toInput(), { id: draftId ?? undefined, draft: false });
      setSubmitted(saved);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught) {
      setError(errorMessage(caught, "Couldn't send your listing. Please try again."));
    } finally {
      setBusy(null);
    }
  };

  const discardDraft = async () => {
    if (!draftId || !window.confirm("Delete this draft? This can't be undone.")) return;
    setBusy("delete");
    try {
      await deleteSubmission(draftId);
      router.push(user ? "/dashboard" : "/listings");
    } catch (caught) {
      setError(errorMessage(caught, "Couldn't delete the draft."));
      setBusy(null);
    }
  };

  if (loadingDraft) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-24 animate-pulse rounded-2xl bg-ivory" />
        <div className="h-96 animate-pulse rounded-2xl bg-ivory" />
      </div>
    );
  }

  if (alreadySubmitted || submitted) {
    const item = (submitted ?? alreadySubmitted)!;
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-700">
          <FiCheckCircle aria-hidden="true" className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-display text-3xl text-ink">{submitted ? "Listing submitted" : "Already submitted"}</h2>
        <p className="mt-3 text-muted">
          <strong className="text-ink">{item.listing.title}</strong> {submitted ? "is now with our team." : "was sent for review, so it can't be edited here any more."}
        </p>
        <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-left text-sm">
          <div className="bg-ivory p-4">
            <dt className="eyebrow text-muted">Status</dt>
            <dd className="mt-1.5 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 capitalize">
              {item.status === "pending" ? "Pending review" : item.status}
            </dd>
          </div>
          <div className="bg-ivory p-4">
            <dt className="eyebrow text-muted">Reference</dt>
            <dd className="mt-1.5 font-semibold text-ink">{item.id.toUpperCase()}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-muted">
          We verify the title and details, usually within 48 hours, then contact you at {item.contact.email}.
          {user ? " You can follow the status on your dashboard." : ""}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {user ? (
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">
              Go to my dashboard <FiArrowRight aria-hidden="true" />
            </Link>
          ) : null}
          <Link href="/listings" className="rounded-full border border-line px-6 py-3 text-sm font-bold text-ink hover:border-ink">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {draftId ? (
        <Alert tone="info">
          You&apos;re editing a saved draft{savedAt ? `, last saved at ${timeFormat.format(savedAt)}` : ""}.{" "}
          {user ? "It's listed on your dashboard." : "Bookmark this page to come back to it."} It isn&apos;t sent to our team until you submit it for review.
        </Alert>
      ) : null}

      <section>
        <h2 className="font-display text-2xl text-ink">1. How do you want to deal?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Deal type">
          {(["jv", "sale"] as DealType[]).map((deal) => (
            <button
              key={deal}
              type="button"
              role="radio"
              aria-checked={form.dealType === deal}
              onClick={() => set("dealType", deal)}
              className={cx(
                "rounded-2xl border p-5 text-left transition",
                form.dealType === deal ? "border-gold bg-gold-soft/40 ring-2 ring-gold/30" : "border-line bg-white hover:border-gray-400",
              )}
            >
              <span className="font-bold text-ink">{dealTypeLabel[deal]}</span>
              <span className="mt-1 block text-sm text-muted">
                {deal === "jv" ? "Keep the land and share what a developer builds on it." : "Sell the land or property outright."}
              </span>
            </button>
          ))}
        </div>
      </section>

      <Section title="2. The property">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" htmlFor="title" required error={errors.title} hint="e.g. 1,200 sqm plot for terrace duplexes" className="sm:col-span-2">
            <input id="title" value={form.title} onChange={onText("title")} className={inputClass} />
          </Field>
          <Field label="Property type" htmlFor="propertyType">
            <Select
              id="propertyType"
              value={form.propertyType}
              onChange={(e) => set("propertyType", e.target.value as PropertyType)}
              options={Object.entries(propertyTypeLabel).map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label="Title document type" htmlFor="titleDocument" hint="Upload a copy in step 5.">
            <Select id="titleDocument" value={form.titleDocument} onChange={onText("titleDocument")} options={titleDocuments} />
          </Field>
          <Field label="Size (sqm)" htmlFor="sizeSqm" required error={errors.sizeSqm} hint="1 hectare = 10,000 sqm">
            <input id="sizeSqm" inputMode="numeric" value={form.sizeSqm} onChange={digits("sizeSqm")} className={inputClass} />
          </Field>
          <Field label={form.dealType === "jv" ? "Land value (₦)" : "Asking price (₦)"} htmlFor="price" required error={errors.price}>
            <MoneyInput id="price" value={form.price} onChange={(value) => set("price", value)} placeholder="e.g. 150,000,000" />
          </Field>
        </div>

        {form.dealType === "jv" ? (
          <div className="mt-6 grid gap-5 rounded-2xl bg-ivory p-5 sm:grid-cols-2">
            <p className="eyebrow text-gold-deep sm:col-span-2">Joint-venture terms</p>
            <Field label="Sharing formula" htmlFor="sharingFormula" hint="Landowner / developer">
              <Select id="sharingFormula" value={form.sharingFormula} onChange={onText("sharingFormula")} options={sharingFormulas} />
            </Field>
            <YesNo
              name="sharingNegotiable"
              legend="Is the sharing formula negotiable?"
              value={form.sharingNegotiable}
              onChange={(value) => set("sharingNegotiable", value)}
              yes="Negotiable"
              no="Fixed"
              hint="Shown on the listing so developers know."
              error={errors.sharingNegotiable}
            />
            <YesNo
              name="hasPremium"
              legend="Is there a premium?"
              value={form.hasPremium}
              onChange={(value) => set("hasPremium", value)}
              yes="Yes"
              no="No premium"
              hint="An upfront payment from the developer to the landowner."
              error={errors.hasPremium}
            />
            {form.hasPremium === "yes" ? (
              <Field label="Premium amount (₦)" htmlFor="premium" required error={errors.premium}>
                <MoneyInput id="premium" value={form.premium} onChange={(value) => set("premium", value)} placeholder="e.g. 25,000,000" />
              </Field>
            ) : null}
            <Field label="Build period" htmlFor="duration">
              <input id="duration" value={form.duration} onChange={onText("duration")} placeholder="e.g. 24 months" className={inputClass} />
            </Field>
            <Field label="What could be built?" htmlFor="proposal" required error={errors.proposal} className="sm:col-span-2">
              <input id="proposal" value={form.proposal} onChange={onText("proposal")} placeholder="e.g. 12 units of 3-bed apartments" className={inputClass} />
            </Field>
          </div>
        ) : null}
      </Section>

      <Section title="3. Location and description">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Area" htmlFor="area" required error={errors.area}>
            <input id="area" value={form.area} onChange={onText("area")} placeholder="e.g. Lekki Phase 1" className={inputClass} />
          </Field>
          <Field label="City" htmlFor="city" required error={errors.city}>
            <input id="city" value={form.city} onChange={onText("city")} className={inputClass} />
          </Field>
          <Field label="State" htmlFor="state">
            <input id="state" value={form.state} onChange={onText("state")} className={inputClass} />
          </Field>
          <Field label="Description" htmlFor="description" required error={errors.description} className="sm:col-span-3">
            <textarea id="description" rows={5} value={form.description} onChange={onText("description")} className={inputClass} placeholder="Access roads, terrain, what's nearby, any structures on it." />
          </Field>
          <Field label="Highlights" htmlFor="highlights" hint="One per line, e.g. Fenced and gated" className="sm:col-span-3">
            <textarea id="highlights" rows={3} value={form.highlights} onChange={onText("highlights")} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="4. Photos" intro={`Up to ${MAX_PHOTOS}. The first photo is the cover.`}>
        <DropZone
          {...dropOn("photos")}
          active={dragging === "photos"}
          invalid={Boolean(errors.images)}
          heading={busy === "files" ? "Preparing files…" : "Drag photos here"}
          note="JPG or PNG. Large photos are resized automatically."
          buttonLabel="Choose photos"
          disabled={busy === "files" || images.length >= MAX_PHOTOS}
          onChoose={() => photoInput.current?.click()}
        />
        <input ref={photoInput} type="file" accept="image/*" multiple hidden onChange={(event) => addPhotos(event.target.files)} />
        {errors.images ? <p className="mt-2 text-xs font-medium text-red-700">{errors.images}</p> : null}
        {images.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((src, index) => (
              <li key={src.slice(-32) + index} className="relative overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Photo ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                {index === 0 ? (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[0.6875rem] font-bold text-gold">
                    <FiStar aria-hidden="true" /> Cover
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-red-700 shadow"
                >
                  <FiX aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section
        title="5. Title documents"
        intro={`Upload clear copies of the documents that prove ownership: ${form.titleDocument === "Survey plan only" ? "the survey plan" : `the ${form.titleDocument}`}, survey plan, deed of assignment or receipts. Only our verification team sees them.`}
      >
        <DropZone
          {...dropOn("documents")}
          active={dragging === "documents"}
          invalid={Boolean(errors.documents)}
          heading={busy === "files" ? "Preparing files…" : "Drag title documents here"}
          note={`PDF, JPG or PNG, up to ${MAX_DOCUMENT_MB} MB each, ${MAX_DOCUMENTS} files at most.`}
          buttonLabel="Choose documents"
          disabled={busy === "files" || documents.length >= MAX_DOCUMENTS}
          onChoose={() => documentInput.current?.click()}
        />
        <input ref={documentInput} type="file" accept="application/pdf,image/*" multiple hidden onChange={(event) => addDocuments(event.target.files)} />
        {errors.documents ? <p className="mt-2 text-xs font-medium text-red-700">{errors.documents}</p> : null}
        {documents.length ? (
          <ul className="mt-4 space-y-2">
            {documents.map((doc, index) => (
              <li key={doc.name + index} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-soft text-gold-deep">
                  <FiFileText aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">{doc.name}</span>
                  <span className="text-xs text-muted">
                    {doc.type === "application/pdf" ? "PDF" : "Image"} · {fileSize(doc.size)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setDocuments((current) => current.filter((_, i) => i !== index))}
                  aria-label={`Remove ${doc.name}`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                >
                  <FiX aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section title="6. Owner and contact">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Are you the owner?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { value: true, label: "Yes, I own it" },
              { value: false, label: "No, I'm listing for the owner" },
            ].map((option) => (
              <label
                key={option.label}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm has-checked:border-gold has-checked:bg-gold-soft/40"
              >
                <input type="radio" name="isOwner" checked={form.isOwner === option.value} onChange={() => set("isOwner", option.value)} className="accent-[#c9a24a]" />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {!form.isOwner ? (
            <Field label="Owner's name" htmlFor="ownerName" required error={errors.ownerName} className="sm:col-span-2">
              <input id="ownerName" value={form.ownerName} onChange={onText("ownerName")} placeholder="Person, family or company" className={inputClass} />
            </Field>
          ) : null}
          <Field label="Your full name" htmlFor="fullName" required error={errors.fullName}>
            <input id="fullName" autoComplete="name" value={form.fullName} onChange={onText("fullName")} className={inputClass} />
          </Field>
          <Field label="Email" htmlFor="email" required error={errors.email} hint="Needed to save a draft, too.">
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={onText("email")} className={inputClass} />
          </Field>
          <Field label="Phone number" htmlFor="phoneNumber" required error={errors.phoneNumber}>
            <input id="phoneNumber" type="tel" autoComplete="tel" value={form.phoneNumber} onChange={onText("phoneNumber")} placeholder="+234" className={inputClass} />
          </Field>
        </div>
      </Section>

      {error ? <Alert tone="error">{error}</Alert> : null}

      <div className="sticky bottom-0 z-20 -mx-4 flex flex-col gap-3 border-t border-line bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:rounded-2xl sm:border sm:px-5">
        <div className="sm:w-60">
          <SubmitButton loading={busy === "submit"} loadingText="Submitting…" disabled={busy !== null && busy !== "submit"}>
            Submit for review <FiArrowRight aria-hidden="true" />
          </SubmitButton>
        </div>
        <button
          type="button"
          onClick={saveDraft}
          disabled={busy !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3.5 text-sm font-bold text-ink hover:border-ink disabled:opacity-50"
        >
          <FiSave aria-hidden="true" /> {busy === "draft" ? "Saving…" : "Save as draft"}
        </button>
        {savedAt ? <p className="text-xs text-muted">Draft saved at {timeFormat.format(savedAt)}</p> : <p className="text-xs text-muted">Nothing goes live until our team has verified it.</p>}
        {draftId ? (
          <button type="button" onClick={discardDraft} disabled={busy !== null} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:underline disabled:opacity-50 sm:ml-auto">
            <FiTrash2 aria-hidden="true" /> Delete draft
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Section({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line p-6 sm:p-8">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {intro ? <p className="mt-1 text-sm text-muted">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DropZone({
  active,
  invalid,
  heading,
  note,
  buttonLabel,
  disabled,
  onChoose,
  ...dropHandlers
}: {
  active: boolean;
  invalid: boolean;
  heading: string;
  note: string;
  buttonLabel: string;
  disabled: boolean;
  onChoose: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      {...dropHandlers}
      className={cx(
        "rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
        active ? "border-gold bg-gold-soft/40" : invalid ? "border-red-300" : "border-line",
      )}
    >
      <FiUploadCloud aria-hidden="true" className="mx-auto h-8 w-8 text-gold-deep" />
      <p className="mt-3 font-semibold text-ink">{heading}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
      <button
        type="button"
        onClick={onChoose}
        disabled={disabled}
        className="mt-4 rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-ink hover:border-ink disabled:opacity-50"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
