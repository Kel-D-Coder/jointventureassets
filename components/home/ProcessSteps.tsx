import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Register and get verified",
    body: "Choose your role, complete your profile and upload your documents. Our team checks titles and identities before anything goes live.",
  },
  {
    title: "List, browse or post a request",
    body: "Landowners list land, investors browse JV and sale listings, and anyone can post a request describing exactly what they need.",
  },
  {
    title: "Get matched and close",
    body: "We introduce the right parties, help agree the sharing formula or price, and manage the agreement through to completion.",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="self-start lg:sticky lg:top-28">
        <SectionHeading
          eyebrow="How it works"
          title="From first introduction to signed agreement in three steps"
          intro="Most partnerships stall on trust and paperwork. We handle both, so you can focus on the deal."
        />
        </div>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="group relative flex gap-6 overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgb(14_17_22/0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_18px_40px_-24px_rgb(14_17_22/0.35)] sm:p-7"
            >
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-gold to-gold-deep opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink font-display text-2xl text-gold ring-1 ring-gold/25" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
