"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiFileText, FiInfo, FiSave, FiStar, FiTrash2, FiUploadCloud, FiVideo, FiX } from "react-icons/fi";
import { useAppSelector } from "@/hooks/hooks";
import { useMyAccount } from "@/hooks/useMyAccount";
import { AccountNotApproved } from "@/components/auth/AccountNotApproved";
import { deleteSubmission, getSubmission, saveSubmission, type SubmissionInput } from "@/lib/api/inbox";
import { errorMessage } from "@/lib/api/errors";
import { resizeImage } from "@/lib/image";
import { VIDEO_LIMITS, discardVideo, isVideoUrl, joinMedia, photosThenVideo, prepareVideo, splitMedia } from "@/lib/videoWatermark";
import { MAX_DOCUMENT_MB, fileSize, toDocument } from "@/lib/files";
import { cx, formatNaira } from "@/lib/format";
import { MIN_ESTATE_FEE_PERCENT, SALE_FEE_RATE, estateFeeProblem, percentDigits, saleFee } from "@/lib/fees";
import { Alert, Field, MoneyInput, Select, SubmitButton, YesNo, booleanAnswer, inputClass, premiumAnswer, type YesNoValue } from "@/components/ui/form";
import { dealTypeLabel, priceNegotiableLabel, priceNegotiableOptions, propertyTypeLabel, documentsToUpload, listInWords, sharingFormulaOptions, splitTitles, SHARING_TBD } from "@/components/listings/labels";
import type { ListingSubmission, SubmittedDocument } from "@/lib/inbox/types";
import type { DealType, PriceNegotiable, PropertyType } from "@/types";
import { TitleDocumentPicker } from "@/components/listings/TitleDocumentPicker";
import { PlotOptionsFields } from "@/components/listings/PlotOptionsFields";
import { isEstate, plotOptionsFrom, plotRowsFrom, plotRowsProblem, readPlotOptions } from "@/components/listings/labels";

const MAX_PHOTOS = 8;
const MAX_DOCUMENTS = 6;

const emptyForm = {
  dealType: "jv" as DealType,
  title: "",
  propertyType: "land" as PropertyType,
  titleDocument: "C of O",
  sizeSqm: "",
  price: "",
  /** Joint ventures: land value to be determined. */
  landValueTbd: false,
  /** Sale listings: an estate with several plot sizes, each with its own price. */
  isEstate: false,
  /** Estates: the facilitation fee to JVA, as a percentage (at least 5). */
  estateFeePercent: "",
  plotRows: plotRowsFrom(),
  sharingFormula: "40/60",
  sharingNegotiable: "" as YesNoValue,
  hasPremium: "" as YesNoValue,
  /** Digits only. */
  premium: "",
  duration: "",
  /** Optional, typed: what a developer could build, e.g. "6 units of apartments". */
  proposal: "",
  area: "",
  city: "",
  state: "Lagos",
  description: "",
  highlights: "",
  isOwner: true,
  /** Sale listings: the seller agrees to the facilitation fee before submitting. */
  acceptedSaleFee: false,
  /** Sale listings: how open the asking price is. */
  priceNegotiable: "" as "" | PriceNegotiable,
  ownerName: "",
  fullName: "",
  email: "",
  phoneNumber: "",
};

type FormState = typeof emptyForm;
type ErrorKey = keyof FormState | "images" | "documents" | "plotOptions";

/** Same required fields as publishing a listing in the admin dashboard, plus title documents and contact details. */
function validate(form: FormState, images: string[], documents: SubmittedDocument[]): Partial<Record<ErrorKey, string>> {
  const errors: Partial<Record<ErrorKey, string>> = {};
  if (!form.title.trim()) errors.title = "Give the property a short title.";
  const estate = form.dealType === "sale" && form.isEstate;
  if (estate) {
    const problem = plotRowsProblem(form.plotRows);
    if (problem) errors.plotOptions = problem;
    const feeProblem = estateFeeProblem(form.estateFeePercent);
    if (feeProblem) errors.estateFeePercent = feeProblem;
  }
  // Size is required for a joint venture, optional for a sale.
  if (!estate && form.dealType === "jv" && !(Number(form.sizeSqm) > 0)) errors.sizeSqm = "Enter the size in square metres.";
  if (!estate && !(Number(form.price) > 0) && !(form.dealType === "jv" && form.landValueTbd)) errors.price = form.dealType === "jv" ? "Enter the land value, or tick TBD." : "Enter an amount in naira.";
  if (form.dealType === "jv" && form.sharingFormula !== SHARING_TBD && !form.sharingNegotiable) errors.sharingNegotiable = "Choose negotiable or fixed.";
  if (form.dealType === "jv" && !form.hasPremium) errors.hasPremium = "Choose yes or no.";
  if (form.dealType === "jv" && form.hasPremium === "yes" && !(Number(form.premium) > 0)) errors.premium = "Enter the premium in naira.";
  if (!form.area.trim()) errors.area = "Add the area.";
  if (!form.city.trim()) errors.city = "Add the city.";
  if (!form.description.trim()) errors.description = "Describe the property.";
  if (!splitTitles(form.titleDocument).length) errors.titleDocument = "Pick at least one title document.";
  if (!images.some((url) => !isVideoUrl(url))) errors.images = "Add at least one photo.";
  if (!documents.length) errors.documents = "Upload at least one title document so we can verify ownership.";
  if (!form.isOwner && !form.ownerName.trim()) errors.ownerName = "Who owns the property?";
  if (!form.fullName.trim()) errors.fullName = "Enter your name.";
  if (!form.email.trim()) errors.email = "Enter your email.";
  if (!form.phoneNumber.trim()) errors.phoneNumber = "Enter a phone number we can call.";
  if (!estate && form.dealType === "sale" && !form.priceNegotiable) errors.priceNegotiable = "Choose whether the price is negotiable.";
  if (form.dealType === "sale" && !form.acceptedSaleFee) errors.acceptedSaleFee = "Agree to the facilitation fee to submit a property for sale.";
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
    landValueTbd: Boolean(listing.landValueTbd),
    isEstate: isEstate({ plotOptions: readPlotOptions(listing.plotOptions) }),
    estateFeePercent: isEstate({ plotOptions: readPlotOptions(listing.plotOptions) }) && listing.saleTerms?.feeRate ? String(Math.round(listing.saleTerms.feeRate * 10000) / 100) : "",
    plotRows: plotRowsFrom(readPlotOptions(listing.plotOptions)),
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
    acceptedSaleFee: Boolean(listing.saleTerms?.acceptedFeeTerms),
    priceNegotiable: listing.priceNegotiable ?? "",
    ownerName: submission.isOwner ? "" : listing.ownerName,
    fullName: contact.fullName,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
  };
}

const timeFormat = new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" });

export function SubmitListingForm() {
  const { user, token } = useAppSelector((state) => state.auth);
  // Only approved members can list a property.
  const { account, loading: checkingAccount, error: accountError, approved, reload: recheckAccount } = useMyAccount();
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
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  /** 0–1 while the video is being checked. */
  const [videoProgress, setVideoProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState<"photos" | "documents" | null>(null);
  const [submitted, setSubmitted] = useState<ListingSubmission | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const documentInput = useRef<HTMLInputElement>(null);

  // Reopen a saved draft from ?draft=…
  useEffect(() => {
    if (!draftParam || !token) return;
    getSubmission(draftParam, token)
      .then((submission) => {
        if (submission.status !== "draft") {
          setAlreadySubmitted(submission);
          return;
        }
        setForm(formFromSubmission(submission));
        setImages(joinMedia(submission.listing.images, submission.listing.videos));
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

  /** Photos (up to MAX_PHOTOS, watermarked as they're added) and at most one video, uploaded as it is. */
  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy("files");
    const chosen = Array.from(files);
    const photos = chosen.filter((file) => !file.type.startsWith("video/"));
    const videos = chosen.filter((file) => file.type.startsWith("video/"));
    const hasVideo = images.some(isVideoUrl);
    const room = MAX_PHOTOS - images.filter((url) => !isVideoUrl(url)).length;
    const problems: string[] = [];
    const added: string[] = [];
    for (const file of photos.slice(0, Math.max(0, room))) {
      try {
        added.push(await resizeImage(file));
      } catch (caught) {
        problems.push((caught as Error).message);
      }
    }
    if (photos.length > room) problems.push(`You can add up to ${MAX_PHOTOS} photos.`);
    setImages((current) => photosThenVideo([...current, ...added]));

    if (videos.length && (hasVideo || videos.length > 1)) {
      problems.push(hasVideo ? "You can add one video. Remove the current video to add a different one." : "You can add one video. Choose just one.");
    }
    if (videos.length && !hasVideo) {
      setVideoProgress(0);
      try {
        const video = await prepareVideo(videos[0]!, setVideoProgress);
        setImages((current) => photosThenVideo([...current, video]));
      } catch (caught) {
        problems.push((caught as Error).message);
      } finally {
        setVideoProgress(null);
      }
    }

    if (problems.length) setError(problems.join(" "));
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

  // Estates: every plot, cheapest first; the cheapest also fills the usual size, price and negotiable fields.
  const plots = form.dealType === "sale" && form.isEstate ? plotOptionsFrom(form.plotRows) : [];
  const cheapestPlot = plots[0];
  // The seller's fee: an estate's own percentage once it's valid, otherwise the standard rate.
  const sellerFeeRate = form.dealType === "sale" && form.isEstate && !estateFeeProblem(form.estateFeePercent) ? Number(form.estateFeePercent) / 100 : SALE_FEE_RATE;

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
      sizeSqm: cheapestPlot ? cheapestPlot.sizeSqm : Number(form.sizeSqm) || 0,
      price: cheapestPlot ? cheapestPlot.price : form.dealType === "jv" && form.landValueTbd ? 0 : Number(form.price) || 0,
      landValueTbd: form.dealType === "jv" && form.landValueTbd ? true : undefined,
      plotOptions: plots,
      titleDocument: form.titleDocument,
      description: form.description.trim(),
      highlights: form.highlights.split("\n").map((line) => line.trim()).filter(Boolean),
      ...splitMedia(images),
      jv:
        form.dealType === "jv"
          ? {
              sharingFormula: form.sharingFormula,
              // "To be discussed" has no ratio to negotiate yet.
              sharingNegotiable: form.sharingFormula !== SHARING_TBD && form.sharingNegotiable ? form.sharingNegotiable === "yes" : undefined,
              premium: form.hasPremium === "no" ? 0 : form.hasPremium === "yes" && Number(form.premium) > 0 ? Number(form.premium) : undefined,
              proposal: form.proposal.trim(),
              duration: form.duration.trim(),
            }
          : undefined,
      priceNegotiable: cheapestPlot ? cheapestPlot.priceNegotiable : form.dealType === "sale" && form.priceNegotiable ? form.priceNegotiable : undefined,
      saleTerms: form.dealType === "sale" && form.acceptedSaleFee ? { acceptedFeeTerms: true, feeRate: sellerFeeRate } : undefined,
      ownerName: form.isOwner ? form.fullName.trim() : form.ownerName.trim(),
    },
  });

  const saveDraft = async () => {
    setErrors({});
    if (!form.email.trim()) {
      setErrors({ email: "Add your email so you can come back to this draft." });
      setError("Add your email (in the last section) to save a draft.");
      return;
    }
    if (!token) { setError("Log in to save a draft."); return; }
    if (!approved) { setError("Your account needs to be approved before you can save a listing."); return; }
    setError("");
    setBusy("draft");
    try {
      const saved = await saveSubmission(toInput(), { id: draftId ?? undefined, draft: true }, token);
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
    if (!token) { setError("Log in to submit a listing."); return; }
    if (!approved) { setError("Your account needs to be approved before you can submit a listing."); return; }
    setError("");
    setBusy("submit");
    try {
      const saved = await saveSubmission(toInput(), { id: draftId ?? undefined, draft: false }, token);
      setSubmitted(saved);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught) {
      setError(errorMessage(caught, "Couldn't send your listing. Please try again."));
    } finally {
      setBusy(null);
    }
  };

  const discardDraft = async () => {
    if (!draftId || !token) return;
    setBusy("delete");
    try {
      await deleteSubmission(draftId, token);
      router.push(user ? "/dashboard" : "/listings");
    } catch (caught) {
      setError(errorMessage(caught, "Couldn't delete the draft."));
      setBusy(null);
      setConfirmingDelete(false);
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

  if (!user || !token) {
    return (
      <div className="rounded-2xl border border-line bg-ivory p-10 text-center">
        <h2 className="font-display text-2xl text-ink">Log in to list a property</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">You need an account to submit a listing and track its review status.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/login" className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">Log in</Link>
          <Link href="/register" className="rounded-full border border-line bg-white px-6 py-3 text-sm font-bold text-ink hover:border-ink">Create an account</Link>
        </div>
      </div>
    );
  }

  if (checkingAccount) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Checking your account">
        <div className="h-24 animate-pulse rounded-2xl bg-ivory" />
        <div className="h-64 animate-pulse rounded-2xl bg-ivory" />
      </div>
    );
  }

  if (accountError) {
    return (
      <div className="rounded-2xl border border-line bg-ivory p-8 text-center">
        <Alert tone="error">{accountError}</Alert>
        <button type="button" onClick={recheckAccount} className="mt-4 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">
          Try again
        </button>
      </div>
    );
  }

  if (account && !approved) return <AccountNotApproved account={account} action="list a property" />;

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
            <input id="title" value={form.title} onChange={(e) => set("title", e.target.value.toUpperCase())} className={inputClass} />
          </Field>
          <Field label="Property type" htmlFor="propertyType">
            <Select
              id="propertyType"
              value={form.propertyType}
              onChange={(e) => set("propertyType", e.target.value as PropertyType)}
              options={Object.entries(propertyTypeLabel).map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label="Title documents" required error={errors.titleDocument} hint="Pick all that apply. Upload copies in step 5." className="sm:col-span-2">
            <TitleDocumentPicker value={form.titleDocument} onChange={(value) => set("titleDocument", value)} />
          </Field>
          {form.dealType === "sale" ? (
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 text-sm text-ink sm:col-span-2 has-checked:border-gold has-checked:bg-gold-soft/40">
              <input type="checkbox" checked={form.isEstate} onChange={(e) => set("isEstate", e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9a24a]" />
              <span>
                <span className="font-semibold">This is an estate with several plot sizes</span>
                <span className="block text-xs text-muted">Add each plot size with its own price, negotiable option and initial deposit.</span>
              </span>
            </label>
          ) : null}
          {form.dealType === "sale" && form.isEstate ? (
            <div className="sm:col-span-2">
              <PlotOptionsFields rows={form.plotRows} onChange={(rows) => set("plotRows", rows)} error={errors.plotOptions} />
              <Field
                label="Facilitation fee to JVA (%)"
                htmlFor="estateFeePercent"
                required
                error={errors.estateFeePercent}
                hint={`At least ${MIN_ESTATE_FEE_PERCENT}%. Paid to JVA from each plot's sale price when it sells.`}
                className="mt-5 sm:max-w-xs"
              >
                <input
                  id="estateFeePercent"
                  inputMode="decimal"
                  value={form.estateFeePercent}
                  onChange={(e) => set("estateFeePercent", percentDigits(e.target.value))}
                  placeholder="e.g. 5"
                  className={inputClass}
                />
              </Field>
            </div>
          ) : (
            <>
          <Field label="Size (sqm)" htmlFor="sizeSqm" required={form.dealType === "jv"} error={errors.sizeSqm} hint={form.dealType === "sale" ? "Optional for a sale. 1 hectare = 10,000 sqm" : "1 hectare = 10,000 sqm"}>
            <MoneyInput id="sizeSqm" value={form.sizeSqm} onChange={(value) => set("sizeSqm", value)} placeholder="e.g. 1,000" />
          </Field>
          <Field label={form.dealType === "jv" ? "Land value (₦)" : "Asking price (₦)"} htmlFor="price" required error={errors.price}>
            <MoneyInput
              id="price"
              value={form.price}
              onChange={(value) => set("price", value)}
              placeholder={form.dealType === "jv" && form.landValueTbd ? "To be determined" : "e.g. 150,000,000"}
              disabled={form.dealType === "jv" && form.landValueTbd}
            />
            {form.dealType === "jv" ? (
              <label className="mt-2 flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.landValueTbd}
                  onChange={(e) => setForm((current) => ({ ...current, landValueTbd: e.target.checked, price: e.target.checked ? "" : current.price }))}
                  className="h-4 w-4 accent-[#c9a24a]"
                />
                TBD (to be determined)
              </label>
            ) : null}
          </Field>
            </>
          )}
        </div>

        {form.dealType === "sale" && !form.isEstate ? (
          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-semibold text-ink">
              Is the price negotiable?<span className="ml-0.5 text-gold-deep" aria-hidden="true">*</span>
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {priceNegotiableOptions.map((option) => (
                <label
                  key={option}
                  className={cx(
                    "flex cursor-pointer items-center gap-2.5 rounded-xl border bg-white px-4 py-3 text-sm text-ink has-checked:border-gold has-checked:bg-gold-soft/40",
                    errors.priceNegotiable ? "border-red-300" : "border-line",
                  )}
                >
                  <input
                    type="radio"
                    name="priceNegotiable"
                    checked={form.priceNegotiable === option}
                    onChange={() => set("priceNegotiable", option)}
                    className="accent-[#c9a24a]"
                  />
                  {priceNegotiableLabel[option]}
                </label>
              ))}
            </div>
            {errors.priceNegotiable ? (
              <p className="mt-1.5 text-xs font-medium text-red-700">{errors.priceNegotiable}</p>
            ) : (
              <p className="mt-1.5 text-xs text-muted">Shown on the listing so buyers know where they stand.</p>
            )}
          </fieldset>
        ) : null}

        {form.dealType === "sale" ? <SellerFee price={cheapestPlot ? cheapestPlot.price : Number(form.price) || 0} rate={sellerFeeRate} /> : null}

        {form.dealType === "jv" ? (
          <div className="mt-6 grid gap-5 rounded-2xl bg-ivory p-5 sm:grid-cols-2">
            <p className="eyebrow text-gold-deep sm:col-span-2">Joint-venture terms</p>
            <Field label="Sharing formula" htmlFor="sharingFormula" hint="Landowner / developer">
              <Select id="sharingFormula" value={form.sharingFormula} onChange={onText("sharingFormula")} options={sharingFormulaOptions} />
            </Field>
            {form.sharingFormula !== SHARING_TBD ? (
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
            ) : null}
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
            <Field
              label="What can be built here?"
              htmlFor="proposal"
              hint="Optional. Type it in your own words. Leave it blank if you're open to the developer's ideas."
              className="sm:col-span-2"
            >
              <textarea id="proposal" rows={3} value={form.proposal} onChange={onText("proposal")} placeholder="e.g. 6 units of apartments, 3 units of duplexes" className={inputClass} />
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

      <Section title="4. Photos and video" intro={`Up to ${MAX_PHOTOS} photos, plus ${VIDEO_LIMITS}. The first photo is the cover.`}>
        <DropZone
          {...dropOn("photos")}
          active={dragging === "photos"}
          invalid={Boolean(errors.images)}
          heading={
            videoProgress !== null
              ? "Checking your video…"
              : busy === "files"
                ? "Preparing files…"
                : "Drag photos or a video here"
          }
          note={
            videoProgress !== null
              ? "This only takes a moment."
              : "JPG or PNG photos (they get the JVA watermark) and one video."
          }
          progress={videoProgress}
          buttonLabel="Choose files"
          disabled={busy === "files" || (images.filter((url) => !isVideoUrl(url)).length >= MAX_PHOTOS && images.some(isVideoUrl))}
          onChoose={() => photoInput.current?.click()}
        />
        <input ref={photoInput} type="file" accept="image/*,video/*" multiple hidden onChange={(event) => addPhotos(event.target.files)} />
        {/* Videos are uploaded as recorded, so iPhone HEVC videos won't play everywhere. */}
        <p className="mt-3 flex gap-2.5 rounded-xl border border-gold/30 bg-gold-soft/40 px-4 py-3 text-sm text-ink">
          <FiInfo aria-hidden="true" className="mt-0.5 shrink-0 text-gold-deep" />
          <span>
            <strong className="font-semibold">Filming on an iPhone?</strong> Before recording, go to Settings → Camera → Formats and choose “Most Compatible”. Otherwise the video may not play in some browsers (Chrome on Windows, Firefox).
          </span>
        </p>
        {errors.images ? <p className="mt-2 text-xs font-medium text-red-700">{errors.images}</p> : null}
        {images.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((src, index) => (
              <li key={src.slice(-32) + index} className="relative overflow-hidden rounded-xl border border-line bg-ink">
                {isVideoUrl(src) ? (
                  <video src={src} controls muted playsInline preload="metadata" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`Photo ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                )}
                {isVideoUrl(src) ? (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[0.6875rem] font-bold text-gold">
                    <FiVideo aria-hidden="true" /> Video
                  </span>
                ) : index === 0 ? (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[0.6875rem] font-bold text-gold">
                    <FiStar aria-hidden="true" /> Cover
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    discardVideo(src);
                    setImages((current) => current.filter((_, i) => i !== index));
                  }}
                  aria-label={isVideoUrl(src) ? "Remove the video" : `Remove photo ${index + 1}`}
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
        intro={`Upload clear copies of the documents that prove ownership: the ${listInWords(documentsToUpload(form.titleDocument))}, plus any receipts. Only our verification team sees them.`}
      >
        <DropZone
          {...dropOn("documents")}
          active={dragging === "documents"}
          invalid={Boolean(errors.documents)}
          heading={busy === "files" ? "Preparing files…" : "Drag title documents here"}
          note={`PDF, DOC, JPG or PNG — up to ${MAX_DOCUMENT_MB} MB each, ${MAX_DOCUMENTS} files at most.`}
          buttonLabel="Choose documents"
          disabled={busy === "files" || documents.length >= MAX_DOCUMENTS}
          onChoose={() => documentInput.current?.click()}
        />
        <input ref={documentInput} type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*" multiple hidden onChange={(event) => addDocuments(event.target.files)} />
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
                    {doc.type === "application/pdf" ? "PDF" : doc.type.includes("word") ? "DOC" : "Image"} · {fileSize(doc.size)}
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

      {form.dealType === "sale" ? (
        <div className={cx("rounded-2xl border p-5", errors.acceptedSaleFee ? "border-red-300 bg-red-50/40" : "border-line")}>
          <p className="text-sm font-semibold text-ink">Facilitation fee terms</p>
          <p className="mt-1 text-sm text-muted">
            When your property sells through Joint Venture Assets, you pay a facilitation fee of{" "}
            <strong className="text-ink">{Math.round(sellerFeeRate * 10000) / 100}% of the agreed sale price</strong>, taken from the proceeds.
            {Number(form.price) > 0 ? ` On your asking price that's ${formatNaira(saleFee(Number(form.price)))}.` : ""}
          </p>
          <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.acceptedSaleFee}
              onChange={(event) => set("acceptedSaleFee", event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9a24a]"
            />
            I agree to pay the {Math.round(sellerFeeRate * 10000) / 100}% facilitation fee from the sale price when my property sells.
          </label>
          {errors.acceptedSaleFee ? <p className="mt-1.5 text-xs font-medium text-red-700">{errors.acceptedSaleFee}</p> : null}
        </div>
      ) : null}

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
          confirmingDelete ? (
            // Two steps, like deleting a listing in the admin: no browser confirm box.
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={discardDraft}
                disabled={busy !== null}
                className="rounded-full bg-red-700 px-4 py-2 text-xs font-bold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {busy === "delete" ? "Deleting…" : "Confirm delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={busy === "delete"}
                className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink hover:border-ink disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={busy !== null}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:underline disabled:opacity-50 sm:ml-auto"
            >
              <FiTrash2 aria-hidden="true" /> Delete draft
            </button>
          )
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
  progress = null,
  ...dropHandlers
}: {
  active: boolean;
  invalid: boolean;
  heading: string;
  note: string;
  /** 0–1 to show a progress bar, e.g. while a video is checked. */
  progress?: number | null;
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
      {progress !== null ? (
        <div className="mx-auto mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
      ) : null}
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

/** What the seller would receive: the asking price less JVA's facilitation fee. */
export function SellerFee({ price, rate = SALE_FEE_RATE }: { price: number; rate?: number }) {
  const fee = Math.round(price * rate);
  const percent = Math.round(rate * 10000) / 100;
  return (
    <div className="mt-6 rounded-2xl bg-ivory p-5">
      <p className="eyebrow text-gold-deep">What you&apos;d receive</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Asking price</dt>
          <dd className="font-semibold text-ink tabular-nums">{price ? formatNaira(price) : "Enter a price"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">JVA facilitation fee ({percent}%)</dt>
          <dd className="font-semibold text-ink tabular-nums">{price ? `- ${formatNaira(fee)}` : ""}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-line pt-1.5">
          <dt className="font-semibold text-ink">You&apos;d receive</dt>
          <dd className="font-bold text-ink tabular-nums">{price ? formatNaira(price - fee) : ""}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted">
        Worked out on your asking price. The fee is {percent}% of the final agreed price, paid from the proceeds when the sale completes.
      </p>
    </div>
  );
}
