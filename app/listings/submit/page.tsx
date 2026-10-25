import { Suspense } from "react";
import type { Metadata } from "next";
import { SubmitListingForm } from "@/components/listings/SubmitListingForm";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "List Your Property | Joint Venture Assets",
  description: "List your land or property with Joint Venture Assets, for a joint venture or an outright sale. Our team verifies every listing before it goes live.",
};

const steps = [
  ["You submit", "Add the property details, photos and title documents. Save a draft any time and finish later."],
  ["We verify", "Our team checks the title and details, usually within 48 hours. Your listing shows as pending until then."],
  ["It goes live", "Once approved it appears on the listings page, and we bring you serious enquiries."],
];

export default function SubmitListingPage() {
  return (
    <main className="bg-white pb-24">
      <PageHero
        tone="dark"
        eyebrow="List your property"
        title="Put your land or property in front of serious partners"
        intro="For a joint venture or an outright sale. Listing is free; a facilitation fee applies only when a deal completes."
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-ivory" />}>
          <SubmitListingForm />
        </Suspense>
        <aside className="order-first self-start rounded-2xl bg-ink p-7 text-white lg:sticky lg:top-28 lg:order-none">
          <p className="eyebrow text-gold">How it works</p>
          <ol className="mt-5 space-y-5 text-sm">
            {steps.map(([title, body], index) => (
              <li key={title} className="flex gap-4">
                <span className="font-display text-2xl leading-none text-gold">{index + 1}</span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-0.5 block text-gray-400">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </main>
  );
}
