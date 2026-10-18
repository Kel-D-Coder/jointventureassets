import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiMaximize, FiMapPin } from "react-icons/fi";
import { DealBadge } from "@/components/listings/DealBadge";
import { propertyTypeLabel } from "@/components/listings/labels";
import { formatNairaShort, formatSize } from "@/lib/format";
import type { Listing } from "@/types";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(14_17_22/0.35)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-ivory">
        <Image
          src={listing.images[0]!}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <DealBadge dealType={listing.dealType} />
          {listing.status === "under_offer" ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink">Under offer</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
          <FiMapPin aria-hidden="true" /> {listing.area}, {listing.city}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug text-ink">{listing.title}</h3>

        <div className="mt-3 mb-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <FiMaximize aria-hidden="true" /> {formatSize(listing.sizeSqm)}
          </span>
          <span>{propertyTypeLabel[listing.propertyType]}</span>
          <span>{listing.titleDocument}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-wider text-muted uppercase">
              {listing.dealType === "jv" ? "Land value" : "Asking price"}
            </p>
            <p className="mt-0.5 text-lg font-extrabold text-ink">{formatNairaShort(listing.price)}</p>
          </div>
          {listing.jv ? (
            <div className="text-right">
              <p className="text-[0.6875rem] font-bold tracking-wider text-muted uppercase">Sharing</p>
              <p className="mt-0.5 text-lg font-extrabold text-gold-deep">{listing.jv.sharingFormula}</p>
              {listing.jv.sharingNegotiable !== undefined ? (
                <p className="text-[0.6875rem] font-semibold text-muted">{listing.jv.sharingNegotiable ? "Negotiable" : "Fixed"}</p>
              ) : null}
            </div>
          ) : listing.verified ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
              <FiCheckCircle aria-hidden="true" /> Verified title
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white" aria-hidden="true">
      <div className="aspect-[16/11] animate-pulse bg-ivory" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-ivory" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-ivory" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ivory" />
        <div className="h-10 animate-pulse rounded bg-ivory" />
      </div>
    </div>
  );
}
