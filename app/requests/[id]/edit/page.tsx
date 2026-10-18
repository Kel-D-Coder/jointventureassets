"use client"

import Link from "next/link"
import { useRef, useState, useEffect, type ChangeEvent, type DragEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { FiArrowLeft, FiFileText, FiUploadCloud, FiX } from "react-icons/fi"
import { RootState } from "@/store/store"
import { getRequest, updateRequest } from "@/lib/api/requests"
import { errorMessage } from "@/lib/api/errors"
import { Alert, Field, SubmitButton, inputClass } from "@/components/ui/form"
import { RequestBriefFields } from "@/components/requests/RequestBriefFields"
import { briefFromRequest, briefPayload, briefProblem, requestSummary, requestTypeLabel, type Brief } from "@/lib/requests"
import type { RequestType } from "@/types"

const MAX_FILE_MB = 10

interface EditState {
  brief: Brief
  /** Everything in the description after the brief's own summary sentence. */
  notes: string
  fullName: string
  email: string
  phoneNumber: string
  existingDocs: string[]
  newFiles: File[]
}

export default function EditRequestPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth)

  const [requestType, setRequestType] = useState<RequestType | "">("")
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
        const summary = requestSummary(data)
        const description = data.description ?? ""
        setRequestType(data.requestType ?? "")
        setForm({
          brief: briefFromRequest(data),
          notes: description.startsWith(summary) ? description.slice(summary.length).trim() : description,
          fullName: data.fullName ?? "",
          email: data.email ?? "",
          phoneNumber: data.phoneNumber ?? "",
          existingDocs: data.documents ?? [],
          newFiles: [],
        })
      })
      .catch((err) => setError(errorMessage(err, "Couldn't load the request.")))
      .finally(() => setIsLoading(false))
  }, [id, token])

  const set = <K extends keyof EditState>(key: K, value: EditState[K]) =>
    setForm((prev) => prev ? { ...prev, [key]: value } : prev)

  const onContact = (e: ChangeEvent<HTMLInputElement>) =>
    set(e.target.name as "fullName" | "email" | "phoneNumber", e.target.value)

  const addFiles = (list: FileList | null) => {
    if (!list || !form) return
    const incoming = Array.from(list)
    const tooBig = incoming.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024)
    if (tooBig.length) setError(`${tooBig.map((f) => f.name).join(", ")} ${tooBig.length === 1 ? "is" : "are"} over ${MAX_FILE_MB} MB.`)
    set("newFiles", [...form.newFiles, ...incoming.filter((f) => !tooBig.includes(f))])
    if (fileInput.current) fileInput.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form || !requestType) return
    setError(null)
    setSuccess(null)

    const problem = briefProblem(requestType, form.brief)
    if (problem) {
      setError(problem)
      return
    }
    const fields = briefPayload(requestType, form.brief)

    try {
      setIsSubmitting(true)
      await updateRequest(token, String(id), {
        ...fields,
        description: [requestSummary(fields), form.notes.trim()].filter(Boolean).join("\n\n"),
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
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

  return (
    <main className="bg-ivory px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href={`/requests/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <FiArrowLeft aria-hidden="true" /> Back to request
        </Link>

        <div className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-10">
          <p className="eyebrow text-gold-deep">Edit request</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Update your brief</h1>
          <p className="mt-2 text-sm text-muted">Changes are visible to our team straight away.</p>

          {isLoading ? (
            <div className="mt-8 space-y-4" aria-busy="true">
              {[1, 2, 3, 4].map((n) => <div key={n} className="h-12 animate-pulse rounded-xl bg-ivory" />)}
            </div>
          ) : !form || !requestType ? (
            <Alert tone="error" className="mt-8">{error ?? "Request not found."}</Alert>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Looking for:</span>
                <span className="rounded-full bg-ivory px-3 py-1 text-sm font-semibold text-ink">
                  {requestTypeLabel[requestType] ?? requestType}
                </span>
              </div>

              <section className="rounded-2xl border border-line p-6">
                <h2 className="font-display text-xl text-ink">Your brief</h2>
                <div className="mt-5">
                  <RequestBriefFields type={requestType} value={form.brief} onChange={(brief) => set("brief", brief)} />
                </div>
                <Field label="Anything else we should know?" htmlFor="notes" hint="Optional." className="mt-5">
                  <textarea id="notes" rows={4} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} />
                </Field>
              </section>

              <section className="rounded-2xl border border-line p-6">
                <h2 className="font-display text-xl text-ink">Contact details</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="fullName">
                    <input id="fullName" name="fullName" value={form.fullName} onChange={onContact} className={inputClass} />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <input id="email" name="email" type="email" value={form.email} onChange={onContact} className={inputClass} />
                  </Field>
                  <Field label="Phone number" htmlFor="phoneNumber">
                    <input id="phoneNumber" name="phoneNumber" type="tel" value={form.phoneNumber} onChange={onContact} className={inputClass} placeholder="+234" />
                  </Field>
                </div>
              </section>

              <section className="rounded-2xl border border-line p-6">
                <h2 className="font-display text-xl text-ink">Attachments</h2>

                {form.existingDocs.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {form.existingDocs.map((url) => {
                      const name = url.split("/").pop() ?? url
                      return (
                        <li key={url} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm">
                          <FiFileText aria-hidden="true" className="shrink-0 text-gold-deep" />
                          <span className="min-w-0 flex-1 truncate text-ink">{name}</span>
                          <button
                            type="button"
                            onClick={() => set("existingDocs", form.existingDocs.filter((d) => d !== url))}
                            aria-label={`Remove ${name}`}
                            className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                          >
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
                  <p className="mt-2 text-sm font-semibold text-ink">Add more files</p>
                  <p className="mt-1 text-xs text-muted">PDF, DOC, JPG or PNG, up to {MAX_FILE_MB} MB each</p>
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
                        <button
                          type="button"
                          onClick={() => set("newFiles", form.newFiles.filter((_, i) => i !== index))}
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
