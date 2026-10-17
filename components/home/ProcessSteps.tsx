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
            <li key={step.title} className="flex gap-6 rounded-2xl border border-line p-6 sm:p-7">
              <span className="font-display text-4xl leading-none text-gold" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
