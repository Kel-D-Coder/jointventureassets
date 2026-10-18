/** "jv" = joint-venture partnership on the land; "sale" = an outright purchase. */
export type DealType = "jv" | "sale";

export type PropertyType = "land" | "residential" | "commercial" | "mixed_use";

export type ListingStatus = "published" | "draft" | "under_offer" | "closed";

export interface Listing {
  id: string;
  title: string;
  dealType: DealType;
  propertyType: PropertyType;
  area: string;
  city: string;
  state: string;
  sizeSqm: number;
  /** Asking price for a sale; land value for a JV. Naira. */
  price: number;
  titleDocument: string;
  description: string;
  highlights: string[];
  images: string[];
  jv?: {
    /** Landowner / developer split, e.g. "40/60". */
    sharingFormula: string;
    /** Whether the landowner is open to discussing the split. Missing on older records. */
    sharingNegotiable?: boolean;
    /** Upfront premium the developer pays the landowner, in naira; 0 means no premium. Missing on older records. */
    premium?: number;
    proposal: string;
    duration: string;
  };
  ownerName: string;
  status: ListingStatus;
  featured: boolean;
  verified: boolean;
  views: number;
  enquiries: number;
  createdAt: string;
}

export type RequestStatus = "pending" | "accepted" | "rejected";
/**
 * What a member wants JVA to find: a joint venture, land to buy, a property to
 * buy, a development project, or a professional partner. (Older "land" requests
 * from before 2026-10-18 were offers of land.)
 */
export type RequestType = "jv" | "land" | "purchase" | "development" | "partnership";

/** A member's request, shaped like the backend's Mongo document (hence `_id`). */
export interface PartnerRequest {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: RequestStatus;
  requestType: RequestType;
  budget: string;
  location: string;
  timeline: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  documents: string[];
  developmentType?: string;
  partnershipType?: string;
  landSize?: string;
  landValue?: string;
  housingProposal?: string;
  titleDocument?: string;
  sharingFormula?: string;
  /** Land offers: whether the sharing formula is open to negotiation. */
  sharingNegotiable?: boolean;
  /** Land offers: upfront premium expected from the developer, in naira; 0 means none. */
  premium?: number;
  /** Purchase requests: what they want to buy and how they'll pay. */
  propertyWanted?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

/** The signed-in member, as kept in the Redux auth slice. */
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  category: string;
}
