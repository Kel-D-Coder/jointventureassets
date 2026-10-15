import { FiCheck, FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Joint Venture Assets - Get Expert Real Estate Partnership Guidance",
  description: "Ready to start your joint venture journey? Contact Joint Venture Assets for expert guidance on real estate partnerships. Free consultation available for landowners, investors, cooperatives, and government entities.",
  keywords: ["Joint Venture Assets", "JVA", "contact", "real estate partnerships", "joint ventures", "landowners", "investors", "consultation", "property development"],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    }
  }
};

const channels = [
  {
    icon: FiPhone,
    title: "Phone",
    lines: [
      { text: "+234 814 043 1570", href: "tel:+2348140431570" },
      { text: "+234 906 366 5415", href: "tel:+2349063665415" },
    ],
  },
  {
    icon: FiMail,
    title: "Email",
    lines: [
      { text: "info@jointventureassets.com", href: "mailto:info@jointventureassets.com" },
      { text: "partnerships@jointventureassets.com", href: "mailto:partnerships@jointventureassets.com" },
    ],
  },
  {
    icon: FiMapPin,
    title: "Office",
    lines: [{ text: "No 2 off Surulere Street, Dopemu, Lagos, Nigeria" }],
  },
  {
    icon: FiClock,
    title: "Hours",
    lines: [{ text: "Mon – Fri: 8:00 am – 5:00 pm" }, { text: "Saturday: 10:00 am – 2:00 pm" }, { text: "Sunday: closed" }],
  },
];

const reasons = [
  "Free first consultation",
  "Guidance on individual, group and government partnerships",
  "Access to vetted landowners, investors and cooperatives",
  "Full project management for every partnership type",
];

export default function Contact() {
  return (
    <main className="bg-white pb-24">
      <PageHero
        eyebrow="Contact us"
        title="Let's talk about your land, capital or deal"
        intro="Tell us what you're working on. Our team replies to every message within one working day."
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:px-8">
        <div className="space-y-6">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {channels.map(({ icon: Icon, title, lines }) => (
              <li key={title} className="bg-white p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-soft text-gold-deep">
                  <Icon aria-hidden="true" />
                </span>
                <p className="mt-4 font-bold text-ink">{title}</p>
                <div className="mt-1 space-y-0.5 text-sm text-muted">
                  {lines.map((line) =>
                    "href" in line && line.href ? (
                      <a key={line.text} href={line.href} className="block break-words hover:text-ink hover:underline">
                        {line.text}
                      </a>
                    ) : (
                      <p key={line.text}>{line.text}</p>
                    ),
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl bg-ink p-7 text-white">
            <h2 className="font-display text-2xl">Why talk to us?</h2>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
                    <FiCheck aria-hidden="true" className="h-3 w-3" />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink hover:bg-gold/85">
              <FaWhatsapp aria-hidden="true" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
