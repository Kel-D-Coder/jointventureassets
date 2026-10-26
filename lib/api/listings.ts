import { API_TIMEOUT_MS, fetchFailure } from "@/lib/api/session";
import type { DealType, Listing, PropertyType } from "@/types";
import type { ListingSubmission } from "@/lib/inbox/types";
import { coverOf, joinMedia, splitMedia } from "@/lib/videoWatermark";
import { isLandValueTbd } from "@/components/listings/labels";

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

/** For the homepage: only listings ticked "Feature on the homepage" in the admin, newest first. */
export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const listings = await getApprovedListings().catch((): Listing[] => []);
  return listings
    .filter((listing) => listing.featured)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/** GET /listings/{id}: one listing (either shape), or null if it isn't public, doesn't exist or the server can't be reached. */
export async function getListing(id: string): Promise<Listing | null> {
  try {
    const response = await fetch(`${BASE}/listings/${encodeURIComponent(id)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error();
    const body = (await response.json()) as { listing?: ServerListing };
    return body.listing ? toPublicListing(body.listing) : null;
  } catch {
    return null;
  }
}

/** Fields the server may add to a listing beyond the website's form. */
type ListingExtras = {
  featured?: boolean;
  verified?: boolean;
  underOffer?: boolean;
  closing?: unknown;
  views?: number;
  status?: string;
};

/**
 * The server returns listings in two shapes, mixed in the same list:
 *  - created in the admin dashboard: the listing's fields at the top level,
 *    with its own status ("published", "under_offer", "draft", "closed");
 *  - an approved member submission: the fields nested under `listing`.
 */
type ServerListing =
  | (Partial<Listing> & ListingExtras & { id: string; listing?: undefined })
  | (ListingSubmission & { listing: ListingSubmission["listing"] & ListingExtras });

/** A listing the JVA team created for a member (its `userId` is theirs), as the member sees it on their dashboard. */
export interface OwnedListing {
  id: string;
  title: string;
  dealType: DealType;
  area: string;
  city: string;
  price: number;
  /** The first photo, if any. */
  cover?: string;
  status: "draft" | "published" | "under_offer" | "closed";
  /** Joint ventures whose land value is still to be determined. */
  landValueTbd: boolean;
  /** The member's listing request it was made from, if any. */
  sourceSubmissionId?: string;
  createdAt: string;
}

/** One of GET /listings/my-submissions' `listings`: an admin listing whose owner is the member. */
export function toOwnedListing(raw: Partial<Listing> & ListingExtras & { id?: string; _id?: string; sourceSubmissionId?: string }): OwnedListing {
  const known = ["draft", "published", "under_offer", "closed"] as const;
  const status = raw.closing ? "closed" : (known.find((value) => value === raw.status) ?? "published");
  return {
    id: raw.id ?? raw._id ?? "",
    title: (raw.title ?? "").toUpperCase() || "UNTITLED LISTING",
    dealType: (raw.dealType ?? "sale") as DealType,
    area: raw.area ?? "",
    city: raw.city ?? "",
    price: Number(raw.price) || 0,
    cover: coverOf(raw.images ?? []),
    status,
    landValueTbd: isLandValueTbd({ dealType: (raw.dealType ?? "sale") as DealType, price: Number(raw.price) || 0, landValueTbd: raw.landValueTbd, status }),
    sourceSubmissionId: raw.sourceSubmissionId ?? undefined,
    createdAt: raw.createdAt ?? new Date(0).toISOString(),
  };
}

/** Either shape as a public listing, or null if it shouldn't be shown (draft, closed, or a closed deal). */
function toPublicListing(raw: ServerListing): Listing | null {
  if (raw.listing) {
    // Member submission: only approved ones are public; one with a closing record is a closed deal.
    if (raw.status !== "approved" || raw.listing.closing) return null;
    const l = raw.listing;
    return {
      id: raw.id,
      title: (l.title ?? "").toUpperCase(),
      dealType: l.dealType as DealType,
      propertyType: l.propertyType as PropertyType,
      area: l.area,
      city: l.city,
      state: l.state,
      sizeSqm: Number(l.sizeSqm) || 0,
      price: Number(l.price) || 0,
      titleDocument: l.titleDocument,
      description: l.description,
      highlights: l.highlights ?? [],
      ...splitMedia(joinMedia(l.images, l.videos)),
      jv: l.jv ?? undefined,
      priceNegotiable: l.dealType === "sale" ? l.priceNegotiable : undefined,
      landValueTbd: l.dealType === "jv" ? Boolean(l.landValueTbd) : undefined,
      ownerName: l.ownerName,
      status: l.underOffer ? "under_offer" : "published",
      featured: Boolean(l.featured),
      verified: l.verified ?? true,
      views: Number(l.views) || 0,
      enquiries: 0,
      createdAt: raw.createdAt,
    };
  }

  // Admin listing: only live and under-offer ones are public.
  const status = raw.status === "under_offer" ? "under_offer" : raw.status === "published" ? "published" : null;
  if (!status || raw.closing) return null;
  return {
    id: raw.id,
    title: (raw.title ?? "").toUpperCase(),
    dealType: (raw.dealType ?? "sale") as DealType,
    propertyType: (raw.propertyType ?? "land") as PropertyType,
    area: raw.area ?? "",
    city: raw.city ?? "",
    state: raw.state ?? "",
    sizeSqm: Number(raw.sizeSqm) || 0,
    price: Number(raw.price) || 0,
    titleDocument: raw.titleDocument ?? "",
    description: raw.description ?? "",
    highlights: raw.highlights ?? [],
    ...splitMedia(joinMedia(raw.images, raw.videos)),
    jv: raw.jv ?? undefined,
    priceNegotiable: raw.dealType === "sale" ? raw.priceNegotiable : undefined,
    landValueTbd: raw.dealType === "jv" ? Boolean(raw.landValueTbd) : undefined,
    ownerName: raw.ownerName ?? "Joint Venture Assets",
    status,
    featured: Boolean(raw.featured),
    verified: raw.verified ?? true,
    views: Number(raw.views) || 0,
    enquiries: 0,
    createdAt: raw.createdAt ?? new Date(0).toISOString(),
  };
}

/** GET /listings/approved: every public listing, admin-created and approved submissions alike. Throws on network/server error. */
export async function getApprovedListings(): Promise<Listing[]> {
  const response = await fetch(`${BASE}/listings/approved`, {
    cache: "no-store",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  }).catch((caught: unknown) => {
    throw fetchFailure(caught);
  });

  if (!response.ok) throw new Error(`Server error ${response.status}`);
  const body = (await response.json()) as { listings?: ServerListing[] };
  return (body.listings ?? []).map(toPublicListing).filter((listing): listing is Listing => listing !== null);
}
