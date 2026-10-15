import { seedListings } from "@/lib/data/listings";
import { seedAccounts } from "@/lib/inbox/seedAccounts";
import type { InboxEnquiry, InboxItem, ListingSubmission } from "@/lib/inbox/types";

/** Demo inbox contents, written to the inbox file the first time it's read. */

function listingTarget(id: string): InboxEnquiry["target"] {
  const listing = seedListings.find((candidate) => candidate.id === id)!;
  return { type: "listing", id, title: listing.title, subtitle: `${listing.area}, ${listing.city}`, image: listing.images[0] };
}

function requestTarget(id: string, title: string, subtitle: string): InboxEnquiry["target"] {
  return { type: "request", id, title, subtitle };
}

const enquiries: InboxEnquiry[] = [
  { id: "enq-01", kind: "enquiry", target: listingTarget("lst-1003"), fullName: "Capitol Real Estate Fund", email: "deals@capitolfund.example.com", phoneNumber: "+234 701 300 5500", message: "We're interested in partnering on the Eleko estate land. Please share the survey plan and the excision gazette.", jv: { generateLoi: true, letterhead: { name: "Capitol letterhead.png", type: "image/png", size: 19973, url: "/placeholders/letterhead-capitol.png" }, acceptedFeeTerms: true }, status: "new", createdAt: "2026-10-12T16:40:00+01:00" },
  { id: "enq-02", kind: "enquiry", target: listingTarget("lst-1002"), fullName: "Halima Yusuf", email: "halima.y@example.com", phoneNumber: "+234 803 559 8800", message: "I'm interested in buying the Maitama duplex. Please arrange an inspection. Weekday afternoons work best.", status: "new", createdAt: "2026-10-12T11:05:00+01:00" },
  { id: "enq-03", kind: "enquiry", target: listingTarget("lst-1001"), fullName: "Femi Ogunleye", email: "femi@ogunleyebuild.example.com", phoneNumber: "+234 805 410 2299", message: "We've delivered three apartment blocks in Lekki. Keen to discuss the 40/60 formula on the corner plot.", jv: { generateLoi: false, acceptedFeeTerms: true }, status: "new", createdAt: "2026-10-11T19:20:00+01:00" },
  { id: "enq-04", kind: "enquiry", target: listingTarget("lst-1006"), fullName: "Uche Nnamdi", email: "uche.n@example.com", phoneNumber: "+234 816 774 0021", message: "Is the Sangotedo plot still available? I can pay outright this month.", status: "contacted", createdAt: "2026-10-10T09:15:00+01:00" },
  { id: "enq-05", kind: "enquiry", target: listingTarget("lst-1011"), fullName: "Seaside Hospitality Ltd", email: "projects@seaside.example.com", phoneNumber: "+234 703 990 1200", message: "We build boutique resorts and would like the full JV terms for the Okun Ajah waterfront.", jv: { generateLoi: true, letterhead: { name: "Seaside letterhead.png", type: "image/png", size: 20980, url: "/placeholders/letterhead-seaside.png" }, acceptedFeeTerms: true }, status: "new", createdAt: "2026-10-09T10:30:00+01:00" },
  { id: "enq-06", kind: "enquiry", target: listingTarget("lst-1004"), fullName: "Obinna Okafor", email: "obinna.okafor@example.com", phoneNumber: "+234 802 118 7744", message: "Please send the tenancy schedule and service-charge accounts for the VI office block.", status: "closed", createdAt: "2026-10-05T12:45:00+01:00" },
  { id: "enq-07", kind: "enquiry", target: requestTarget("req-2001", "Developer wanted for Lekki corner plot", "Land offer · Lekki Phase 1, Lagos"), fullName: "Kayode Adewale", email: "kayode@adewaledev.example.com", phoneNumber: "+234 809 771 4410", message: "We're a developer with four completed projects in Lekki. We'd like to be introduced to the landowner.", status: "new", createdAt: "2026-10-12T09:50:00+01:00" },
  { id: "enq-08", kind: "enquiry", target: requestTarget("req-2008", "State agency seeking developers for mass housing", "Development · Asaba, Delta"), fullName: "Northgate Construction", email: "bids@northgate.example.com", phoneNumber: "+234 703 222 9081", message: "We have PPP housing experience in Edo and Delta. How do we get on the shortlist?", status: "contacted", createdAt: "2026-10-10T15:30:00+01:00" },
  { id: "enq-09", kind: "enquiry", target: requestTarget("req-2003", "Mandate for a 10-hectare government site", "Partnership · Epe, Lagos"), fullName: "Ifeoma Chukwu", email: "ifeoma.c@example.com", phoneNumber: "+234 806 441 3390", message: "Our investor group can fund up to 150 units. Is a partial take-up possible?", status: "new", createdAt: "2026-10-09T08:20:00+01:00" },
];

const submissions: ListingSubmission[] = [
  {
    id: "sub-01",
    kind: "listing-submission",
    status: "pending",
    isOwner: true,
    contact: { fullName: "Olumide Johnson", email: "olumide.j@example.com", phoneNumber: "+234 809 201 3344" },
    listing: {
      title: "Half-plot for a JV in Ikorodu",
      dealType: "jv",
      propertyType: "land",
      area: "Ijede",
      city: "Ikorodu",
      state: "Lagos",
      sizeSqm: 300,
      price: 25_000_000,
      titleDocument: "Survey plan only",
      description: "Dry half-plot on a tarred road, five minutes from the Ijede jetty. I'd like a developer to build two flats and share them.",
      highlights: ["Tarred road", "Near the jetty", "Fenced"],
      images: ["/placeholders/estate-02.jpg", "/placeholders/tower-01.jpg"],
      jv: { sharingFormula: "40/60", sharingNegotiable: true, premium: 0, proposal: "Two 2-bedroom flats", duration: "12 months" },
      ownerName: "Olumide Johnson",
    },
    documents: [{ name: "Survey plan.jpg", type: "image/jpeg", size: 412_000, url: "/placeholders/estate-02.jpg" }],
    createdAt: "2026-10-12T13:10:00+01:00",
    updatedAt: "2026-10-12T13:10:00+01:00",
  },
  {
    id: "sub-02",
    kind: "listing-submission",
    status: "pending",
    isOwner: false,
    contact: { fullName: "Grace Etim", email: "grace.etim@example.com", phoneNumber: "+234 802 330 1122" },
    listing: {
      title: "4-bedroom detached house with pool",
      dealType: "sale",
      propertyType: "residential",
      area: "Trans Amadi",
      city: "Port Harcourt",
      state: "Rivers",
      sizeSqm: 650,
      price: 210_000_000,
      titleDocument: "C of O",
      description: "Detached four-bedroom house with a swimming pool and two-car garage, sold on behalf of the owner, who has relocated abroad.",
      highlights: ["Swimming pool", "Two-car garage", "Gated street"],
      images: ["/placeholders/tower-03.jpg", "/placeholders/estate-01.jpg"],
      ownerName: "Mr. & Mrs. Ekpo",
    },
    documents: [
      { name: "C of O.jpg", type: "image/jpeg", size: 538_000, url: "/placeholders/tower-03.jpg" },
      { name: "Power of attorney.jpg", type: "image/jpeg", size: 301_000, url: "/placeholders/estate-01.jpg" },
    ],
    createdAt: "2026-10-11T10:00:00+01:00",
    updatedAt: "2026-10-11T10:00:00+01:00",
  },
  {
    id: "sub-03",
    kind: "listing-submission",
    status: "rejected",
    isOwner: true,
    contact: { fullName: "Tunde Bakare", email: "tunde.bakare@example.com", phoneNumber: "+234 812 345 6789" },
    listing: {
      title: "Land for sale",
      dealType: "sale",
      propertyType: "land",
      area: "Various",
      city: "Lagos",
      state: "Lagos",
      sizeSqm: 1000,
      price: 40_000_000,
      titleDocument: "Survey plan only",
      description: "Several plots available, can close fast.",
      highlights: [],
      images: ["/placeholders/estate-02.jpg"],
      ownerName: "Tunde Bakare",
    },
    reviewNote: "No specific location or title documents. Please resubmit with the plot's address and survey plan.",
    createdAt: "2026-10-02T18:00:00+01:00",
    updatedAt: "2026-10-03T09:00:00+01:00",
  },
];

export const seedSubmissions = submissions;

export const seedInbox: InboxItem[] = [...enquiries, ...submissions, ...seedAccounts];
