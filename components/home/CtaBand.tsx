import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { PanelDecor } from "@/components/ui/PanelDecor";

export function CtaBand() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center shadow-[0_24px_60px_-30px_rgb(14_17_22/0.6)] sm:px-12 sm:py-20">
          <PanelDecor glow="top-center" />
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Get started</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight text-white sm:text-5xl">
              Have land, capital or a deal in mind? Let&apos;s put it to work.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Create a free account in two minutes, or tell us what you&apos;re looking for and we&apos;ll find it for you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-ink shadow-[0_8px_24px_-8px_rgb(201_162_74/0.7)] transition hover:-translate-y-0.5 hover:bg-gold-soft">
                Create an account <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/submit-request" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/8 hover:ring-white/50">
                Submit a request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
