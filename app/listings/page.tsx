import { Suspense } from "react";
import Link from "next/link";
import { FiArrowRight, FiHome } from "react-icons/fi";
import type { Metadata } from "next";
import { ListingsExplorer } from "@/components/listings/ListingsExplorer";

export const metadata: Metadata = {
  title: "Listings: Joint Venture Land & Property for Sale | Joint Venture Assets",
  description:
    "Browse verified joint-venture land opportunities and properties for sale across Nigeria. Filter by deal type, location and property type.",
  alternates: { canonical: "https://www.jointventureassets.com/listings" },
};

export default function ListingsPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto grid max-w-7xl items-end gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_22rem] lg:px-8">
          <div>
            <p className="eyebrow text-gold-deep">Listings</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl">
              Joint-venture land and property for sale
            </h1>
            <p className="mt-4 max-w-2xl text-muted">
              Every listing is either a <strong className="text-ink">joint venture</strong>, where the owner wants a development partner
              and shares what gets built, or a <strong className="text-ink">sale</strong>, bought outright.
            </p>
          </div>
          <Link href="/listings/submit" className="group rounded-2xl bg-ink p-6 text-white transition hover:-translate-y-0.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
              <FiHome aria-hidden="true" />
            </span>
            <span className="mt-4 block font-display text-xl">Got land or property to list?</span>
            <span className="mt-1 block text-sm text-gray-400">List it for a joint venture or a sale. We verify it and bring you serious partners.</span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold">
              List your property <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Suspense fallback={<p className="py-10 text-sm text-muted">Loading listings…</p>}>
          <ListingsExplorer />
        </Suspense>

        <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-ivory p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Want your property here?</h2>
            <p className="mt-2 max-w-xl text-muted">Tell us about it in five minutes. It shows as pending while we verify the title, then goes live.</p>
          </div>
          <Link href="/listings/submit" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-gold hover:text-ink">
            List your property <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
