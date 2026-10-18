"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { useSelector } from "react-redux"
import { FiArrowLeft, FiEdit2, FiFileText, FiTrash2 } from "react-icons/fi"
import { RootState } from "@/store/store"
import { deleteRequest, getRequest } from "@/lib/api/requests"
import { errorMessage } from "@/lib/api/errors"
import { Alert } from "@/components/ui/form"
import { StatusBadge, formatBudget, humanise, requestTypeLabel } from "@/components/requests/StatusBadge"
import {
  developmentTypes,
  housingProposals,
  jvPropertyKinds,
  labelOf,
  partnershipTypes,
  propertiesWanted,
  requestSummary,
  sharingFormulas,
  titleDocuments,
} from "@/lib/requests"
import type { PartnerRequest } from "@/types"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })

const statusMessage = {
  pending: "Our team is reviewing your request. We usually reply within 24–48 hours.",
  accepted: "Your request has been accepted. Our team will contact you about suitable partners.",
  rejected: "Your request wasn't accepted this time. Contact us to find out why, or edit and resubmit it.",
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="eyebrow text-muted">{label}</dt>
      <dd className="mt-1.5 font-semibold text-ink">{children}</dd>
    </div>
  )
}

export default function RequestDetails() {
  const { id } = useParams()
  const router = useRouter()
  const [request, setRequest] = useState<PartnerRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!id || !token) {
      setIsLoading(false)
      return
    }
    getRequest(token, String(id))
      .then(setRequest)
      .catch((err) => setError(errorMessage(err, "Failed to load request details. Please try again later.")))
      .finally(() => setIsLoading(false))
  }, [id, token])

  const handleDeleteRequest = async () => {
    try {
      setError(null)
      setIsDeleting(true)
      await deleteRequest(token, String(id))
      router.push("/dashboard")
    } catch (err: unknown) {
      setError(errorMessage(err, "Something went wrong. Please try again."))
      setIsDeleting(false)
      setConfirmDelete(false)
    }
  }

  const back = (
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
      <FiArrowLeft aria-hidden="true" /> My dashboard
    </Link>
  )

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {back}
        <div className="mt-8 space-y-4" aria-busy="true">
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-ivory" />
          <div className="h-64 animate-pulse rounded-2xl bg-ivory" />
        </div>
      </main>
    )
  }

  if (!request) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {back}
        <div className="mt-8 rounded-2xl border border-line bg-ivory p-10 text-center">
          <h1 className="font-display text-2xl text-ink">Request not found</h1>
          <p className="mt-2 text-muted">{error ?? (token ? "This request may have been deleted." : "Log in to view your requests.")}</p>
          <Link href={token ? "/dashboard" : "/login"} className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">
            {token ? "Back to dashboard" : "Log in"}
          </Link>
        </div>
      </main>
    )
  }

  const subtype = humanise(request.developmentType || request.partnershipType || request.propertyWanted)

  return (
    <main className="bg-white pb-24">
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-12 sm:px-6">
          {back}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <StatusBadge status={request.status} />
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-muted">
              {requestTypeLabel[request.requestType]}
              {subtype ? ` · ${subtype}` : ""}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink">{request.title || "Untitled request"}</h1>
          <p className="mt-2 text-sm text-muted">Submitted {formatDate(request.createdAt)}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-8">
          <Alert tone={request.status === "rejected" ? "error" : request.status === "accepted" ? "success" : "info"}>{statusMessage[request.status]}</Alert>
          {error ? <Alert tone="error">{error}</Alert> : null}

          <section>
            <h2 className="font-display text-2xl text-ink">What you&apos;re looking for</h2>
            <p className="mt-3 rounded-xl border border-gold/30 bg-gold-soft/40 p-4 font-medium text-ink">{requestSummary(request)}</p>
            {otherNotes(request) ? <p className="mt-4 leading-relaxed whitespace-pre-line text-gray-700">{otherNotes(request)}</p> : null}
          </section>

          <dl className="grid gap-6 rounded-2xl border border-line p-6 sm:grid-cols-3">
            <Detail label="Budget">{formatBudget(request.budget)}</Detail>
            <Detail label="Location">{request.location || "Not specified"}</Detail>
            <Detail label="Needed by">{request.timeline || "Not specified"}</Detail>
            {request.propertyWanted ? <Detail label="Looking for">{labelOf(request.requestType === "jv" ? jvPropertyKinds : propertiesWanted, request.propertyWanted)}</Detail> : null}
            {request.developmentType ? <Detail label="Development">{labelOf(developmentTypes, request.developmentType)}</Detail> : null}
            {request.partnershipType ? <Detail label="Professional">{labelOf(partnershipTypes, request.partnershipType)}</Detail> : null}
            {request.landSize ? <Detail label="Size wanted">{request.landSize}</Detail> : null}
            {request.housingProposal ? <Detail label="Plans to build">{labelOf(housingProposals, request.housingProposal)}</Detail> : null}
            {request.sharingFormula ? <Detail label="Sharing formula">{labelOf(sharingFormulas, request.sharingFormula)}</Detail> : null}
            {request.premium !== undefined && request.premium !== null ? (
              <Detail label="Premium">{request.premium > 0 ? `Up to ${formatBudget(String(request.premium))}` : "No premium"}</Detail>
            ) : null}
            {request.titleDocument ? <Detail label="Title accepted">{labelOf(titleDocuments, request.titleDocument)}</Detail> : null}
            {request.paymentMethod ? <Detail label="Payment">{request.paymentMethod}</Detail> : null}
            {request.updatedAt && request.updatedAt !== request.createdAt ? <Detail label="Last updated">{formatDate(request.updatedAt)}</Detail> : null}
          </dl>

          {request.documents?.length ? (
            <section>
              <h2 className="font-display text-2xl text-ink">Documents</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {request.documents.map((doc, index) => (
                  <li key={doc + index}>
                    <a href={doc} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border border-line">
                      {/\.(jpe?g|png|webp|gif)$/i.test(doc) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc} alt={`Document ${index + 1}`} className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <span className="flex aspect-[4/3] items-center justify-center gap-2 bg-ivory text-sm font-semibold text-ink">
                          <FiFileText aria-hidden="true" /> Document {index + 1}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 self-start lg:sticky lg:top-28">
          <div className="rounded-2xl border border-line p-6">
            <p className="eyebrow text-muted">Contact on this request</p>
            <p className="mt-3 font-semibold text-ink">{request.fullName}</p>
            <p className="text-sm text-muted">{request.email}</p>
            {request.phoneNumber ? <p className="text-sm text-muted">{request.phoneNumber}</p> : null}
          </div>
          <Link
            href={`/requests/${request._id}/edit`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-ink/85"
          >
            <FiEdit2 aria-hidden="true" /> Edit request
          </Link>
          {confirmDelete ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">Delete this request? This can&apos;t be undone.</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={handleDeleteRequest} disabled={isDeleting} className="flex-1 rounded-lg bg-red-700 px-3 py-2 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-60">
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-red-700 hover:border-red-300 hover:bg-red-50"
            >
              <FiTrash2 aria-hidden="true" /> Delete request
            </button>
          )}
        </aside>
      </div>
    </main>
  )
}

/** The description without the summary sentence it starts with, which is shown above it. */
function otherNotes(request: PartnerRequest): string {
  const summary = requestSummary(request)
  const description = request.description ?? ""
  return description.startsWith(summary) ? description.slice(summary.length).trim() : description
}
