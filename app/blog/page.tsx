import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { FiArrowRight } from "react-icons/fi";
import { blogPosts } from "@/utils/blogdata";
import { PostCard, sortedPosts } from "@/components/blog/PostCard";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Insights | Joint Venture Assets",
  description: "Insights on real estate, land ownership, and joint ventures in Nigeria.",
};

export default function BlogPage() {
  const [lead, ...rest] = sortedPosts(blogPosts);

  return (
    <main className="bg-white pb-24">
      <PageHero
        eyebrow="Insights"
        title="Real estate guides for landowners and investors"
        intro="Practical knowledge on land titles, joint ventures and property investment in Nigeria, from the JVA team."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {lead ? (
          <Link
            href={`/blog/${lead.slug}`}
            className="group mt-12 grid overflow-hidden rounded-3xl border border-line bg-white transition hover:shadow-[0_18px_40px_-18px_rgb(14_17_22/0.35)] lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-ivory lg:aspect-auto lg:min-h-96">
              <Image src={lead.image} alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <span className="w-fit rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">Latest</span>
              <h2 className="mt-5 font-display text-3xl leading-tight text-ink sm:text-4xl">{lead.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{lead.excerpt}</p>
              <p className="mt-5 text-sm font-semibold text-muted">
                {lead.date} · {lead.readTime}
              </p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors group-hover:bg-gold group-hover:text-ink">
                Read article <FiArrowRight aria-hidden="true" />
              </span>
            </div>
          </Link>
        ) : null}

        {rest.length ? (
          <section className="mt-16">
            <h2 className="font-display text-3xl text-ink">More articles</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
