import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { getFeaturedListings } from "@/lib/api/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Server component: the featured listings are rendered into the homepage HTML. */
export async function FeaturedListings() {
  const listings = await getFeaturedListings(3);

  return (
    <section className="bg-ivory py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured opportunities"
          title="Hand-picked land and property, verified by our team"
          intro="Every featured listing has had its title documents checked and its owner vetted before it goes live."
          action={
            <Link href="/listings" className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white">
              View all listings <FiArrowRight aria-hidden="true" />
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
