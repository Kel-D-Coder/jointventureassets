"use client";

import { Field, Select, inputClass } from "@/components/ui/form";
import { cx } from "@/lib/format";
import { requestTimelines } from "@/lib/requests";

export interface ProfileFieldSpec {
  name: string;
  label: string;
  kind?: "text" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  hint?: string;
  /** Spans both columns of the form grid. */
  wide?: boolean;
}

/** Renders a list of profile fields in a two-column grid with the shared styling. */
export function ProfileFields({
  fields,
  values,
  onChange,
}: {
  fields: ProfileFieldSpec[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <>
      {fields.map((field) => {
        const id = `profile-${field.name}`;
        const common = {
          id,
          name: field.name,
          value: values[field.name] ?? "",
          required: field.required,
        };
        return (
          <Field key={field.name} label={field.label} htmlFor={id} required={field.required} hint={field.hint} className={cx(field.wide && "sm:col-span-2")}>
            {field.kind === "select" ? (
              <Select {...common} options={field.options ?? []} placeholder={`Select ${field.label.toLowerCase()}`} onChange={(e) => onChange(field.name, e.target.value)} />
            ) : field.kind === "textarea" ? (
              <textarea {...common} rows={4} className={inputClass} onChange={(e) => onChange(field.name, e.target.value)} />
            ) : (
              <input {...common} type="text" className={inputClass} onChange={(e) => onChange(field.name, e.target.value)} />
            )}
          </Field>
        );
      })}
    </>
  );
}

const budgetRanges = ["Under $100k", "$100k - $500k", "$500k - $1M", "$1M - $5M", "$5M - $10M", "Over $10M"];

const organizationTypes = ["Individual", "Cooperative", "Corporation", "Partnership", "LLC"];

/** Organisation details asked of any non-individual. */
function organizationFields(extraTypes: string[] = []): ProfileFieldSpec[] {
  return [
    { name: "organizationType", label: "Organisation type", kind: "select", options: [...organizationTypes, ...extraTypes], required: true },
    { name: "registrationLicenseNumber", label: "Registration / licence number", required: true },
  ];
}

export function landownerFields(category: string): ProfileFieldSpec[] {
  return [
    ...(category === "Cooperative" || category === "Government" ? organizationFields() : []),
    { name: "landLocation", label: "Land location", required: true, hint: "Area, city and state" },
    { name: "landSize", label: "Land size", required: true, hint: "In sqm, plots or hectares" },
    {
      name: "documentationStatus",
      label: "Documentation status",
      kind: "select",
      options: ["Fully Documented", "Partially Documented", "In Progress", "Not Yet Documented"],
      required: true,
    },
    {
      name: "preferredPartnershipType",
      label: "Preferred deal",
      kind: "select",
      options: ["Joint Venture", "Lease Agreement", "Outright Sale", "Revenue Sharing", "Development Partnership"],
      required: true,
    },
    { name: "landDescription", label: "Describe the land", kind: "textarea", required: true, wide: true, hint: "Access roads, terrain, what's around it, any structures on it" },
  ];
}

export function investorFields(category: string): ProfileFieldSpec[] {
  return [
    { name: "investmentType", label: "Investment type", kind: "select", options: ["Equity", "Debt", "Hybrid", "Joint Venture"], required: true },
    ...(category !== "Individual" ? organizationFields() : []),
    {
      name: "budgetRange",
      label: "Budget range",
      kind: "select",
      options: budgetRanges,
      required: true,
    },
    { name: "preferredLocation", label: "Preferred location", required: true, hint: "e.g. Lekki, Abuja, anywhere in Lagos" },
    {
      name: "projectType",
      label: "Project type",
      kind: "select",
      options: ["Residential", "Commercial", "Industrial", "Mixed Use", "Agricultural", "Hospitality"],
      required: true,
    },
    {
      name: "yearsOfExperience",
      label: "Years of experience",
      kind: "select",
      options: ["0-2 years", "3-5 years", "6-10 years", "11-15 years", "16-20 years", "20+ years"],
      required: true,
    },
    { name: "companyName", label: "Company name", hint: "Optional" },
  ];
}

export function buyerFields(category: string): ProfileFieldSpec[] {
  return [
    ...(category !== "Individual" ? organizationFields(["Government"]) : []),
    {
      name: "propertyWanted",
      label: "What are you looking to buy?",
      kind: "select",
      options: ["Land", "Residential", "Commercial", "Mixed Use", "Agricultural"],
      required: true,
    },
    { name: "budgetRange", label: "Budget range", kind: "select", options: budgetRanges, required: true },
    { name: "preferredLocation", label: "Preferred location", required: true, hint: "e.g. Lekki, Abuja, anywhere in Lagos" },
    { name: "purpose", label: "Purpose", kind: "select", options: ["To live in", "For business use", "As an investment"], required: true },
    {
      name: "timeline",
      label: "When do you want to buy?",
      kind: "select",
      options: requestTimelines,
      required: true,
    },
    { name: "paymentMethod", label: "How will you pay?", kind: "select", options: ["Outright payment", "Instalments", "Mortgage", "Not sure yet"], required: true },
    { name: "companyName", label: "Company name", hint: "Optional" },
  ];
}

/** The profile questions for each role. */
export function profileFieldsFor(role: string, category: string): ProfileFieldSpec[] {
  if (role === "Landowner") return landownerFields(category);
  if (role === "Buyer") return buyerFields(category);
  return investorFields(category);
}
