import type { DealType, PropertyType } from "@/types";

export const dealTypeLabel: Record<DealType, string> = {
  jv: "Joint venture",
  sale: "For sale",
};

export const propertyTypeLabel: Record<PropertyType, string> = {
  land: "Land",
  residential: "Residential",
  commercial: "Commercial",
  mixed_use: "Mixed use",
};

/** The same choices the admin dashboard offers when creating a listing. */
export const titleDocuments = ["C of O", "Governor's Consent", "Deed of Assignment", "Excision", "Gazette", "Survey plan only"];

export const sharingFormulas = ["30/70", "35/65", "40/60", "50/50", "60/40"];
