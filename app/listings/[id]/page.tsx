import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getApprovedListings } from "@/lib/api/listings";
import { FiArrowLeft, FiCheck, FiCheckCircle, FiMapPin, FiStar } from "react-icons/fi";
import { getListing, similarListings } from "@/lib/api/listings";
import { EnquiryForm } from "@/components/enquiries/EnquiryForm";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingCard } from "@/components/listings/ListingCard";
import { propertyTypeLabel } from "@/components/listings/labels";
import { formatNaira, formatSize, premiumText } from "@/lib/format";
import type { Listing } from "@/types";

type Props = { params: Promise<{ id: string }> };

/** "Land for joint venture", "Residential property for sale"… */
function kindLine(listing: Listing): string {
  const kind = listing.propertyType === "land" ? "Land" : `${propertyTypeLabel[listing.propertyType]} property`;
  return listing.dealType === "jv" ? `${kind} for joint venture` : `${kind} for sale`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListing((await params).id);
  if (!listing) return { title: "Listing not found | Joint Venture Assets" };
  return {
    title: `${listing.title}, ${listing.area}, ${listing.city} | Joint Venture Assets`,
    description: listing.description,
    openGraph: { images: [{ url: listing.images[0]! }] },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const listing = await getListing((await params).id);
  if (!listing) notFound();

  const all = await getApprovedListings().catch(() => []);
  const similar = all
    .filter((other) => other.id !== listing.id && other.dealType === listing.dealType)
    .sort((a, b) => Number(b.state === listing.state) - Number(a.state === listing.state))
    .slice(0, 3);
  const facts = [
    { label: listing.dealType === "jv" ? "Land value" : "Asking price", value: formatNaira(listing.price) },
    { label: "Size", value: formatSize(listing.sizeSqm) },
    { label: "Property type", value: propertyTypeLabel[listing.propertyType] },
    { label: "Title document", value: listing.titleDocument },
  ];

  return (
    <main className="bg-white pb-24">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/listings" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <FiArrowLeft aria-hidden="true" /> All listings
        </Link>

        <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-[0_10px_30px_-24px_rgb(14_17_22/0.35)] sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {listing.featured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-deep">
                    <FiStar aria-hidden="true" /> Featured
                  </span>
                ) : null}
                {listing.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-800">
                    <FiCheckCircle aria-hidden="true" /> Title verified
                  </span>
                ) : null}
                {listing.status === "under_offer" ? (
                  <span className="rounded-full bg-ivory px-3 py-1 text-xs font-bold text-ink">Under offer</span>
                ) : null}
              </div>

              <p className="mt-4 text-sm font-semibold text-gold-deep">{kindLine(listing)}</p>
              <h1 className="mt-1.5 text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl">{listing.title}</h1>
              <p className="mt-3 flex items-center gap-2 text-muted">
                <FiMapPin aria-hidden="true" className="shrink-0" /> {listing.area}, {listing.city}, {listing.state}
              </p>
            </div>

            <div className="shrink-0 lg:text-right">
              <p className="text-3xl font-bold tracking-tight text-ink tabular-nums sm:text-4xl">{formatNaira(listing.price)}</p>
              <p className="mt-1 text-sm text-muted">{listing.dealType === "jv" ? "Land value" : "Asking price"}</p>
              {listing.jv ? (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5 text-sm font-semibold text-ink">
                  {listing.jv.sharingFormula} sharing
                  {listing.jv.sharingNegotiable !== undefined ? (
                    <span className="font-medium text-muted">· {listing.jv.sharingNegotiable ? "Negotiable" : "Fixed"}</span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-8">
          <ListingGallery images={listing.images} title={listing.title} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-12">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-white p-5">
                  <dt className="eyebrow text-muted">{fact.label}</dt>
                  <dd className="mt-2 font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {listing.jv ? (
              <section className="rounded-2xl bg-ink p-6 text-white sm:p-8">
                <p className="eyebrow text-gold">Joint-venture terms</p>
                <dl className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-gray-400">Sharing formula</dt>
                    <dd className="mt-1 flex flex-wrap items-center gap-3">
                      <span className="font-display text-3xl text-gold">{listing.jv.sharingFormula}</span>
                      {listing.jv.sharingNegotiable !== undefined ? (
                        <span className={listing.jv.sharingNegotiable ? "rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold text-gold" : "rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-gray-300"}>
                          {listing.jv.sharingNegotiable ? "Negotiable" : "Fixed, not negotiable"}
                        </span>
                      ) : null}
                    </dd>
                    <dd className="text-xs text-gray-400">Landowner / developer</dd>
                  </div>
                  {premiumText(listing.jv.premium) ? (
                    <div>
                      <dt className="text-sm text-gray-400">Premium</dt>
                      <dd className="mt-1 font-display text-3xl text-white">{premiumText(listing.jv.premium)}</dd>
                      <dd className="text-xs text-gray-400">{listing.jv.premium ? "Paid upfront by the developer" : "No upfront payment to the landowner"}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-sm text-gray-400">Proposal</dt>
                    <dd className="mt-1 font-semibold">{listing.jv.proposal || "No"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Build period</dt>
                    <dd className="mt-1 font-semibold">{listing.jv.duration}</dd>
                  </div>
                </dl>
              </section>
            ) : null}

            <section>
              <h2 className="font-display text-2xl text-ink">About this {listing.dealType === "jv" ? "opportunity" : "property"}</h2>
              <p className="mt-4 leading-relaxed text-gray-700">{listing.description}</p>
              {listing.highlights.length ? (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {listing.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-3 text-sm font-medium text-ink">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-deep">
                        <FiCheck aria-hidden="true" className="h-3.5 w-3.5" />
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="rounded-2xl border border-line bg-ivory p-6">
              <h2 className="font-bold text-ink">Listed by {listing.ownerName}</h2>
              <p className="mt-1 text-sm text-muted">
                Contact details are shared once JVA has introduced you. All negotiations are managed through our team.
              </p>
            </section>
          </div>

          <aside>
            <div className="rounded-2xl border border-line p-6 shadow-[0_18px_40px_-24px_rgb(14_17_22/0.35)] lg:sticky lg:top-24">
              <EnquiryForm
                target={{ type: "listing", id: listing.id, title: listing.title, subtitle: `${listing.area}, ${listing.city}`, image: listing.images[0] }}
                eyebrow={listing.dealType === "jv" ? "Joint venture enquiry" : "Purchase enquiry"}
                jointVenture={listing.dealType === "jv"}
                defaultMessage={
                  listing.dealType === "jv"
                    ? `I'm interested in partnering on "${listing.title}". Please share the full JV terms.`
                    : `I'm interested in buying "${listing.title}". Please arrange an inspection.`
                }
                submitLabel={listing.dealType === "jv" ? "Request JV terms" : "Request an inspection"}
              />
            </div>
          </aside>
        </div>

        {similar.length ? (
          <section className="mt-20">
            <h2 className="font-display text-3xl text-ink">
              More {listing.dealType === "jv" ? "joint-venture opportunities" : "properties for sale"}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((other) => (
                <li key={other.id}>
                  <ListingCard listing={other} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
