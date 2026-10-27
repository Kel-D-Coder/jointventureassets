import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiClock, FiHome, FiLock, FiTag } from "react-icons/fi";
import { dealTypeLabel, priceText } from "@/components/listings/labels";
import type { OwnedListing } from "@/lib/api/listings";

const statusStyle: Record<OwnedListing["status"], { label: string; className: string; icon: typeof FiClock }> = {
  published: { label: "Live", className: "bg-green-50 text-green-800 ring-green-200", icon: FiCheckCircle },
  under_offer: { label: "Under offer", className: "bg-gold-soft text-gold-deep ring-gold/40", icon: FiTag },
  draft: { label: "Being prepared", className: "bg-amber-50 text-amber-800 ring-amber-200", icon: FiClock },
  closed: { label: "Closed", className: "bg-ivory text-ink ring-line", icon: FiLock },
};

/** Listings the JVA team created with the member as owner. Live ones link to their page on the site. */
export default function OwnedListingList({ listings }: { listings: OwnedListing[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {listings.map((listing) => {
        const { label, className, icon: Icon } = statusStyle[listing.status];
        const live = listing.status === "published" || listing.status === "under_offer";
        return (
          <li
            key={listing.id}
            className="flex gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-gold/50 hover:shadow-[0_14px_32px_-22px_rgb(14_17_22/0.4)]"
          >
            {listing.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.cover} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover ring-1 ring-line" />
            ) : (
              <span className="grid h-20 w-24 shrink-0 place-items-center rounded-xl bg-ivory text-xl text-gold-deep ring-1 ring-line">
                <FiHome aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${className}`}>
                  <Icon aria-hidden="true" /> {label}
                </span>
                <span className="text-xs font-medium text-muted">{dealTypeLabel[listing.dealType]}</span>
              </div>
              <p className="mt-1.5 truncate font-semibold text-ink">{listing.title}</p>
              <p className="mt-0.5 truncate text-sm text-muted">
                {[[listing.area, listing.city].filter(Boolean).join(", "), listing.landValueTbd ? "Land value TBD" : listing.price ? priceText(listing, true) : ""].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1 text-[0.6875rem] font-semibold tracking-wide text-gold-deep uppercase">Listed for you by JVA</p>
              {live ? (
                <Link href={`/listings/${listing.id}`} className="group mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:underline">
                  View listing <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
