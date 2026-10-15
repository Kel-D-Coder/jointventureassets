import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { SectionHeading } from "@/components/ui/SectionHeading";

const deals = [
  {
    href: "/listings?deal=jv",
    tag: "Joint venture",
    title: "Partner on the land, share what you build",
    body: "The landowner contributes the land, the developer funds and builds, and the finished units or proceeds are shared on an agreed formula.",
    points: ["Sharing formulas from 30/70 to 50/50", "Agreements drafted and witnessed", "Progress tracked to handover"],
    cta: "Browse JV opportunities",
    dark: true,
  },
  {
    href: "/listings?deal=sale",
    tag: "For sale",
    title: "Buy land or property outright",
    body: "Plots, homes and commercial buildings with checked titles, for buyers who want full ownership without a partnership.",
    points: ["Title documents verified", "Inspections arranged for you", "Support through to the deed"],
    cta: "Browse properties for sale",
    dark: false,
  },
];

export function DealTypes() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Two ways to invest"
          title="Joint venture or outright sale: every listing is one or the other"
          intro="Filter by either on the listings page. Not sure which suits you? Our team will talk you through it."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {deals.map((deal) => (
            <Link
              key={deal.href}
              href={deal.href}
              className={
                deal.dark
                  ? "group flex flex-col rounded-3xl bg-ink p-8 text-white transition-transform hover:-translate-y-1 sm:p-10"
                  : "group flex flex-col rounded-3xl border border-line bg-ivory p-8 text-ink transition-transform hover:-translate-y-1 sm:p-10"
              }
            >
              <span className={deal.dark ? "w-fit rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink" : "w-fit rounded-full bg-ink px-3 py-1 text-xs font-bold text-white"}>
                {deal.tag}
              </span>
              <h3 className="mt-6 font-display text-2xl leading-snug sm:text-3xl">{deal.title}</h3>
              <p className={deal.dark ? "mt-4 text-gray-300" : "mt-4 text-muted"}>{deal.body}</p>
              <ul className="mt-6 space-y-2.5">
                {deal.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm font-medium">
                    <span className={deal.dark ? "grid h-5 w-5 place-items-center rounded-full bg-gold/20 text-gold" : "grid h-5 w-5 place-items-center rounded-full bg-gold-soft text-gold-deep"}>
                      <FiCheck aria-hidden="true" className="h-3 w-3" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <span className={deal.dark ? "mt-8 inline-flex items-center gap-2 font-semibold text-gold" : "mt-8 inline-flex items-center gap-2 font-semibold text-gold-deep"}>
                {deal.cta} <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
