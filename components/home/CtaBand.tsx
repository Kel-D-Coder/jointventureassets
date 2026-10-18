import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export function CtaBand() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight text-white sm:text-4xl">
              Have land, capital or a deal in mind? Let&apos;s put it to work.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Create a free account in two minutes, or tell us what you&apos;re looking for and we&apos;ll find it for you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-gold/85">
                Create an account <FiArrowRight aria-hidden="true" />
              </Link>
              <Link href="/submit-request" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white">
                Submit a request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
