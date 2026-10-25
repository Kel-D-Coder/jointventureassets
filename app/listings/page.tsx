import { Suspense } from "react";
import Link from "next/link";
import { FiArrowRight, FiHome } from "react-icons/fi";
import type { Metadata } from "next";
import { ListingsExplorer } from "@/components/listings/ListingsExplorer";
import { HeroPanel } from "@/components/ui/HeroPanel";

export const metadata: Metadata = {
  title: "Listings: Joint Venture Land & Property for Sale | Joint Venture Assets",
  description:
    "Browse verified joint-venture land opportunities and properties for sale across Nigeria. Filter by deal type, location and property type.",
  alternates: { canonical: "https://www.jointventureassets.com/listings" },
};

export default function ListingsPage() {
  return (
    <main className="bg-white">
      <HeroPanel
        eyebrow="Listings"
        title="Joint-venture land and property for sale"
        intro={
          <>
            Every listing is either a <strong className="text-white">joint venture</strong>, where the owner wants a development partner
            and shares what gets built, or a <strong className="text-white">sale</strong>, bought outright.
          </>
        }
        actions={
          <Link
            href="/listings/submit"
            className="group block max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-white/[0.07]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/25">
              <FiHome aria-hidden="true" />
            </span>
            <span className="mt-4 block font-display text-2xl">Got land or property to list?</span>
            <span className="mt-1 block text-sm text-white/60">List it for a joint venture or a sale. We verify it and bring you serious partners.</span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold">
              List your property <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Suspense fallback={<p className="py-10 text-sm text-muted">Loading listings…</p>}>
          <ListingsExplorer />
        </Suspense>

        <section className="relative mt-16 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-gold/40 bg-linear-to-r from-gold-soft/60 via-gold-soft/25 to-white p-8 sm:flex-row sm:items-center sm:p-10">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gold" />
          <div>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Want your property here?</h2>
            <p className="mt-2 max-w-xl text-muted">Tell us about it in five minutes. It shows as pending while we verify the title, then goes live.</p>
          </div>
          <Link
            href="/listings/submit"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink-soft"
          >
            List your property <FiArrowRight aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </div>
    </main>
  );
}
