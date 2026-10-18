import Link from "next/link";
import { FiArrowUpRight, FiBriefcase, FiKey, FiMapPin } from "react-icons/fi";
import { SectionHeading } from "@/components/ui/SectionHeading";

const paths = [
  {
    icon: FiMapPin,
    title: "Landowners",
    body: "Individuals, families, cooperatives and government bodies with land to develop. Keep ownership and share in what gets built.",
    href: "/register?role=Landowner",
    cta: "List your land",
  },
  {
    icon: FiBriefcase,
    title: "Investors & developers",
    body: "Individuals, investor groups and funds with capital. Access vetted land, form groups for larger projects, or buy outright.",
    href: "/register?role=Investor",
    cta: "Start investing",
  },
  {
    icon: FiKey,
    title: "Buyers",
    body: "Individuals and companies buying land or buildings outright. Every title is checked before it's listed.",
    href: "/register?role=Buyer",
    cta: "Start buying",
  },
];

export function ChooseYourPath() {
  return (
    <section className="bg-ink py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Who it's for"
          title="One platform for every side of the deal"
          intro="Pick your role when you register and we'll tailor your profile and matches to it."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
          {paths.map(({ icon: Icon, title, body, href, cta }) => (
            <Link key={href} href={href} className="group flex flex-col bg-ink p-8 transition-colors hover:bg-ink-soft sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-display text-2xl text-white">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{body}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                {cta}
                <FiArrowUpRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
