"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { filterListings, getApprovedListings, type ListingSort } from "@/lib/api/listings";
import { Alert } from "@/components/ui/form";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/ListingCard";
import { propertyTypeLabel } from "@/components/listings/labels";
import { cx } from "@/lib/format";
import type { DealType, Listing, PropertyType } from "@/types";

const dealTabs: Array<{ value: DealType | undefined; label: string }> = [
  { value: undefined, label: "All listings" },
  { value: "jv", label: "Joint venture" },
  { value: "sale", label: "For sale" },
];

const sortLabels: Record<ListingSort, string> = {
  newest: "Newest first",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  size_desc: "Largest first",
};

function asDeal(value: string | null): DealType | undefined {
  return value === "jv" || value === "sale" ? value : undefined;
}

function asPropertyType(value: string | null): PropertyType | "building" | undefined {
  if (value === "building") return value;
  return value && value in propertyTypeLabel ? (value as PropertyType) : undefined;
}

function asSort(value: string | null): ListingSort {
  return value && value in sortLabels ? (value as ListingSort) : "newest";
}

/**
 * The filterable listings grid. Filters live in the URL (?deal=jv&type=land&q=lekki&sort=price_asc),
 * so a filtered view can be bookmarked or shared, and the homepage search lands here pre-filtered.
 */
export function ListingsExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const deal = asDeal(params.get("deal"));
  const propertyType = asPropertyType(params.get("type"));
  const sort = asSort(params.get("sort"));
  const q = params.get("q") ?? "";

  const [listings, setListings] = useState<Listing[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState(q);

  useEffect(() => {
    getApprovedListings()
      .then(setListings)
      .catch((err: unknown) => {
        setFetchError((err as Error).message ?? "Couldn't load listings.");
        setListings([]);
      });
  }, []);

  // Keep the box in step when the URL changes (back button, homepage search).
  useEffect(() => setSearch(q), [q]);

  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const visible = useMemo(
    () => (listings ? filterListings(listings, { dealType: deal, propertyType, q, sort }) : []),
    [listings, deal, propertyType, q, sort],
  );

  const countFor = (value: DealType | undefined) =>
    listings ? filterListings(listings, { dealType: value, propertyType, q }).length : undefined;

  const hasFilters = Boolean(deal || propertyType || q);

  return (
    <div>
      <div className="sticky top-18 z-30 -mx-4 border-b border-line bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div role="tablist" aria-label="Deal type" className="flex shrink-0 gap-1 overflow-x-auto rounded-xl bg-ivory p-1">
            {dealTabs.map((tab) => {
              const active = tab.value === deal;
              const count = countFor(tab.value);
              return (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => update({ deal: tab.value })}
                  className={cx(
                    "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors lg:flex-none",
                    active ? "bg-ink text-white" : "text-gray-600 hover:text-ink",
                  )}
                >
                  {tab.label}
                  {count !== undefined ? (
                    <span className={cx("rounded-full px-1.5 text-xs", active ? "bg-white/15" : "bg-white text-muted")}>{count}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              update({ q: search.trim() || undefined });
            }}
            className="flex flex-1 items-center gap-2 rounded-xl border border-line px-3.5 focus-within:border-gold"
          >
            <FiSearch aria-hidden="true" className="shrink-0 text-muted" />
            <label htmlFor="listing-search" className="sr-only">Search by location or title</label>
            <input
              id="listing-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onBlur={() => search.trim() !== q && update({ q: search.trim() || undefined })}
              placeholder="Search by location or title"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-gray-400"
            />
          </form>

          <div className="flex gap-2">
            <select
              aria-label="Property type"
              value={propertyType ?? ""}
              onChange={(event) => update({ type: event.target.value || undefined })}
              className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink lg:flex-none"
            >
              <option value="">Any property type</option>
              <option value="building">Any building</option>
              {Object.entries(propertyTypeLabel).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              aria-label="Sort"
              value={sort}
              onChange={(event) => update({ sort: event.target.value === "newest" ? undefined : event.target.value })}
              className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink lg:flex-none"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {fetchError ? <Alert tone="error" className="mt-6">{fetchError}</Alert> : null}

      <div className="mt-6 flex min-h-8 flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {listings ? (
            <>
              <span className="font-semibold text-ink">{visible.length}</span> {visible.length === 1 ? "listing" : "listings"}
              {q ? <> matching &ldquo;{q}&rdquo;</> : null}
            </>
          ) : (
            "Loading listings…"
          )}
        </p>
        {hasFilters ? (
          <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:underline">
            <FiX aria-hidden="true" /> Clear filters
          </button>
        ) : null}
      </div>

      {!listings ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <ListingCardSkeleton key={index} />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-2xl text-ink">
            {hasFilters ? "No listings match" : "No listings yet"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            {hasFilters
              ? "Try a different location or deal type, or post a request with what you need. We’ll source it, and members on the platform can respond."
              : "We’re reviewing submitted properties and will publish approved listings here soon. In the meantime, post a request and we’ll source a match for you."}
          </p>
          <a href="/submit-request" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/85">
            Post a request
          </a>
        </div>
      ) : (
        <>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-ivory p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-display text-2xl text-ink">Didn&apos;t see what you want?</p>
              <p className="mt-1 max-w-xl text-sm text-muted">
                Post a request with what you&apos;re looking for. We&apos;ll source it for you, and members on the platform can respond.
              </p>
            </div>
            <a href="/submit-request" className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/85">
              Post a request
            </a>
          </div>
        </>
      )}
    </div>
  );
}
