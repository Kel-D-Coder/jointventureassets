import type { StoredAccount } from "@/lib/inbox/types";

/**
 * Demo members, shared by the website (login, sign-up) and the admin
 * dashboard (Users). Every demo password is "demo1234" except the admin's.
 * Sample documents point at placeholder photos both apps serve.
 */

const DEMO_PASSWORD = "demo1234";

type Seed = Omit<StoredAccount, "kind" | "password" | "updatedAt" | "documents" | "profileCompleted"> &
  Partial<Pick<StoredAccount, "documents" | "profileCompleted" | "password">>;

const sampleDoc = (name: string, url: string, size: number) => ({ name, type: "image/jpeg", size, url });

const seeds: Seed[] = [
  {
    id: "usr-01", fullName: "Adebayo Okonkwo", email: "adebayo@example.com", phoneNumber: "+234 803 111 2034", role: "Landowner", category: "Individual", status: "active",
    profile: { landLocation: "Lekki Phase 1, Lagos", landSize: "2,400 sqm", documentationStatus: "Fully Documented", preferredPartnershipType: "Joint Venture", landDescription: "Dry, fenced corner plot two streets off Admiralty Way, with two road frontages." },
    createdAt: "2026-06-11T10:00:00+01:00", lastActiveAt: "2026-10-11T18:20:00+01:00",
  },
  {
    id: "usr-02", fullName: "Fatima Bello", email: "fatima.bello@example.com", phoneNumber: "+234 805 222 8841", role: "Landowner", category: "Individual", status: "active",
    profile: { landLocation: "Maitama, Abuja", landSize: "1,100 sqm", documentationStatus: "Fully Documented", preferredPartnershipType: "Outright Sale", landDescription: "Finished five-bedroom duplex with a two-room BQ on a quiet close." },
    createdAt: "2026-06-19T09:30:00+01:00", lastActiveAt: "2026-10-10T09:12:00+01:00",
  },
  {
    id: "usr-03", fullName: "Chinedu Eze", email: "demo@jointventureassets.com", phoneNumber: "+234 806 773 0192", role: "Investor", category: "Individual", status: "active",
    profile: { investmentType: "Joint Venture", budgetRange: "$1M - $5M", preferredLocation: "Abuja or Lagos mainland", projectType: "Residential", yearsOfExperience: "6-10 years", companyName: "Eze Developments" },
    documents: {
      companyProfile: sampleDoc("Eze Developments company profile.jpg", "/placeholders/tower-02.jpg", 845_000),
      proofOfFunds: sampleDoc("Bank reference letter.jpg", "/placeholders/estate-02.jpg", 312_000),
    },
    createdAt: "2026-07-02T15:45:00+01:00", lastActiveAt: "2026-10-12T08:05:00+01:00",
  },
  {
    id: "usr-04", fullName: "Odeda Farmers Cooperative", email: "info@odedacoop.example.com", phoneNumber: "+234 809 440 1180", role: "Landowner", category: "Cooperative", status: "active",
    profile: { organizationType: "Cooperative", registrationLicenseNumber: "OG/COOP/2011/0482", landLocation: "Odeda, Ogun", landSize: "20 hectares", documentationStatus: "Partially Documented", preferredPartnershipType: "Joint Venture", landDescription: "Fertile farmland with a stream along one edge and road access for trucks." },
    createdAt: "2026-07-08T11:20:00+01:00", lastActiveAt: "2026-10-06T10:31:00+01:00",
  },
  {
    id: "usr-05", fullName: "Ngozi Umeh", email: "ngozi.umeh@example.com", phoneNumber: "+234 802 990 4471", role: "Buyer", category: "Individual", status: "active",
    profile: { propertyWanted: "Residential", budgetRange: "$500k - $1M", preferredLocation: "Lekki or Ikoyi", purpose: "To live in", timeline: "Within 3 months", paymentMethod: "Outright payment" },
    createdAt: "2026-07-21T13:00:00+01:00", lastActiveAt: "2026-10-09T16:45:00+01:00",
  },
  {
    id: "usr-06", fullName: "Capitol Real Estate Fund", email: "deals@capitolfund.example.com", phoneNumber: "+234 701 300 5500", role: "Investor", category: "Cooperative", status: "active",
    profile: { investmentType: "Equity", organizationType: "Corporation", registrationLicenseNumber: "RC 1458823", budgetRange: "Over $10M", preferredLocation: "Ibeju-Lekki", projectType: "Mixed Use", yearsOfExperience: "11-15 years", companyName: "Capitol Real Estate Fund" },
    documents: {
      companyProfile: sampleDoc("Capitol Fund profile 2026.jpg", "/placeholders/tower-01.jpg", 1_204_000),
      proofOfFunds: sampleDoc("Proof of funds - Access Bank.jpg", "/placeholders/estate-01.jpg", 288_000),
    },
    createdAt: "2026-08-01T10:10:00+01:00", lastActiveAt: "2026-10-11T12:00:00+01:00",
  },
  {
    id: "usr-07", fullName: "Ibrahim Danjuma", email: "ibrahim.d@example.com", phoneNumber: "+234 803 664 2210", role: "Landowner", category: "Individual", status: "active",
    profile: { landLocation: "Guzape, Abuja", landSize: "1,200 sqm", documentationStatus: "Fully Documented", preferredPartnershipType: "Joint Venture", landDescription: "Gentle-slope plot with city views and a tarred access road." },
    createdAt: "2026-08-14T08:50:00+01:00", lastActiveAt: "2026-09-25T16:21:00+01:00",
  },
  {
    id: "usr-08", fullName: "Tunde Bakare", email: "tunde.bakare@example.com", phoneNumber: "+234 812 345 6789", role: "Investor", category: "Individual", status: "suspended",
    profile: { investmentType: "Debt", budgetRange: "Under $100k", preferredLocation: "Anywhere", projectType: "Residential", yearsOfExperience: "0-2 years", companyName: "" },
    documents: { companyProfile: sampleDoc("Profile.jpg", "/placeholders/estate-02.jpg", 96_000) },
    createdAt: "2026-08-20T19:05:00+01:00", lastActiveAt: "2026-09-02T10:00:00+01:00",
  },
  {
    id: "usr-09", fullName: "Delta State Housing Agency", email: "projects@dsha.example.gov.ng", phoneNumber: "+234 803 700 1000", role: "Investor", category: "Government", status: "active",
    profile: { investmentType: "Joint Venture", organizationType: "Corporation", registrationLicenseNumber: "DTSG/HA/001", budgetRange: "Over $10M", preferredLocation: "Asaba, Delta", projectType: "Residential", yearsOfExperience: "20+ years", companyName: "Delta State Housing Agency" },
    documents: { companyProfile: sampleDoc("DSHA agency profile.jpg", "/placeholders/tower-03.jpg", 990_000) },
    createdAt: "2026-09-03T09:00:00+01:00", lastActiveAt: "2026-10-08T14:30:00+01:00",
  },
  {
    id: "usr-10", fullName: "Amaka Obi", email: "amaka.obi@example.com", phoneNumber: "+234 816 202 3344", role: "Buyer", category: "Individual", status: "active",
    profile: { propertyWanted: "Land", budgetRange: "$100k - $500k", preferredLocation: "Sangotedo or Ajah", purpose: "As an investment", timeline: "Within 6 months", paymentMethod: "Instalments" },
    createdAt: "2026-09-16T12:40:00+01:00", lastActiveAt: "2026-10-12T07:55:00+01:00",
  },
  {
    id: "usr-11", fullName: "Bisi Adeleke", email: "bisi.adeleke@example.com", phoneNumber: "+234 805 881 7720", role: "Landowner", category: "Individual", status: "pending",
    profile: { landLocation: "Okun Ajah, Lekki", landSize: "8,000 sqm", documentationStatus: "In Progress", preferredPartnershipType: "Joint Venture", landDescription: "Lagoon-front land, sand-filled, suited to a resort." },
    createdAt: "2026-10-04T17:15:00+01:00", lastActiveAt: "2026-10-11T21:10:00+01:00",
  },
  {
    id: "usr-12", fullName: "Kelechi Nwosu", email: "kelechi.n@example.com", phoneNumber: "+234 708 119 0045", role: "Investor", category: "Individual", status: "pending",
    profile: { investmentType: "Equity", budgetRange: "$100k - $500k", preferredLocation: "Lagos", projectType: "Residential", yearsOfExperience: "0-2 years", companyName: "Nwosu Capital" },
    documents: { companyProfile: sampleDoc("Nwosu Capital profile.jpg", "/placeholders/estate-01.jpg", 402_000) },
    createdAt: "2026-10-10T10:00:00+01:00", lastActiveAt: "2026-10-12T09:40:00+01:00",
  },
  {
    id: "usr-13", fullName: "Olumide Johnson", email: "olumide.j@example.com", phoneNumber: "+234 809 201 3344", role: "Landowner", category: "Individual", status: "active",
    profile: { landLocation: "Ijede, Ikorodu", landSize: "300 sqm", documentationStatus: "In Progress", preferredPartnershipType: "Joint Venture", landDescription: "Dry half-plot on a tarred road near the Ijede jetty." },
    createdAt: "2026-10-08T15:20:00+01:00", lastActiveAt: "2026-10-12T13:10:00+01:00",
  },
  {
    id: "usr-14", fullName: "Grace Etim", email: "grace.etim@example.com", phoneNumber: "+234 802 330 1122", role: "Landowner", category: "Individual", status: "active",
    profile: { landLocation: "GRA Phase 2, Port Harcourt", landSize: "650 sqm", documentationStatus: "Fully Documented", preferredPartnershipType: "Outright Sale", landDescription: "Four-bedroom detached house on a corner plot." },
    createdAt: "2026-10-06T11:00:00+01:00", lastActiveAt: "2026-10-11T16:45:00+01:00",
  },
  {
    id: "usr-admin", fullName: "JVA Admin", email: "admin@jointventureassets.com", password: "admin123", phoneNumber: "", role: "Admin", category: "Staff", status: "active",
    profile: {}, createdAt: "2026-06-01T09:00:00+01:00", lastActiveAt: "2026-10-12T09:00:00+01:00",
  },
];

export const seedAccounts: StoredAccount[] = seeds.map((seed) => ({
  kind: "account",
  password: DEMO_PASSWORD,
  documents: {},
  profileCompleted: Object.keys(seed.profile).length > 0 || seed.role === "Admin",
  updatedAt: seed.createdAt,
  ...seed,
}));
