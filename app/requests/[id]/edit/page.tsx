"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { FiArrowLeft } from "react-icons/fi"
import { RootState } from "@/store/store"
import { getRequest, updateRequest } from "@/lib/api/requests"
import { errorMessage } from "@/lib/api/mock"
import { Alert, Field, SubmitButton, inputClass } from "@/components/ui/form"

export default function EditRequestPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !token) {
      setIsLoading(false)
      return
    }
    getRequest(token, String(id))
      .then((data) => {
        setTitle(data.title)
        setDescription(data.description)
      })
      .catch((err) => setError(errorMessage(err, "Something went wrong while loading the request.")))
      .finally(() => setIsLoading(false))
  }, [id, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      setIsSubmitting(true)
      await updateRequest(token, String(id), { title, description })
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
          <h1 className="mt-2 font-display text-3xl text-ink">Update the details</h1>
          <p className="mt-2 text-sm text-muted">Changes are visible to our team straight away.</p>

          {isLoading ? (
            <div className="mt-8 space-y-4" aria-busy="true">
              <div className="h-12 animate-pulse rounded-xl bg-ivory" />
              <div className="h-40 animate-pulse rounded-xl bg-ivory" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Field label="Title" htmlFor="title" required>
                <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Description" htmlFor="description" required>
                <textarea id="description" rows={8} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} required />
              </Field>

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
