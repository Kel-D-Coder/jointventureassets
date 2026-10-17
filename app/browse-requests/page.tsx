"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { useSearchRequests } from "@/hooks/useSearchRequests";
import { useAppSelector } from "@/hooks/hooks";
import { PageHero } from "@/components/ui/PageHero";
import { Alert } from "@/components/ui/form";
import { RequestCard } from "@/components/requests/RequestCard";
import { requestTypeLabel } from "@/components/requests/StatusBadge";
import { cx } from "@/lib/format";
import type { RequestType } from "@/types";

const tabs: Array<{ value: RequestType | undefined; label: string }> = [
  { value: undefined, label: "All" },
  ...(Object.keys(requestTypeLabel) as RequestType[]).map((value) => ({ value, label: requestTypeLabel[value] })),
];

export default function BrowseRequests() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [type, setType] = useState<RequestType | undefined>();
  const [query, setQuery] = useState("");
  const { data: requests, loading, error, searchRequests } = useSearchRequests();

  // Refetch whenever the type filter changes.
  useEffect(() => {
    if (isAuthenticated) void searchRequests(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isAuthenticated]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (requests ?? []).filter(
      (request) => !needle || [request.title, request.description, request.location].join(" ").toLowerCase().includes(needle),
    );
  }, [requests, query]);

  return (
    <main className="bg-white pb-24">
      <PageHero
        eyebrow="Requests"
        title="What other members are looking for"
        intro="When members can't find what they want in our listings, they post a request. Have what someone is looking for? Send an enquiry and we'll make the introduction."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <div className="mt-12 rounded-2xl border border-line bg-ivory p-10 text-center">
            <h2 className="font-display text-2xl text-ink">Log in to browse requests</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">Member requests are only visible to registered landowners, investors and buyers.</p>
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
          <>
            <div className="sticky top-18 z-30 -mx-4 flex flex-col gap-3 border-b border-line bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:flex-row lg:items-center lg:px-8">
              <div role="tablist" aria-label="Request type" className="flex shrink-0 gap-1 overflow-x-auto rounded-xl bg-ivory p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.label}
                    type="button"
                    role="tab"
                    aria-selected={tab.value === type}
                    onClick={() => setType(tab.value)}
                    className={cx(
                      "flex-1 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors lg:flex-none",
                      tab.value === type ? "bg-ink text-white" : "text-gray-600 hover:text-ink",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-line px-3.5 focus-within:border-gold">
                <FiSearch aria-hidden="true" className="shrink-0 text-muted" />
                <span className="sr-only">Search requests</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, description or location"
                  className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-gray-400"
                />
              </label>
            </div>

            {error ? <Alert tone="error" className="mt-6">{error}</Alert> : null}

            <p className="mt-6 text-sm text-muted" aria-live="polite">
              {loading ? "Loading requests…" : `${visible.length} ${visible.length === 1 ? "request" : "requests"}`}
            </p>

            {loading ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((index) => <div key={index} className="h-72 animate-pulse rounded-2xl bg-ivory" />)}
              </div>
            ) : visible.length ? (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((request) => (
                  <li key={request._id}>
                    <RequestCard request={request} canEnquire={request.userId !== user?.id} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
                <p className="font-display text-2xl text-ink">No requests found</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted">Try another type or search, or post your own request.</p>
                <Link href="/submit-request" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/85">
                  Submit a request
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
