import { FiAlertTriangle, FiCompass, FiShield, FiUsers } from "react-icons/fi";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  { icon: FiShield, title: "Legal protection", body: "Agreements written for individuals, groups, cooperatives and government entities." },
  { icon: FiAlertTriangle, title: "Risk management", body: "Risk assessment tailored to each entity type and group structure." },
  { icon: FiUsers, title: "Conflict resolution", body: "Multi-party mediation for complex group and institutional partnerships." },
  { icon: FiCompass, title: "Expert guidance", body: "Experience across individual, group, cooperative and government projects." },
];

export default function WhyManageEverything() {
  return (
    <section className="bg-ink py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Why we manage everything"
          title="A trusted middle party keeps every deal on track"
          intro="Partnerships fail on trust, paperwork and disputes. We take responsibility for all three."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-ink p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-display text-xl text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
