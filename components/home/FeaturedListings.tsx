import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { getFeaturedListings } from "@/lib/api/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { SectionHeading, sectionAction } from "@/components/ui/SectionHeading";
import { ConsoleLog } from "@/components/ConsoleLog";

/** Server component: the featured listings are rendered into the homepage HTML. */
export async function FeaturedListings() {
  const listings = await getFeaturedListings(3);
  // TEMP: what the homepage's featured section shows (source: GET /listings/approved, featured only, newest first, top 3).
  const summary = listings.map((listing) => ({ id: listing.id, title: listing.title, featured: listing.featured, dealType: listing.dealType, price: listing.price, createdAt: listing.createdAt }));
  console.log("[featured listings] from GET /listings/approved:", summary);

  // Nothing ticked "Feature on the homepage": leave the section out rather than show an empty one.
  if (listings.length === 0) return null;

  return (
    <section className="bg-linear-to-b from-ivory to-white py-20 sm:py-24">
      <ConsoleLog label="[featured listings] from GET /listings/approved:" data={summary} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured opportunities"
          title="Hand-picked land and property, verified by our team"
          intro="Every featured listing has had its title documents checked and its owner vetted before it goes live."
          action={
            <Link href="/listings" className={sectionAction}>
              View all listings <FiArrowRight aria-hidden="true" className="text-gold-deep transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
