"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiFileText, FiUploadCloud, FiX } from "react-icons/fi";
import { createRequest } from "@/lib/api/requests";
import { errorMessage } from "@/lib/api/mock";
import { useAppSelector } from "@/hooks/hooks";
import { PageHero } from "@/components/ui/PageHero";
import { Alert, Field, MoneyInput, Select, SubmitButton, YesNo, inputClass, type YesNoValue } from "@/components/ui/form";
import { requestTypeHint, requestTypeLabel } from "@/components/requests/StatusBadge";
import { cx } from "@/lib/format";
import type { RequestType } from "@/types";

const developmentTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "agricultural", label: "Agricultural" },
];

const partnershipTypes = [
  { value: "mandate", label: "Mandate" },
  { value: "lawyer", label: "Lawyer" },
  { value: "property_consultant", label: "Property consultant" },
  { value: "building_expert", label: "Building expert" },
];

const housingProposals = [
  { value: "apartment", label: "Apartment" },
  { value: "duplex", label: "Duplex" },
  { value: "maisonette", label: "Maisonette" },
  { value: "bungalows", label: "Bungalows" },
  { value: "condos", label: "Condos" },
];

const titleDocuments = [
  { value: "c_of_o", label: "C of O" },
  { value: "governors_consent", label: "Governor's Consent" },
  { value: "deed_of_assignment", label: "Deed of Assignment" },
  { value: "excision", label: "Excision" },
  { value: "gazzette", label: "Gazette" },
];

const propertiesWanted = ["Land", "Residential", "Commercial", "Mixed use", "Agricultural"];

const paymentMethods = ["Outright payment", "Instalments", "Mortgage", "Not sure yet"];

/**
 * The three choices on the form. "Land & property" covers both sides of a
 * sale: offering land (requestType "land") or wanting to buy ("purchase").
 */
const kinds: Array<{ key: string; label: string; hint: string; types: RequestType[] }> = [
  { key: "property", label: "Land & property", hint: "Offer land or property, or ask to buy some.", types: ["land", "purchase"] },
  { key: "development", label: requestTypeLabel.development, hint: requestTypeHint.development, types: ["development"] },
  { key: "partnership", label: requestTypeLabel.partnership, hint: requestTypeHint.partnership, types: ["partnership"] },
];

const sharingFormulas = [
  { value: "50_50", label: "50% / 50%" },
  { value: "60_40", label: "60% / 40%" },
  { value: "70_30", label: "70% / 30%" },
];

const MAX_FILE_MB = 10;

interface FormState {
  fullName: string;
  email: string;
  phoneNumber: string;
  requestType: RequestType;
  location: string;
  budget: string;
  timeline: string;
  description: string;
  title: string;
  developmentType: string;
  partnershipType: string;
  landSize: string;
  landValue: string;
  housingProposal: string;
  titleDocument: string;
  sharingFormula: string;
  sharingNegotiable: YesNoValue;
  hasPremium: YesNoValue;
  /** Digits only. */
  premium: string;
  propertyWanted: string;
  paymentMethod: string;
  files: File[];
}

export default function SubmitRequestPage() {
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<FormState>({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phoneNumber: "",
    requestType: "land",
    location: "",
    budget: "",
    timeline: "",
    description: "",
    title: "",
    developmentType: "",
    partnershipType: "",
    landSize: "",
    landValue: "",
    housingProposal: "",
    titleDocument: "",
    sharingFormula: "",
    sharingNegotiable: "",
    hasPremium: "",
    premium: "",
    propertyWanted: "",
    paymentMethod: "",
    files: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.filter((file) => file.size > MAX_FILE_MB * 1024 * 1024);
    setError(tooBig.length ? `${tooBig.map((f) => f.name).join(", ")} ${tooBig.length === 1 ? "is" : "are"} over ${MAX_FILE_MB} MB.` : "");
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...incoming.filter((file) => !tooBig.includes(file))] }));
    if (fileInput.current) fileInput.current.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const setValue = <K extends keyof FormState>(key: K, value: FormState[K]) => setFormData((prev) => ({ ...prev, [key]: value }));

  const removeFile = (index: number) => {
    setFormData((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Only send the fields that belong to the chosen request type, as the real API expects.
    const isLand = formData.requestType === "land";
    if (isLand && (!formData.sharingNegotiable || !formData.hasPremium)) {
      setError("Say whether the sharing formula is negotiable and whether there's a premium.");
      return;
    }
    if (isLand && formData.hasPremium === "yes" && !(Number(formData.premium) > 0)) {
      setError("Enter the premium amount.");
      return;
    }
    const submitData = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      requestType: formData.requestType,
      location: formData.location,
      budget: formData.budget,
      timeline: formData.timeline,
      description: formData.description,
      title: formData.title,
      landSize: isLand ? formData.landSize : undefined,
      landValue: isLand ? formData.landValue : undefined,
      housingProposal: isLand ? formData.housingProposal : undefined,
      titleDocument: isLand ? formData.titleDocument : undefined,
      sharingFormula: isLand ? formData.sharingFormula : undefined,
      sharingNegotiable: isLand ? formData.sharingNegotiable === "yes" : undefined,
      premium: isLand ? (formData.hasPremium === "yes" ? Number(formData.premium) : 0) : undefined,
      developmentType: formData.requestType === "development" ? formData.developmentType : undefined,
      partnershipType: formData.requestType === "partnership" ? formData.partnershipType : undefined,
      propertyWanted: formData.requestType === "purchase" ? formData.propertyWanted : undefined,
      paymentMethod: formData.requestType === "purchase" ? formData.paymentMethod : undefined,
      files: formData.files,
    };

    try {
      setIsSubmitting(true);
      setError("");
      await createRequest(token, submitData);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      setError(errorMessage(error, "Something went wrong. Please try again."));
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
            Thank you. Our team will review it within 24–48 hours and start sourcing. Once approved, members can see it and send enquiries. Follow its status on your dashboard.
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
        title="Didn't find what you want? Post a request"
        intro="Tell us exactly what you're looking for, or what you have to offer. Our team sources it for you, and once it's approved, members on the platform can see your request and send enquiries."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8">
        {!isAuthenticated ? (
          <div className="rounded-2xl border border-line bg-ivory p-8 text-center lg:col-span-2">
            <h2 className="font-display text-2xl text-ink">Log in to submit a request</h2>
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
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="font-display text-2xl text-ink">1. What kind of request?</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Request type">
                {kinds.map((kind) => {
                  const active = kind.types.includes(formData.requestType);
                  return (
                    <button
                      key={kind.key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => !active && setFormData((prev) => ({ ...prev, requestType: kind.types[0]! }))}
                      className={cx(
                        "rounded-2xl border p-5 text-left transition",
                        active ? "border-gold bg-gold-soft/40 ring-2 ring-gold/30" : "border-line bg-white hover:border-gray-400",
                      )}
                    >
                      <span className="font-bold text-ink">{kind.label}</span>
                      <span className="mt-1 block text-sm text-muted">{kind.hint}</span>
                    </button>
                  );
                })}
              </div>

              {formData.requestType === "land" || formData.requestType === "purchase" ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Offering or buying">
                  {([
                    ["land", "I have land or property to offer", "For a joint venture or a sale."],
                    ["purchase", "I want to buy", "Tell us what you're looking for and your budget."],
                  ] as const).map(([type, label, hint]) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white px-4 py-3 has-checked:border-gold has-checked:bg-gold-soft/40"
                    >
                      <input
                        type="radio"
                        name="landIntent"
                        checked={formData.requestType === type}
                        onChange={() => setFormData((prev) => ({ ...prev, requestType: type }))}
                        className="mt-1 accent-[#c9a24a]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-ink">{label}</span>
                        <span className="block text-xs text-muted">{hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-line p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">2. About the request</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Title" htmlFor="title" className="sm:col-span-2" hint="A short headline, like a listing title.">
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={formData.requestType === "purchase" ? "e.g. Looking for a 4-bedroom duplex in Lekki" : "e.g. 3-bedroom duplex JV in Lekki"}
                  />
                </Field>

                {formData.requestType === "development" ? (
                  <Field label="Development type" htmlFor="developmentType">
                    <Select id="developmentType" name="developmentType" value={formData.developmentType} onChange={handleChange} options={developmentTypes} placeholder="Select development type" />
                  </Field>
                ) : null}
                {formData.requestType === "purchase" ? (
                  <>
                    <Field label="What do you want to buy?" htmlFor="propertyWanted">
                      <Select id="propertyWanted" name="propertyWanted" value={formData.propertyWanted} onChange={handleChange} options={propertiesWanted} placeholder="Select property type" />
                    </Field>
                    <Field label="How will you pay?" htmlFor="paymentMethod">
                      <Select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} options={paymentMethods} placeholder="Select payment method" />
                    </Field>
                  </>
                ) : null}
                {formData.requestType === "partnership" ? (
                  <Field label="Who are you looking for?" htmlFor="partnershipType">
                    <Select id="partnershipType" name="partnershipType" value={formData.partnershipType} onChange={handleChange} options={partnershipTypes} placeholder="Select partnership type" />
                  </Field>
                ) : null}

                <Field label={formData.requestType === "purchase" ? "Preferred location" : "Location"} htmlFor="location">
                  <input id="location" name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="Area, city and state" />
                </Field>
                <Field label={formData.requestType === "land" ? "Asking value (₦)" : "Budget (₦)"} htmlFor="budget">
                  <MoneyInput id="budget" name="budget" value={formData.budget} onChange={(value) => setValue("budget", value)} placeholder="e.g. 500,000,000" />
                </Field>
                <Field label={formData.requestType === "purchase" ? "When do you want to buy?" : "Timeline"} htmlFor="timeline">
                  <input
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={formData.requestType === "purchase" ? "e.g. within 3 months" : "e.g. 18 months"}
                  />
                </Field>

                {formData.requestType === "land" ? (
                  <>
                    <Field label="Land size" htmlFor="landSize">
                      <input id="landSize" name="landSize" value={formData.landSize} onChange={handleChange} className={inputClass} placeholder="e.g. 600 sqm" />
                    </Field>
                    <Field label="Land value (₦)" htmlFor="landValue">
                      <MoneyInput id="landValue" name="landValue" value={formData.landValue} onChange={(value) => setValue("landValue", value)} placeholder="e.g. 100,000,000" />
                    </Field>
                    <Field label="Title document" htmlFor="titleDocument">
                      <Select id="titleDocument" name="titleDocument" value={formData.titleDocument} onChange={handleChange} options={titleDocuments} placeholder="Select document type" />
                    </Field>
                    <Field label="What could be built?" htmlFor="housingProposal">
                      <Select id="housingProposal" name="housingProposal" value={formData.housingProposal} onChange={handleChange} options={housingProposals} placeholder="Select proposal" />
                    </Field>
                    <Field label="Sharing formula" htmlFor="sharingFormula" hint="Landowner / developer">
                      <Select id="sharingFormula" name="sharingFormula" value={formData.sharingFormula} onChange={handleChange} options={sharingFormulas} placeholder="Select sharing formula" />
                    </Field>
                    <YesNo
                      name="sharingNegotiable"
                      legend="Is the sharing formula negotiable?"
                      value={formData.sharingNegotiable}
                      onChange={(value) => setValue("sharingNegotiable", value)}
                      yes="Negotiable"
                      no="Fixed"
                    />
                    <YesNo
                      name="hasPremium"
                      legend="Is there a premium?"
                      value={formData.hasPremium}
                      onChange={(value) => setValue("hasPremium", value)}
                      yes="Yes"
                      no="No premium"
                      hint="An upfront payment from the developer to the landowner."
                    />
                    {formData.hasPremium === "yes" ? (
                      <Field label="Premium amount (₦)" htmlFor="premium" required>
                        <MoneyInput id="premium" value={formData.premium} onChange={(value) => setValue("premium", value)} placeholder="e.g. 25,000,000" />
                      </Field>
                    ) : null}
                  </>
                ) : null}

                <Field label="Description" htmlFor="description" required className="sm:col-span-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={
                      formData.requestType === "purchase"
                        ? "Describe what you're looking for: size, number of rooms, must-haves, anything you'd rule out."
                        : "Tell us about the land, project or opportunity, and what you'd like from a partner."
                    }
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-line p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">3. Your contact details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" htmlFor="fullName" required>
                  <input id="fullName" name="fullName" autoComplete="name" required value={formData.fullName} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Email" htmlFor="email" required>
                  <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Phone number" htmlFor="phoneNumber">
                  <input id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel" value={formData.phoneNumber} onChange={handleChange} className={inputClass} placeholder="+234" />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-line p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">4. Supporting documents</h2>
              <p className="mt-1 text-sm text-muted">Optional. Title documents, survey plans or photos help us review faster.</p>
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
              {formData.files.length ? (
                <ul className="mt-4 space-y-2">
                  {formData.files.map((file, index) => (
                    <li key={file.name + index} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm">
                      <FiFileText aria-hidden="true" className="shrink-0 text-gold-deep" />
                      <span className="min-w-0 flex-1 truncate text-ink">{file.name}</span>
                      <span className="shrink-0 text-xs text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`} className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700">
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
                Submit request <FiArrowRight aria-hidden="true" />
              </SubmitButton>
            </div>
          </form>
        )}

        {isAuthenticated ? (
          <aside className="self-start rounded-2xl bg-ink p-7 text-white lg:sticky lg:top-28">
            <p className="eyebrow text-gold">What happens next</p>
            <ol className="mt-5 space-y-5 text-sm">
              {[
                ["We review it", "Our team checks the details and any documents within 24–48 hours."],
                ["We source it", "We search our network of landowners, developers and investors for a match."],
                ["Members respond", "Approved requests appear on Browse requests, where members can send enquiries. We make the introduction."],
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
