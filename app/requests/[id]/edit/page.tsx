"use client"

import Link from "next/link"
import { useRef, useState, useEffect, type ChangeEvent, type DragEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { FiArrowLeft, FiFileText, FiUploadCloud, FiX } from "react-icons/fi"
import { RootState } from "@/store/store"
import { getRequest, updateRequest } from "@/lib/api/requests"
import { errorMessage } from "@/lib/api/mock"
import { Alert, Field, MoneyInput, Select, SubmitButton, YesNo, inputClass, type YesNoValue } from "@/components/ui/form"
import { requestTypeLabel } from "@/components/requests/StatusBadge"
import type { PartnerRequest } from "@/types"

const developmentTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "agricultural", label: "Agricultural" },
]

const partnershipTypes = [
  { value: "mandate", label: "Mandate" },
  { value: "lawyer", label: "Lawyer" },
  { value: "property_consultant", label: "Property consultant" },
  { value: "building_expert", label: "Building expert" },
]

const housingProposals = [
  { value: "apartment", label: "Apartment" },
  { value: "duplex", label: "Duplex" },
  { value: "maisonette", label: "Maisonette" },
  { value: "bungalows", label: "Bungalows" },
  { value: "condos", label: "Condos" },
]

const titleDocuments = [
  { value: "c_of_o", label: "C of O" },
  { value: "governors_consent", label: "Governor's Consent" },
  { value: "deed_of_assignment", label: "Deed of Assignment" },
  { value: "excision", label: "Excision" },
  { value: "gazzette", label: "Gazette" },
]

const sharingFormulas = [
  { value: "50_50", label: "50% / 50%" },
  { value: "60_40", label: "60% / 40%" },
  { value: "70_30", label: "70% / 30%" },
]

const propertiesWanted = ["Land", "Residential", "Commercial", "Mixed use", "Agricultural"]
const paymentMethods = ["Outright payment", "Instalments", "Mortgage", "Not sure yet"]

const MAX_FILE_MB = 10

interface EditState {
  title: string
  description: string
  location: string
  budget: string
  timeline: string
  fullName: string
  email: string
  phoneNumber: string
  developmentType: string
  partnershipType: string
  landSize: string
  landValue: string
  housingProposal: string
  titleDocument: string
  sharingFormula: string
  sharingNegotiable: YesNoValue
  hasPremium: YesNoValue
  premium: string
  propertyWanted: string
  paymentMethod: string
  existingDocs: string[]
  newFiles: File[]
}

function fromRequest(r: PartnerRequest): EditState {
  return {
    title: r.title ?? "",
    description: r.description ?? "",
    location: r.location ?? "",
    budget: r.budget ?? "",
    timeline: r.timeline ?? "",
    fullName: r.fullName ?? "",
    email: r.email ?? "",
    phoneNumber: r.phoneNumber ?? "",
    developmentType: r.developmentType ?? "",
    partnershipType: r.partnershipType ?? "",
    landSize: r.landSize ?? "",
    landValue: r.landValue ?? "",
    housingProposal: r.housingProposal ?? "",
    titleDocument: r.titleDocument ?? "",
    sharingFormula: r.sharingFormula ?? "",
    sharingNegotiable: r.sharingNegotiable === true ? "yes" : r.sharingNegotiable === false ? "no" : "",
    hasPremium: (r.premium ?? 0) > 0 ? "yes" : r.premium === 0 ? "no" : "",
    premium: r.premium ? String(r.premium) : "",
    propertyWanted: r.propertyWanted ?? "",
    paymentMethod: r.paymentMethod ?? "",
    existingDocs: r.documents ?? [],
    newFiles: [],
  }
}

export default function EditRequestPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth)

  const [requestType, setRequestType] = useState("")
  const [form, setForm] = useState<EditState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id || !token) { setIsLoading(false); return }
    getRequest(token, String(id))
      .then((data) => {
        setRequestType(data.requestType ?? "")
        setForm(fromRequest(data))
      })
      .catch((err) => setError(errorMessage(err, "Couldn't load the request.")))
      .finally(() => setIsLoading(false))
  }, [id, token])

  const set = <K extends keyof EditState>(key: K, value: EditState[K]) =>
    setForm((prev) => prev ? { ...prev, [key]: value } : prev)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(e.target.name as keyof EditState, e.target.value as EditState[keyof EditState])

  const addFiles = (list: FileList | null) => {
    if (!list || !form) return
    const incoming = Array.from(list)
    const tooBig = incoming.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024)
    if (tooBig.length) setError(`${tooBig.map((f) => f.name).join(", ")} ${tooBig.length === 1 ? "is" : "are"} over ${MAX_FILE_MB} MB.`)
    set("newFiles", [...form.newFiles, ...incoming.filter((f) => !tooBig.includes(f))])
    if (fileInput.current) fileInput.current.value = ""
  }

  const removeExistingDoc = (url: string) =>
    setForm((prev) => prev ? { ...prev, existingDocs: prev.existingDocs.filter((d) => d !== url) } : prev)

  const removeNewFile = (index: number) =>
    setForm((prev) => prev ? { ...prev, newFiles: prev.newFiles.filter((_, i) => i !== index) } : prev)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError(null)
    setSuccess(null)

    const isLand = requestType === "land"
    if (isLand && !form.sharingNegotiable) {
      setError("Say whether the sharing formula is negotiable.")
      return
    }
    if (isLand && !form.hasPremium) {
      setError("Say whether there is a premium.")
      return
    }
    if (isLand && form.hasPremium === "yes" && !(Number(form.premium) > 0)) {
      setError("Enter the premium amount.")
      return
    }

    try {
      setIsSubmitting(true)
      await updateRequest(token, String(id), {
        title: form.title,
        description: form.description,
        location: form.location,
        budget: form.budget,
        timeline: form.timeline,
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        ...(requestType === "development" ? { developmentType: form.developmentType } : {}),
        ...(requestType === "partnership" ? { partnershipType: form.partnershipType } : {}),
        ...(requestType === "purchase" ? { propertyWanted: form.propertyWanted, paymentMethod: form.paymentMethod } : {}),
        ...(isLand ? {
          landSize: form.landSize,
          landValue: form.landValue,
          housingProposal: form.housingProposal,
          titleDocument: form.titleDocument,
          sharingFormula: form.sharingFormula,
          sharingNegotiable: form.sharingNegotiable === "yes",
          premium: form.hasPremium === "yes" ? Number(form.premium) : 0,
        } : {}),
        documents: form.existingDocs,
        newFiles: form.newFiles,
      })
      setSuccess("Request updated.")
      setTimeout(() => router.push(`/requests/${id}`), 800)
    } catch (err: unknown) {
      setError(errorMessage(err, "Something went wrong while updating the request."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLand = requestType === "land"
  const isPurchase = requestType === "purchase"
  const isDevelopment = requestType === "development"
  const isPartnership = requestType === "partnership"

  return (
    <main className="bg-ivory px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href={`/requests/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <FiArrowLeft aria-hidden="true" /> Back to request
        </Link>

        <div className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-10">
          <p className="eyebrow text-gold-deep">Edit request</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Update the details</h1>
          <p className="mt-2 text-sm text-muted">Changes are visible to our team straight away.</p>

          {isLoading ? (
            <div className="mt-8 space-y-4" aria-busy="true">
              {[1, 2, 3, 4].map((n) => <div key={n} className="h-12 animate-pulse rounded-xl bg-ivory" />)}
            </div>
          ) : !form ? (
            <Alert tone="error" className="mt-8">{error ?? "Request not found."}</Alert>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-8">

              {/* Request type badge */}
              {requestType ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted">Request type:</span>
                  <span className="rounded-full bg-ivory px-3 py-1 text-sm font-semibold text-ink capitalize">
                    {requestTypeLabel[requestType as keyof typeof requestTypeLabel] ?? requestType}
                  </span>
                </div>
              ) : null}

              {/* About the request */}
              <section className="rounded-2xl border border-line p-6">
                <h2 className="font-display text-xl text-ink">About the request</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field label="Title" htmlFor="title" className="sm:col-span-2">
                    <input id="title" name="title" value={form.title} onChange={handleChange} className={inputClass} />
                  </Field>

                  {isDevelopment ? (
                    <Field label="Development type" htmlFor="developmentType">
                      <Select id="developmentType" name="developmentType" value={form.developmentType} onChange={handleChange} options={developmentTypes} placeholder="Select development type" />
                    </Field>
                  ) : null}

                  {isPurchase ? (
                    <>
                      <Field label="What do you want to buy?" htmlFor="propertyWanted">
                        <Select id="propertyWanted" name="propertyWanted" value={form.propertyWanted} onChange={handleChange} options={propertiesWanted} placeholder="Select property type" />
                      </Field>
                      <Field label="How will you pay?" htmlFor="paymentMethod">
                        <Select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} options={paymentMethods} placeholder="Select payment method" />
                      </Field>
                    </>
                  ) : null}

                  {isPartnership ? (
                    <Field label="Who are you looking for?" htmlFor="partnershipType">
                      <Select id="partnershipType" name="partnershipType" value={form.partnershipType} onChange={handleChange} options={partnershipTypes} placeholder="Select partnership type" />
                    </Field>
                  ) : null}

                  <Field label={isPurchase ? "Preferred location" : "Location"} htmlFor="location">
                    <input id="location" name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Area, city and state" />
                  </Field>
                  <Field label={isLand ? "Asking value (₦)" : "Budget (₦)"} htmlFor="budget">
                    <MoneyInput id="budget" name="budget" value={form.budget} onChange={(v) => set("budget", v)} placeholder="e.g. 500,000,000" />
                  </Field>
                  <Field label={isPurchase ? "When do you want to buy?" : "Timeline"} htmlFor="timeline">
                    <input id="timeline" name="timeline" value={form.timeline} onChange={handleChange} className={inputClass} placeholder="e.g. 18 months" />
                  </Field>

                  {isLand ? (
                    <>
                      <Field label="Land size" htmlFor="landSize">
                        <input id="landSize" name="landSize" value={form.landSize} onChange={handleChange} className={inputClass} placeholder="e.g. 600 sqm" />
                      </Field>
                      <Field label="Land value (₦)" htmlFor="landValue">
                        <MoneyInput id="landValue" name="landValue" value={form.landValue} onChange={(v) => set("landValue", v)} placeholder="e.g. 100,000,000" />
                      </Field>
                      <Field label="Title document" htmlFor="titleDocument">
                        <Select id="titleDocument" name="titleDocument" value={form.titleDocument} onChange={handleChange} options={titleDocuments} placeholder="Select document type" />
                      </Field>
                      <Field label="What could be built?" htmlFor="housingProposal">
                        <Select id="housingProposal" name="housingProposal" value={form.housingProposal} onChange={handleChange} options={housingProposals} placeholder="Select proposal" />
                      </Field>
                      <Field label="Sharing formula" htmlFor="sharingFormula" hint="Landowner / developer">
                        <Select id="sharingFormula" name="sharingFormula" value={form.sharingFormula} onChange={handleChange} options={sharingFormulas} placeholder="Select sharing formula" />
                      </Field>
                      <YesNo
                        name="sharingNegotiable"
                        legend="Is the sharing formula negotiable?"
                        value={form.sharingNegotiable}
                        onChange={(v) => set("sharingNegotiable", v)}
                        yes="Negotiable"
                        no="Fixed"
                      />
                      <YesNo
                        name="hasPremium"
                        legend="Is there a premium?"
                        value={form.hasPremium}
                        onChange={(v) => set("hasPremium", v)}
                        yes="Yes"
                        no="No premium"
                        hint="An upfront payment from the developer to the landowner."
                      />
                      {form.hasPremium === "yes" ? (
                        <Field label="Premium amount (₦)" htmlFor="premium" required>
                          <MoneyInput id="premium" value={form.premium} onChange={(v) => set("premium", v)} placeholder="e.g. 25,000,000" />
                        </Field>
                      ) : null}
                    </>
                  ) : null}

                  <Field label="Description" htmlFor="description" required className="sm:col-span-2">
                    <textarea id="description" name="description" rows={6} required value={form.description} onChange={handleChange} className={inputClass} />
                  </Field>
                </div>
              </section>

              {/* Contact details */}
              <section className="rounded-2xl border border-line p-6">
                <h2 className="font-display text-xl text-ink">Contact details</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="fullName">
                    <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
                  </Field>
                  <Field label="Phone number" htmlFor="phoneNumber">
                    <input id="phoneNumber" name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} className={inputClass} placeholder="+234" />
                  </Field>
                </div>
              </section>

              {/* Documents */}
              <section className="rounded-2xl border border-line p-6">
                <h2 className="font-display text-xl text-ink">Supporting documents</h2>

                {form.existingDocs.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {form.existingDocs.map((url) => {
                      const name = url.split("/").pop() ?? url
                      return (
                        <li key={url} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm">
                          <FiFileText aria-hidden="true" className="shrink-0 text-gold-deep" />
                          <span className="min-w-0 flex-1 truncate text-ink">{name}</span>
                          <button type="button" onClick={() => removeExistingDoc(url)} aria-label={`Remove ${name}`} className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700">
                            <FiX aria-hidden="true" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                  className={`mt-4 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${dragging ? "border-gold bg-gold-soft/40" : "border-line"}`}
                >
                  <FiUploadCloud aria-hidden="true" className="mx-auto h-7 w-7 text-gold-deep" />
                  <p className="mt-2 text-sm font-semibold text-ink">Add more documents</p>
                  <p className="mt-1 text-xs text-muted">PDF, DOC, JPG or PNG — up to {MAX_FILE_MB} MB each</p>
                  <button type="button" onClick={() => fileInput.current?.click()} className="mt-3 rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-ink hover:border-ink">
                    Choose files
                  </button>
                  <input ref={fileInput} type="file" multiple hidden accept=".pdf,.doc,.docx,image/*" onChange={(e) => addFiles(e.target.files)} />
                </div>

                {form.newFiles.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {form.newFiles.map((file, index) => (
                      <li key={file.name + index} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm">
                        <FiFileText aria-hidden="true" className="shrink-0 text-gold-deep" />
                        <span className="min-w-0 flex-1 truncate text-ink">{file.name}</span>
                        <span className="shrink-0 text-xs text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                        <button type="button" onClick={() => removeNewFile(index)} aria-label={`Remove ${file.name}`} className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700">
                          <FiX aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              {error ? <Alert tone="error">{error}</Alert> : null}
              {success ? <Alert tone="success">{success}</Alert> : null}

              <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
                <Link href={`/requests/${id}`} className="rounded-xl border border-line px-6 py-3.5 text-center text-sm font-semibold text-ink hover:border-ink">
                  Cancel
                </Link>
                <div className="sm:w-48">
                  <SubmitButton loading={isSubmitting} loadingText="Saving…">
                    Save changes
                  </SubmitButton>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
