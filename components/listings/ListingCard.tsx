import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiMaximize, FiMapPin } from "react-icons/fi";
import { DealBadge } from "@/components/listings/DealBadge";
import { priceNegotiableLabel, propertyTypeLabel } from "@/components/listings/labels";
import { formatNairaShort, formatSize } from "@/lib/format";
import type { Listing } from "@/types";
import { coverOf } from "@/lib/videoWatermark";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgb(14_17_22/0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_48px_-28px_rgb(14_17_22/0.45)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-ivory">
        <Image
          src={coverOf(listing.images) ?? listing.images[0]!}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink/35 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <DealBadge dealType={listing.dealType} />
          {listing.status === "under_offer" ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink shadow-sm">Under offer</span>
          ) : null}
        </div>
      </div>

      {/* A gold hairline between photo and details, brighter on hover. */}
      <span aria-hidden="true" className="h-0.5 bg-linear-to-r from-transparent via-gold/50 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
          <FiMapPin aria-hidden="true" className="text-gold-deep" /> {listing.area}, {listing.city}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-snug text-ink">{listing.title}</h3>

        <div className="mt-3 mb-5 flex flex-wrap gap-2 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory px-2.5 py-1">
            <FiMaximize aria-hidden="true" /> {formatSize(listing.sizeSqm)}
          </span>
          <span className="rounded-full bg-ivory px-2.5 py-1">{propertyTypeLabel[listing.propertyType]}</span>
          <span className="rounded-full bg-ivory px-2.5 py-1">{listing.titleDocument}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-wider text-muted uppercase">
              {listing.dealType === "jv" ? "Land value" : "Asking price"}
            </p>
            <p className="mt-0.5 text-lg font-extrabold text-ink tabular-nums">{formatNairaShort(listing.price)}</p>
            {listing.dealType === "sale" && listing.priceNegotiable ? (
              <p className="text-[0.6875rem] font-semibold text-muted">{priceNegotiableLabel[listing.priceNegotiable]}</p>
            ) : null}
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
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition group-hover:border-ink group-hover:bg-ink group-hover:text-gold">
              <FiArrowRight aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white" aria-hidden="true">
      <div className="aspect-[16/11] animate-pulse bg-ivory" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-1/3 animate-pulse rounded bg-ivory" />
        <div className="h-6 w-4/5 animate-pulse rounded bg-ivory" />
        <div className="h-5 w-1/2 animate-pulse rounded-full bg-ivory" />
        <div className="h-10 animate-pulse rounded bg-ivory" />
      </div>
    </div>
  );
}
