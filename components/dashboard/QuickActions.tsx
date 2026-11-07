import Link from "next/link";
import { FiArrowUpRight, FiMessageCircle, FiPlus, FiSearch } from "react-icons/fi";

const actions = [
  { icon: FiPlus, label: "Post a request", description: "Can't find it in listings? We'll source it", href: "/submit-request" },
  { icon: FiSearch, label: "Browse listings", description: "Joint ventures and properties for sale", href: "/listings" },
  { icon: FiMessageCircle, label: "Book a consultation", description: "Talk your plans through with our team", href: "/contact" },
];

export default function QuickActions() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink p-6 shadow-[0_24px_60px_-30px_rgb(14_17_22/0.6)] sm:p-10">
      {/* The same gold light and fine grid as the welcome panel. */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_right,black,transparent_70%)]"
      />

      <div className="relative">
        <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Next steps</p>
        <h2 className="mt-2 font-display text-3xl text-white">What would you like to do?</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {actions.map(({ icon: Icon, label, description, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.06]"
              >
                <span className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-lg text-gold ring-1 ring-gold/25">
                    <Icon aria-hidden="true" />
                  </span>
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="text-lg text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                  />
                </span>
                <span className="mt-5 font-semibold text-white">{label}</span>
                <span className="mt-1 text-sm leading-relaxed text-white/55">{description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
