import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import type { BlogPost } from "@/utils/blogdata";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(14_17_22/0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-ivory">
        <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold text-muted">
          {post.date} · {post.readTime}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug text-ink">{post.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-deep">
          Read article <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** Newest first. */
export function sortedPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
