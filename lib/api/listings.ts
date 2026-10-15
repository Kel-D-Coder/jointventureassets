import { seedListings } from "@/lib/data/listings";
import { ApiError, wait } from "@/lib/api/mock";
import { sendEnquiry as sendInboxEnquiry } from "@/lib/api/inbox";
import type { DealType, Listing, PropertyType } from "@/types";

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

/** GET /listings/{id} */
export async function getListing(id: string): Promise<Listing | null> {
  await wait(150, 150);
  return structuredClone(publicListings().find((listing) => listing.id === id) ?? null);
}

/** Up to three other listings of the same deal type, nearest first. */
export function similarListings(listing: Listing, limit = 3): Listing[] {
  return publicListings()
    .filter((other) => other.id !== listing.id && other.dealType === listing.dealType)
    .sort((a, b) => Number(b.state === listing.state) - Number(a.state === listing.state))
    .slice(0, limit);
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
