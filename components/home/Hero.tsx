"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin, FiPhoneCall, FiSearch } from "react-icons/fi";
import heroImage from "@/assets/IMG-20251018-WA0010.jpg";
import { cx } from "@/lib/format";
import { PHONE_NUMBERS } from "@/lib/site";

type Kind = "all" | "land" | "building";

/** Searches by what's on the plot: bare land, or a building (homes, offices, mixed use). */
const kindOptions: Array<{ value: Kind; label: string }> = [
  { value: "all", label: "All" },
  { value: "land", label: "Land" },
  { value: "building", label: "Building" },
];

export interface HeroStat {
  value: string;
  label: string;
}

/** `stats` are worked out from the live listings by the page, so they stay true. */
export function Hero({ stats }: { stats: HeroStat[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("all");
  const [location, setLocation] = useState("");

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (kind !== "all") params.set("type", kind);
    if (location.trim()) params.set("q", location.trim());
    router.push(`/listings${params.size ? `?${params}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-ink">
      <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32 lg:pb-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-3xl">
          <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Nigeria&apos;s real estate JV platform
          </p>
          <h1 className="mt-6 font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            Where land meets <span className="text-gold">capital</span> and vision.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Find verified land for joint ventures, buy property outright, or bring your land to serious developers. We vet every
            partner and manage the deal from first meeting to handover.
          </p>
        </motion.div>

        <motion.form
          onSubmit={search}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-10 max-w-4xl rounded-2xl bg-white p-2.5 shadow-2xl"
          role="search"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex shrink-0 rounded-xl bg-ivory p-1" role="radiogroup" aria-label="Property type">
              {kindOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={kind === option.value}
                  onClick={() => setKind(option.value)}
                  className={cx(
                    "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors md:flex-none",
                    kind === option.value ? "bg-ink text-white" : "text-gray-600 hover:text-ink",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
              <FiMapPin aria-hidden="true" className="shrink-0 text-gold-deep" />
              <span className="sr-only">Location</span>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Lekki, Abuja, Ibeju-Lekki…"
                className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-gray-400"
              />
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-gold/85">
              <FiSearch aria-hidden="true" /> Search listings
            </button>
          </div>
        </motion.form>

        {/* Tap-to-call lines, right under the search so they're seen on arrival. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 flex max-w-4xl flex-wrap items-center gap-2"
        >
          <span className="mr-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-300">
            <FiPhoneCall aria-hidden="true" className="text-gold" /> Call us:
          </span>
          {PHONE_NUMBERS.map((phone) => (
            <a
              key={phone.tel}
              href={`tel:${phone.tel}`}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold hover:text-ink"
            >
              {phone.display}
            </a>
          ))}
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-3xl text-white">{stat.value}</span>
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <a href="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline">
            How a joint venture works <FiArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
