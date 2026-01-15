import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "../../utils/blogdata";

export const metadata = {
  title: "Blog | Joint Venture Assets",
  description:
    "Insights on real estate, land ownership, and joint ventures in Nigeria.",
};

export default function BlogPage() {
  const featuredPost = blogPosts.find((post: any) => post.featured);
  const otherPosts = blogPosts.filter((post: any) => !post.featured);

  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Real Estate Insights & Guides
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Practical knowledge on land ownership, joint ventures, and property
            investment in Nigeria.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="relative h-72 md:h-full">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-8">
              <span className="text-sm text-blue-600 font-semibold">
                Featured Article
              </span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-6">
                {featuredPost.excerpt}
              </p>
              <div className="text-sm text-gray-500 mb-6">
                {featuredPost.date} • {featuredPost.readTime}
              </div>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Read Article
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h3 className="text-2xl font-bold mb-8">Latest Articles</h3>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post: any) => (
            <article
              key={post.slug}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {post.date} • {post.readTime}
                </div>

                <h4 className="text-lg font-semibold mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                </h4>

                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
