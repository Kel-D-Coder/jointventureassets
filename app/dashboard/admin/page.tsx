"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/hooks";
import { getAdminSubmissions, updateSubmissionStatus } from "@/lib/api/admin";
import type { ListingSubmission, SubmissionStatus } from "@/lib/inbox/types";
import { formatNaira } from "@/lib/format";

const STATUS_TABS: Array<{ value: string | undefined; label: string }> = [
  { value: undefined, label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Drafts" },
];

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminListings() {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);
  const [submissions, setSubmissions] = useState<ListingSubmission[] | null>(null);
  const [tab, setTab] = useState<string | undefined>("pending");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { router.replace("/login"); return; }
    setLoading(true);
    setError(null);
    getAdminSubmissions(token, tab)
      .then(setSubmissions)
      .catch((err: unknown) => setError((err as Error).message ?? "Failed to load."))
      .finally(() => setLoading(false));
  }, [token, tab, router]);

  async function changeStatus(id: string, status: SubmissionStatus) {
    if (!token) return;
    setActionId(id);
    try {
      const updated = await updateSubmissionStatus(token, id, status, note[id]);
      setSubmissions((prev) =>
        prev ? prev.map((s) => (s.id === id ? updated : s)) : prev,
      );
      setNote((prev) => { const next = { ...prev }; delete next[id]; return next; });
    } catch (err: unknown) {
      alert((err as Error).message ?? "Action failed.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">Listing submissions</h1>
      <p className="mt-1 text-sm text-muted">Review, approve or reject property listings submitted by members.</p>

      {/* Status tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.value ? "bg-ink text-white" : "bg-ivory text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error ? (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {/* Loading skeleton */}
      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-ivory" />
          ))}
        </div>
      ) : submissions?.length === 0 ? (
        <div className="mt-12 text-center text-sm text-muted">No submissions in this category.</div>
      ) : (
        <ul className="mt-6 space-y-4">
          {submissions?.map((sub) => (
            <li key={sub.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[sub.status]}`}
                  >
                    {sub.status}
                  </span>
                  <h2 className="mt-1 font-display text-lg text-ink">{sub.listing.title}</h2>
                  <p className="text-sm text-muted">
                    {sub.listing.area}, {sub.listing.city}, {sub.listing.state} ·{" "}
                    {sub.listing.dealType.toUpperCase()} · {formatNaira(sub.listing.price)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Submitted by {sub.contact.fullName} ({sub.contact.email}) ·{" "}
                    {new Date(sub.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                  </p>
                  {sub.reviewNote ? (
                    <p className="mt-1 text-xs italic text-muted">Note: {sub.reviewNote}</p>
                  ) : null}
                </div>

                {/* Quick actions for pending */}
                {sub.status === "pending" ? (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={actionId === sub.id}
                      onClick={() => changeStatus(sub.id, "approved")}
                      className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={actionId === sub.id}
                      onClick={() => changeStatus(sub.id, "rejected")}
                      className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                ) : sub.status === "approved" ? (
                  <button
                    type="button"
                    disabled={actionId === sub.id}
                    onClick={() => changeStatus(sub.id, "rejected")}
                    className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Revoke
                  </button>
                ) : sub.status === "rejected" ? (
                  <button
                    type="button"
                    disabled={actionId === sub.id}
                    onClick={() => changeStatus(sub.id, "approved")}
                    className="rounded-full border border-green-300 px-4 py-1.5 text-sm font-semibold text-green-600 hover:bg-green-50 disabled:opacity-50"
                  >
                    Approve
                  </button>
                ) : null}
              </div>

              {/* Review note input (only for pending) */}
              {sub.status === "pending" ? (
                <div className="mt-3">
                  <input
                    type="text"
                    value={note[sub.id] ?? ""}
                    onChange={(e) => setNote((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                    placeholder="Optional review note (visible to submitter)"
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
              ) : null}

              {/* Listing images preview */}
              {sub.listing.images.length > 0 ? (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {sub.listing.images.slice(0, 4).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-16 w-24 shrink-0 rounded-lg object-cover"
                    />
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
