import { FiPlus } from "react-icons/fi";
import { SectionHeading } from "@/components/ui/SectionHeading";

const questions = [
  {
    q: "What's the difference between a joint venture and a sale?",
    a: "In a joint venture the landowner keeps the land and a developer funds and builds on it; the finished units or proceeds are shared on an agreed formula, such as 40/60. In a sale, the buyer pays the asking price and takes full ownership.",
  },
  {
    q: "Who decides the sharing formula?",
    a: "The landowner and developer agree it between them, with our guidance. It depends on the land's value, location and title, and on what the developer will build. We document it in the JV agreement.",
  },
  {
    q: "How do you verify listings and partners?",
    a: "We check title documents and survey plans with our legal partners, confirm the identity of every party, and assess an investor's or developer's capacity before introductions.",
  },
  {
    q: "Can several investors share one project?",
    a: "Yes. Investors can form or join a group to take on a larger project together, and we coordinate the group through the agreement and delivery.",
  },
  {
    q: "What does it cost?",
    a: "Registering and browsing is free. A facilitation fee applies only when a transaction completes; we confirm it in writing before any introduction.",
  },
];

export function Faq() {
  return (
    <section className="bg-ivory py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <SectionHeading eyebrow="Questions" title="Things people ask before their first deal" />
        <div className="divide-y divide-line rounded-3xl border border-line bg-white">
          {questions.map(({ q, a }) => (
            <details key={q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-ink">
                {q}
                <FiPlus aria-hidden="true" className="shrink-0 text-gold-deep transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
