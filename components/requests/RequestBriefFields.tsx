"use client";

import { useEffect, type ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";
import { Field, MoneyInput, Select, YesNo, inputClass } from "@/components/ui/form";
import {
  developmentTypes,
  jvPropertyKinds,
  partnershipTypes,
  paymentMethods,
  requestTimelines,
  propertiesWanted,
  requestSummary,
  sharingFormulas,
  titleDocuments,
  formatSizeRange,
  hasSize,
  type Brief,
} from "@/lib/requests";
import type { RequestType } from "@/types";

/** What the member wants us to find, with the fields that matter for that kind of request. */
export function RequestBriefFields({ type, value, onChange }: { type: RequestType; value: Brief; onChange: (next: Brief) => void }) {
  const set = <K extends keyof Brief>(key: K, next: Brief[K]) => onChange({ ...value, [key]: next });
  const text = (key: keyof Brief) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(key, event.target.value as never);

  // A joint venture is on land unless they choose a building, so the choice starts on "Land".
  useEffect(() => {
    if (type === "jv" && !value.propertyWanted) set("propertyWanted", "land");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, value.propertyWanted]);
  const summary = requestSummary({
    requestType: type,
    location: value.location,
    budget: value.budget,
    landSize: formatSizeRange(value.sizeMin, value.sizeMax),
    propertyWanted: value.propertyWanted,
    developmentType: value.developmentType,
    partnershipType: value.partnershipType,
    housingProposal: value.housingProposal,
    premium: type === "jv" && value.premiumWanted ? (value.premiumWanted === "yes" ? Number(value.premium) || undefined : 0) : undefined,
  });

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {type === "jv" ? (
        <Field label="What kind of joint venture?" htmlFor="propertyWanted" required>
          <Select id="propertyWanted" value={value.propertyWanted || "land"} onChange={text("propertyWanted")} options={jvPropertyKinds} />
        </Field>
      ) : null}
      {type === "purchase" ? (
        <Field label="What kind of property?" htmlFor="propertyWanted" required>
          <Select id="propertyWanted" value={value.propertyWanted} onChange={text("propertyWanted")} options={propertiesWanted} placeholder="Select property type" />
        </Field>
      ) : null}
      {type === "development" ? (
        <Field label="What kind of development?" htmlFor="developmentType" required>
          <Select id="developmentType" value={value.developmentType} onChange={text("developmentType")} options={developmentTypes} placeholder="Select development type" />
        </Field>
      ) : null}
      {type === "partnership" ? (
        <Field label="Who are you looking for?" htmlFor="partnershipType" required>
          <Select id="partnershipType" value={value.partnershipType} onChange={text("partnershipType")} options={partnershipTypes} placeholder="Select a professional" />
        </Field>
      ) : null}

      <Field label="Where?" htmlFor="location" required hint="Area, city or state you want.">
        <input id="location" value={value.location} onChange={text("location")} className={inputClass} placeholder="e.g. Lekki, Lagos" />
      </Field>

      <Field
        label={type === "jv" ? "Your budget for the project (₦)" : type === "partnership" ? "Fee budget (₦)" : "Your budget, up to (₦)"}
        htmlFor="budget"
        required
      >
        <MoneyInput id="budget" value={value.budget} onChange={(digits) => set("budget", digits)} placeholder="e.g. 500,000,000" />
      </Field>

      {hasSize(type) ? (
        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 text-sm font-semibold text-ink">
            Size range you want (sqm)<span className="ml-0.5 text-gold-deep" aria-hidden="true">*</span>
          </legend>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <MoneyInput aria-label="Smallest size in sqm" value={value.sizeMin} onChange={(digits) => set("sizeMin", digits)} placeholder="From, e.g. 600" />
            <span className="text-sm text-muted">to</span>
            <MoneyInput aria-label="Largest size in sqm" value={value.sizeMax} onChange={(digits) => set("sizeMax", digits)} placeholder="To, e.g. 1,000" />
          </div>
          <p className="mt-1.5 text-xs text-muted">1 hectare = 10,000 sqm.</p>
        </fieldset>
      ) : null}

      {type === "jv" ? (
        <>
          <Field label="What do you plan to build?" htmlFor="housingProposal" required hint="In your own words: how many units, and of what.">
            <textarea
              id="housingProposal"
              rows={3}
              value={value.housingProposal}
              onChange={text("housingProposal")}
              placeholder="e.g. 6 units of apartments, 3 units of duplexes"
              className={inputClass}
            />
          </Field>
          <Field label="Sharing formula you'd accept" htmlFor="sharingFormula" required hint="Landowner / developer.">
            <Select id="sharingFormula" value={value.sharingFormula} onChange={text("sharingFormula")} options={sharingFormulas} placeholder="Select a formula" />
          </Field>
          <YesNo
            name="premiumWanted"
            legend="Will you pay a premium to the landowner?"
            value={value.premiumWanted}
            onChange={(answer) => set("premiumWanted", answer)}
            yes="Yes, up to an amount"
            no="No premium"
            className="sm:col-span-2"
          />
          {value.premiumWanted === "yes" ? (
            <Field label="Most you'd pay as a premium (₦)" htmlFor="premium" required hint="We'll only bring you deals at or below this.">
              <MoneyInput id="premium" value={value.premium} onChange={(digits) => set("premium", digits)} placeholder="e.g. 20,000,000" />
            </Field>
          ) : null}
        </>
      ) : null}

      {type === "land" || type === "purchase" ? (
        <>
          <Field label="Title you'd accept" htmlFor="titleDocument" required >
            <Select id="titleDocument" value={value.titleDocument} onChange={text("titleDocument")} options={titleDocuments} placeholder="Select a title" />
          </Field>
          <Field label="How will you pay?" htmlFor="paymentMethod" required >
            <Select id="paymentMethod" value={value.paymentMethod} onChange={text("paymentMethod")} options={paymentMethods} placeholder="Select payment method" />
          </Field>
        </>
      ) : null}

      <Field label="When do you need it?" htmlFor="timeline" required >
        <Select
          id="timeline"
          value={value.timeline}
          onChange={text("timeline")}
          // Older requests typed their own timeline; keep it as a choice so it isn't lost when editing.
          options={value.timeline && !requestTimelines.includes(value.timeline) ? [value.timeline, ...requestTimelines] : requestTimelines}
          placeholder="Choose a timeline"
        />
      </Field>

      <div className="rounded-xl border border-gold/30 bg-gold-soft/40 p-4 sm:col-span-2" aria-live="polite">
        <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-gold-deep uppercase">
          <FiSearch aria-hidden="true" /> Your request
        </p>
        <p className="mt-1.5 text-sm font-medium text-ink">{summary}</p>
      </div>
    </div>
  );
}
