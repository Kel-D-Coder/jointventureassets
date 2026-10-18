/**
 * A sample sale listing, so the purchase enquiry (with the 5% facilitation fee)
 * can be tried before real sale listings are on the server. Enquiries on it are
 * not sent anywhere.
 *
 * To remove it: set SHOW_SAMPLE_LISTING to false, or delete this file and its
 * two uses in lib/api/listings.ts, plus public/sample/.
 */
import type { Listing } from "@/types";

export const SHOW_SAMPLE_LISTING = false;

export const SAMPLE_LISTING_ID = "sample-sale-ikota";

export const sampleSaleListing: Listing = {
  id: SAMPLE_LISTING_ID,
  title: "4 Bedroom Semi-Detached Duplex with BQ",
  dealType: "sale",
  propertyType: "residential",
  area: "Ikota GRA",
  city: "Lekki",
  state: "Lagos",
  sizeSqm: 450,
  price: 160_000_000,
  titleDocument: "C of O",
  description:
    "Sample listing for testing. A newly built four-bedroom semi-detached duplex with a one-room boys' quarters, in a gated close in Ikota GRA. All rooms en suite, fitted kitchen, parking for three cars.",
  highlights: ["All rooms en suite", "Boys' quarters", "Gated close", "Parking for three cars"],
  images: ["/sample/sale-1.jpg", "/sample/sale-2.jpg", "/sample/sale-3.jpg"],
  ownerName: "Joint Venture Assets",
  status: "published",
  featured: true,
  verified: true,
  views: 0,
  enquiries: 0,
  createdAt: "2026-10-18T09:00:00+01:00",
};

export const isSampleListing = (id: string) => id === SAMPLE_LISTING_ID;
