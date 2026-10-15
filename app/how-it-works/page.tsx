import type { Metadata } from "next";
import Link from "next/link";
import Process from "@/components/how-it-works/Process";
import WhyManageEverything from "@/components/how-it-works/WhyManageEverything";
import { Faq } from "@/components/how-it-works/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "How It Works | Joint Venture Assets",
  description:
    "How Joint Venture Assets verifies partners, matches landowners with investors and developers, and manages real estate joint ventures and sales to completion.",
};

export default function HowItWorks() {
  return (
    <main>
      <PageHero
        tone="dark"
        eyebrow="How it works"
        title="A proven process for every kind of partnership"
        intro="Individuals, investor groups, cooperatives and government bodies. Here's how we take a deal from first registration to completed project."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink hover:bg-gold/85">
            Get started
          </Link>
          <Link href="/listings" className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white hover:border-white">
            Browse listings
          </Link>
        </div>
      </PageHero>
      <Process />
      <WhyManageEverything />
      <Faq />
      <CtaBand />
    </main>
  );
}
