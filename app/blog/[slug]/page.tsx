import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "../../../utils/blogdata";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) return {};

  return {
    title: `${post.title} | Joint Venture Assets`,
    description: post.excerpt,
  };
}

export default function BlogDetailsPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Blog
          </Link>

          <h1 className="text-4xl font-bold mt-4 mb-4">
            {post.title}
          </h1>

          <div className="text-sm text-gray-500">
            {post.date} • {post.readTime}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="relative h-[420px] max-w-5xl mx-auto mt-10 rounded-2xl overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 py-16 prose prose-lg prose-gray">
        {post.content.split("\n").map((line, index) => {
          if (line.startsWith("## ")) {
            return (
              <h2 key={index}>{line.replace("## ", "")}</h2>
            );
          }
          return <p key={index}>{line}</p>;
        })}
      </article>
    </main>
  );
}
