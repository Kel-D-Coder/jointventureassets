import { FiCheck } from "react-icons/fi";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Registration & verification",
    body: "Choose your role (landowner, investor/developer or buyer) and category (individual, cooperative or government). Our team verifies every entity to confirm credibility and capacity.",
    points: ["Select your role and complete your profile", "Document verification for every entity type", "Financial and organisational capacity check"],
    aside: {
      title: "Who can join?",
      body: "Individuals, cooperatives, government entities, investor groups and buyers with verified credentials.",
    },
  },
  {
    title: "Submit your needs",
    body: "Post a request for an individual partnership, a group investment or a large-scale project, or browse live joint-venture and sale listings directly.",
    points: ["Individual, group or institutional requirements", "Budget ranges and group-size preferences", "Partnership structure and project scale"],
    aside: {
      title: "Request types",
      body: "Land offers, development briefs, cooperative partnerships and government PPP projects.",
    },
  },
  {
    title: "Matching & introduction",
    body: "We match landowners with developers, individuals with investor groups, and government bodies with qualified partners, then make the introduction ourselves.",
    points: ["Matching across every entity type", "Group formation and partnership facilitation", "Due diligence on all parties"],
    aside: {
      title: "How we match",
      body: "Entity type, budget, project scale, location and preferred deal structure (joint venture or outright sale).",
    },
  },
  {
    title: "Project management to completion",
    body: "From signing to handover, we coordinate the agreement, milestones and every party involved, for projects of any size.",
    points: ["Agreements tailored to each entity type", "Group coordination and milestone tracking", "Multi-party mediation if issues arise"],
    aside: {
      title: "Ongoing support",
      body: "A named JVA contact stays with your deal from first meeting to the final handover.",
    },
  },
];

export default function Process() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our process" title="From registration to project completion" />
        <ol className="mt-14 space-y-6">
          {steps.map((step, index) => (
            <li key={step.title} className="grid gap-6 rounded-3xl border border-line p-6 sm:p-8 lg:grid-cols-[auto_1fr_20rem] lg:gap-10">
              <span className="font-display text-5xl leading-none text-gold" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
                <ul className="mt-5 space-y-2.5">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm font-medium text-ink">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-deep">
                        <FiCheck aria-hidden="true" className="h-3 w-3" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <aside className="self-start rounded-2xl bg-ivory p-5">
                <p className="eyebrow text-gold-deep">{step.aside.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{step.aside.body}</p>
              </aside>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
