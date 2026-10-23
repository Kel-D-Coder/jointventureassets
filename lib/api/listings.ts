import { API_TIMEOUT_MS, fetchFailure } from "@/lib/api/session";
import { SHOW_SAMPLE_LISTING, isSampleListing, sampleSaleListing } from "@/lib/data/sampleListing";
import type { DealType, Listing, PropertyType } from "@/types";
import type { ListingSubmission } from "@/lib/inbox/types";

const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

export type ListingSort = "newest" | "price_asc" | "price_desc" | "size_desc";

export interface ListingQuery {
  dealType?: DealType;
  /** A property type, or "building" for anything that isn't bare land. */
  propertyType?: PropertyType | "building";
  /** Free text matched against title, area, city and state. */
  q?: string;
  sort?: ListingSort;
}

const sorters: Record<ListingSort, (a: Listing, b: Listing) => number> = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  size_desc: (a, b) => b.sizeSqm - a.sizeSqm,
};

/** Pure filter, also used to show live counts beside each filter tab. */
export function filterListings(listings: Listing[], query: ListingQuery): Listing[] {
  const needle = query.q?.trim().toLowerCase();
  return listings
    .filter(
      (listing) =>
        (!query.dealType || listing.dealType === query.dealType) &&
        (!query.propertyType ||
          (query.propertyType === "building" ? listing.propertyType !== "land" : listing.propertyType === query.propertyType)) &&
        (!needle || [listing.title, listing.area, listing.city, listing.state].join(" ").toLowerCase().includes(needle)),
    )
    .sort(sorters[query.sort ?? "newest"]);
}

/** Every public listing; filtering happens on the page so tab counts stay live. */
export function getListings(): Promise<Listing[]> {
  return getApprovedListings();
}

/** For the homepage: featured listings first, then the newest. */
export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const listings = await getApprovedListings().catch((): Listing[] => []);
  return [...listings].sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

/** GET /listings/{id} — tries the real backend first; returns null if not found or unreachable. */
export async function getListing(id: string): Promise<Listing | null> {
  if (SHOW_SAMPLE_LISTING && isSampleListing(id)) return structuredClone(sampleSaleListing);
  try {
    const response = await fetch(`${BASE}/listings/${id}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error();
    const body = await response.json();
    return submissionToListing(body.listing as ListingSubmission);
  } catch {
    return null;
  }
}

/** Maps a backend ListingSubmission (approved) to the frontend Listing shape. */
function submissionToListing(s: ListingSubmission): Listing {
  const extras = s.listing as ListingSubmission["listing"] & { featured?: boolean; verified?: boolean; underOffer?: boolean };
  return {
    id: s.id,
    title: s.listing.title,
    dealType: s.listing.dealType as DealType,
    propertyType: s.listing.propertyType as PropertyType,
    area: s.listing.area,
    city: s.listing.city,
    state: s.listing.state,
    sizeSqm: s.listing.sizeSqm,
    price: s.listing.price,
    titleDocument: s.listing.titleDocument,
    description: s.listing.description,
    highlights: s.listing.highlights,
    images: s.listing.images,
    jv: s.listing.jv ?? undefined,
    ownerName: s.listing.ownerName,
    status: extras.underOffer ? "under_offer" : "published",
    featured: Boolean(extras.featured),
    verified: extras.verified ?? true,
    views: 0,
    enquiries: 0,
    createdAt: s.createdAt,
  };
}

/** GET /listings/approved — all approved listings from the real backend. Throws on network/server error. */
export async function getApprovedListings(): Promise<Listing[]> {
  const response = await fetch(`${BASE}/listings/approved`, {
    cache: "no-store",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  }).catch((caught: unknown) => {
    throw fetchFailure(caught);
  });

  if (!response.ok) throw new Error(`Server error ${response.status}`);
  const body = await response.json();
  // A listing with a closing record is a closed deal; it stays in the admin dashboard.
  const listings = ((body.listings ?? []) as Array<ListingSubmission & { listing: { closing?: unknown } }>)
    .filter((submission) => !submission.listing.closing)
    .map(submissionToListing);
  return SHOW_SAMPLE_LISTING ? [...listings, structuredClone(sampleSaleListing)] : listings;
}
