import { seedListings } from "@/lib/data/listings";
import { ApiError, wait } from "@/lib/api/mock";
import { sendEnquiry as sendInboxEnquiry } from "@/lib/api/inbox";
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

/** Only live and under-offer listings are public; drafts and closed deals stay in the dashboard. */
const publicListings = () => seedListings.filter((listing) => listing.status === "published" || listing.status === "under_offer");

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

/** GET /listings — every public listing; filtering happens on the page so tab counts stay live. */
export async function getListings(): Promise<Listing[]> {
  await wait();
  return structuredClone(publicListings());
}

/** GET /listings?featured=true — for the homepage. */
export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  await wait(150, 150);
  return structuredClone(publicListings().filter((listing) => listing.featured).slice(0, limit));
}

/** GET /listings/{id} — tries the real backend first; returns null if not found or unreachable. */
export async function getListing(id: string): Promise<Listing | null> {
  try {
    const response = await fetch(`${BASE}/listings/${id}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error();
    const body = await response.json();
    return submissionToListing(body.listing as ListingSubmission);
  } catch {
    return null;
  }
}

/** Up to three other listings of the same deal type, nearest first. */
export function similarListings(listing: Listing, limit = 3): Listing[] {
  return publicListings()
    .filter((other) => other.id !== listing.id && other.dealType === listing.dealType)
    .sort((a, b) => Number(b.state === listing.state) - Number(a.state === listing.state))
    .slice(0, limit);
}

/** Maps a backend ListingSubmission (approved) to the frontend Listing shape. */
function submissionToListing(s: ListingSubmission): Listing {
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
    status: "published",
    featured: false,
    verified: true,
    views: 0,
    enquiries: 0,
    createdAt: s.createdAt,
  };
}

/** GET /listings/approved — all approved listings from the real backend. Throws on network/server error. */
export async function getApprovedListings(): Promise<Listing[]> {
  const response = await fetch(`${BASE}/listings/approved`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  }).catch(() => {
    throw new Error("Couldn't reach the server.");
  });

  if (!response.ok) throw new Error(`Server error ${response.status}`);
  const body = await response.json();
  return ((body.listings ?? []) as ListingSubmission[]).map(submissionToListing);
}

/** Sends an enquiry about a listing to the shared demo inbox, where the admin dashboard picks it up. */
export async function sendEnquiry(
  listingId: string,
  input: { fullName: string; email: string; phoneNumber: string; message: string },
): Promise<{ message: string }> {
  const listing = seedListings.find((candidate) => candidate.id === listingId);
  if (!listing) throw new ApiError("This listing is no longer available.");
  await sendInboxEnquiry({
    ...input,
    target: { type: "listing", id: listing.id, title: listing.title, subtitle: `${listing.area}, ${listing.city}`, image: listing.images[0] },
  });
  return { message: "Thanks. The JVA team will contact you within one working day." };
}
