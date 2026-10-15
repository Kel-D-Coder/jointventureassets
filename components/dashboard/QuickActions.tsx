import Link from "next/link";
import { FiArrowUpRight, FiMessageCircle, FiPlus, FiSearch } from "react-icons/fi";

const actions = [
  { icon: FiPlus, label: "Post a request", description: "Can't find it in listings? We'll source it", href: "/submit-request" },
  { icon: FiSearch, label: "Browse listings", description: "Joint ventures and properties for sale", href: "/listings" },
  { icon: FiMessageCircle, label: "Book a consultation", description: "Talk your plans through with our team", href: "/contact" },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl bg-ink p-6 sm:p-8">
      <h2 className="font-display text-2xl text-white">Quick actions</h2>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {actions.map(({ icon: Icon, label, description, href }) => (
          <li key={href}>
            <Link href={href} className="group flex h-full items-start gap-4 rounded-xl border border-white/10 p-5 transition-colors hover:bg-ink-soft">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                <Icon aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  {label}
                  <FiArrowUpRight aria-hidden="true" className="text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-0.5 block text-sm text-gray-400">{description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
