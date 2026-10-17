import Image from "next/image";
import { FiFileText, FiShield, FiTrendingUp, FiUsers } from "react-icons/fi";
import buildingImage from "@/assets/IMG-20251018-WA0011.jpg";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  { icon: FiShield, title: "Verified partners", body: "Every landowner, investor and buyer is vetted, and every title document is checked." },
  { icon: FiUsers, title: "Group investment", body: "Pool capital with other investors or cooperatives to take on larger projects." },
  { icon: FiFileText, title: "Paperwork handled", body: "JV agreements, sharing formulas and deeds drafted and witnessed by our legal partners." },
  { icon: FiTrendingUp, title: "Managed to completion", body: "We track milestones and keep both sides informed until the keys are handed over." },
];

export function WhyJva() {
  return (
    <section className="bg-ivory py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative order-last aspect-[4/5] overflow-hidden rounded-3xl lg:order-first">
          <Image src={buildingImage} alt="A modern residential block photographed from below" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute right-5 bottom-5 left-5 rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur sm:right-auto sm:max-w-xs">
            <p className="font-display text-3xl text-ink">48 hrs</p>
            <p className="mt-1 text-sm text-muted">Our target for reviewing every new request.</p>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Why Joint Venture Assets"
            title="We don't just connect people. We manage the deal."
            intro="Listing sites stop at the introduction. We stay with you through due diligence, negotiation and delivery."
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-gold">
                  <Icon aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
