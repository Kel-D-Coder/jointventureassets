import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { blogPosts } from "@/utils/blogdata";
import { PostCard, sortedPosts } from "@/components/blog/PostCard";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return {};

  return {
    title: `${post.title} | Joint Venture Assets`,
    description: post.excerpt,
    openGraph: { images: [{ url: post.image }] },
  };
}

const anchor = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const lines = post.content.split("\n").filter((line) => line.trim());
  const headings = lines.filter((line) => line.startsWith("## ")).map((line) => line.slice(3));
  const more = sortedPosts(blogPosts).filter((other) => other.slug !== post.slug).slice(0, 3);

  return (
    <main className="bg-white pb-24">
      <header className="border-b border-line bg-ivory">
        <div className="mx-auto max-w-4xl px-4 pt-10 pb-14 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
            <FiArrowLeft aria-hidden="true" /> All insights
          </Link>
          <p className="eyebrow mt-8 text-gold-deep">
            {post.date} · {post.readTime}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
        </div>
      </header>

      <div className="mx-auto -mt-px max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-3xl bg-ivory">
          <Image src={post.image} alt="" fill priority sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[14rem_1fr] lg:px-8">
        {headings.length ? (
          <nav aria-label="In this article" className="hidden self-start lg:sticky lg:top-28 lg:block">
            <p className="eyebrow text-muted">In this article</p>
            <ul className="mt-4 space-y-2.5 border-l border-line text-sm">
              {headings.map((heading) => (
                <li key={heading}>
                  <a href={`#${anchor(heading)}`} className="-ml-px block border-l border-transparent pl-4 text-muted hover:border-gold hover:text-ink">
                    {heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <article className="max-w-2xl">
          {lines.map((line, index) =>
            line.startsWith("## ") ? (
              <h2 key={index} id={anchor(line.slice(3))} className="mt-10 mb-3 scroll-mt-28 font-display text-2xl text-ink first:mt-0">
                {line.slice(3)}
              </h2>
            ) : (
              <p key={index} className="mb-5 text-[1.0625rem] leading-relaxed text-gray-700">
                {line}
              </p>
            ),
          )}

          <aside className="mt-12 rounded-2xl bg-ink p-8 text-white">
            <p className="font-display text-2xl">Thinking about a joint venture?</p>
            <p className="mt-2 text-sm text-gray-300">Browse verified land and property, or tell us what you&apos;re looking for.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/listings" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink hover:bg-gold/85">
                Browse listings <FiArrowRight aria-hidden="true" />
              </Link>
              <Link href="/contact" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:border-white">
                Talk to us
              </Link>
            </div>
          </aside>
        </article>
      </div>

      {more.length ? (
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-ink">Keep reading</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((other) => (
              <li key={other.slug}>
                <PostCard post={other} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
