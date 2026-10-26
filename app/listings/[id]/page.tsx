import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getApprovedListings } from "@/lib/api/listings";
import { FiArrowLeft, FiCheck, FiCheckCircle, FiMapPin, FiStar, FiUser } from "react-icons/fi";
import { PanelDecor } from "@/components/ui/PanelDecor";
import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getListing } from "@/lib/api/listings";
import { EnquiryForm } from "@/components/enquiries/EnquiryForm";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingCard } from "@/components/listings/ListingCard";
import { ExpandableDescription } from "@/components/listings/ExpandableDescription";
import { SHARING_TBD, isEstate, priceNegotiableLabel, priceText, propertyTypeLabel, sharingFormulaLabel, sizeText, splitTitles } from "@/components/listings/labels";
import { formatNaira, formatSize, premiumText } from "@/lib/format";
import type { Listing } from "@/types";
import { coverOf, joinMedia } from "@/lib/videoWatermark";

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
    openGraph: { images: [{ url: coverOf(listing.images) ?? listing.images[0]! }] },
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
    { label: listing.dealType === "jv" ? "Land value" : "Asking price", value: priceText(listing) },
    { label: isEstate(listing) ? "Plot sizes" : "Size", value: sizeText(listing) },
    { label: "Property type", value: propertyTypeLabel[listing.propertyType] },
    { label: splitTitles(listing.titleDocument).length > 1 ? "Title documents" : "Title document", value: listing.titleDocument },
  ];

  return (
    <main className="bg-white pb-24">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/listings" className="group inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink">
          <FiArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" /> All listings
        </Link>

        <section className="relative mt-5 overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-[0_24px_60px_-30px_rgb(14_17_22/0.6)] sm:p-9">
          <PanelDecor />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/15">Under offer</span>
                ) : null}
              </div>

              <p className="mt-5 text-xs font-bold tracking-[0.18em] text-gold uppercase">{kindLine(listing)}</p>
              <h1 className="mt-2 font-display text-4xl leading-tight text-white sm:text-5xl">{listing.title}</h1>
              <p className="mt-3 flex items-center gap-2 text-white/65">
                <FiMapPin aria-hidden="true" className="shrink-0 text-gold" /> {listing.area}, {listing.city}, {listing.state}
              </p>
            </div>

            <div className="shrink-0 lg:border-l lg:border-white/10 lg:pl-8 lg:text-right">
              <p className="text-xs font-semibold tracking-wide text-white/55 uppercase">{listing.dealType === "jv" ? "Land value" : "Asking price"}</p>
              <p className="mt-1 font-display text-4xl leading-none text-white sm:text-5xl">{priceText(listing)}</p>
              {listing.dealType === "sale" && listing.priceNegotiable && !isEstate(listing) ? (
                <p className="mt-4 inline-flex items-center rounded-full bg-gold/15 px-3 py-1.5 text-sm font-semibold text-gold-soft ring-1 ring-gold/30">
                  {priceNegotiableLabel[listing.priceNegotiable]}
                </p>
              ) : null}
              {listing.jv ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1.5 text-sm font-semibold text-gold-soft ring-1 ring-gold/30">
                  {listing.jv.sharingFormula === SHARING_TBD ? "Sharing to be discussed" : `${listing.jv.sharingFormula} sharing`}
                  {listing.jv.sharingFormula !== SHARING_TBD && listing.jv.sharingNegotiable !== undefined ? (
                    <span className="font-medium text-white/60">· {listing.jv.sharingNegotiable ? "Negotiable" : "Fixed"}</span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-8">
          <ListingGallery images={joinMedia(listing.images, listing.videos)} title={listing.title} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-12">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="relative overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgb(14_17_22/0.04)]"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-gold/50 to-transparent" />
                  <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{fact.label}</dt>
                  <dd className="mt-2 font-display text-xl text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {listing.jv ? <JvTerms jv={listing.jv} /> : null}

            {isEstate(listing) ? (
              <Panel title="Plot sizes & prices" subtitle="Each plot size has its own price. Ask about any of them in the enquiry form.">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-lg text-left text-sm">
                    <thead className="text-xs font-semibold tracking-wide text-muted uppercase">
                      <tr className="border-b border-line [&>th]:pb-3">
                        <th>Plot size</th>
                        <th>Price</th>
                        <th>Negotiable</th>
                        <th className="text-right">Initial deposit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line [&_td]:py-3.5">
                      {listing.plotOptions!.map((option, index) => (
                        <tr key={index}>
                          <td className="font-display text-lg text-ink">{formatSize(option.sizeSqm)}</td>
                          <td className="font-semibold text-ink tabular-nums">{formatNaira(option.price)}</td>
                          <td>
                            {option.priceNegotiable ? (
                              <span className="rounded-full bg-ivory px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-line">{priceNegotiableLabel[option.priceNegotiable]}</span>
                            ) : (
                              <span className="text-muted">Not stated</span>
                            )}
                          </td>
                          <td className="text-right tabular-nums text-muted">{option.deposit ? formatNaira(option.deposit) : "None"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            ) : null}

            <Panel title={`About this ${listing.dealType === "jv" ? "opportunity" : "property"}`}>
              <ExpandableDescription text={listing.description} />
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
            </Panel>

            <section className="flex items-start gap-4 rounded-3xl border border-line bg-linear-to-r from-ivory to-white p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-gold ring-1 ring-gold/25">
                <FiUser aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl text-ink">Listed by {listing.ownerName}</h2>
                <p className="mt-1 text-sm text-muted">
                  Contact details are shared once JVA has introduced you. All negotiations are managed through our team.
                </p>
              </div>
            </section>
          </div>

          <aside>
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_24px_48px_-28px_rgb(14_17_22/0.4)] lg:sticky lg:top-24">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold-deep via-gold to-gold-deep" />
              <EnquiryForm
                target={{ type: "listing", id: listing.id, title: listing.title, subtitle: `${listing.area}, ${listing.city}`, image: coverOf(listing.images) }}
                eyebrow={listing.dealType === "jv" ? "Joint venture enquiry" : "Purchase enquiry"}
                jointVenture={listing.dealType === "jv"}
                salePrice={listing.dealType === "sale" ? listing.price : undefined}
                plotOptions={isEstate(listing) ? listing.plotOptions : undefined}
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
            <SectionHeading
              eyebrow="You might also like"
              title={`More ${listing.dealType === "jv" ? "joint-venture opportunities" : "properties for sale"}`}
            />
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

/**
 * The joint-venture terms panel. Sharing formula and premium sit side by side;
 * what can be built and the build period go underneath, each only when it's given.
 */
function JvTerms({ jv }: { jv: NonNullable<Listing["jv"]> }) {
  const formula = jv.sharingFormula?.trim();
  const toBeDiscussed = !formula || formula === SHARING_TBD;
  const premium = premiumText(jv.premium);
  const proposal = jv.proposal?.trim();
  const duration = jv.duration?.trim();
  const headline = [
    formula
      ? {
          label: "Sharing formula",
          value: sharingFormulaLabel(formula),
          caption: toBeDiscussed ? "Agreed with the developer" : "Landowner / developer",
          tone: "text-gold",
          // "Negotiable / fixed" only means something once there's a formula to negotiate.
          tag: !toBeDiscussed && jv.sharingNegotiable !== undefined ? (jv.sharingNegotiable ? "Negotiable" : "Fixed") : undefined,
          tagTone: jv.sharingNegotiable ? "bg-gold/15 text-gold ring-gold/30" : "bg-white/10 text-gray-300 ring-white/15",
        }
      : null,
    premium
      ? {
          label: "Premium",
          value: premium,
          caption: jv.premium ? "Paid upfront by the developer" : "No upfront payment to the landowner",
          tone: "text-white",
          tag: undefined,
          tagTone: "",
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);
  const details = [
    proposal ? { label: "What can be built", value: proposal } : null,
    duration ? { label: "Build period", value: duration } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  if (!headline.length && !details.length) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-[0_24px_60px_-30px_rgb(14_17_22/0.6)] sm:p-8">
      <PanelDecor glow="bottom-left" />
      <p className="relative text-xs font-bold tracking-[0.18em] text-gold uppercase">Joint-venture terms</p>

      {headline.length ? (
        <dl className={`relative mt-5 grid gap-4 ${headline.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {headline.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
              <dt className="flex items-center justify-between gap-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                {item.label}
                {item.tag ? <span className={`rounded-full px-2.5 py-0.5 text-[0.6875rem] font-bold tracking-normal normal-case ring-1 ${item.tagTone}`}>{item.tag}</span> : null}
              </dt>
              <dd className={`mt-2 font-display text-3xl leading-tight ${item.tone}`}>{item.value}</dd>
              <dd className="mt-1 text-xs text-gray-400">{item.caption}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {details.length ? (
        <dl className={`relative mt-4 grid gap-4 ${details.length > 1 ? "sm:grid-cols-[2fr_1fr]" : ""}`}>
          {details.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
              <dt className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{item.label}</dt>
              <dd className="mt-2 leading-relaxed font-semibold whitespace-pre-line text-white">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
