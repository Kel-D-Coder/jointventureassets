import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import logo from "@/assets/logo/jva_2-removebg-preview.png"
import { CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/site";
import { PanelDecor } from "@/components/ui/PanelDecor";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/listings", label: "All listings" },
      { href: "/listings?deal=jv", label: "Joint ventures" },
      { href: "/listings?deal=sale", label: "Properties for sale" },
      { href: "/blog", label: "Insights" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { href: "/listings/submit", label: "List your property" },
      { href: "/register?role=Investor", label: "Invest or develop" },
      { href: "/register?role=Buyer", label: "Buy property" },
      { href: "/submit-request", label: "Submit a request" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/contact", label: "Contact us" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-gray-300">
      <PanelDecor glow="bottom-left" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/50 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-10 sm:px-6 lg:grid-cols-[1.4fr_2fr] lg:px-8">
        <div>
          <Link href="/" aria-label="Joint Venture Assets home">
            <Image src={logo} alt="" width={120} height={120} className="h-20 w-auto" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
            Nigeria&apos;s platform for real estate joint ventures, connecting landowners, investors, developers and buyers,
            and managing every deal from introduction to handover.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { href: "https://www.linkedin.com/company/jointventureassets", label: "LinkedIn", icon: FaLinkedinIn },
              { href: "https://www.facebook.com/profile.php?id=61585879203670", label: "Facebook", icon: FaFacebookF },
              { href: WHATSAPP_URL, label: "WhatsApp", icon: FaWhatsapp },
            ].map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-gray-300 transition-colors hover:border-gold hover:text-gold">
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">{column.title}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-300 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Joint Venture Assets. All rights reserved.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
