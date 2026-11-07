import type { MetadataRoute } from "next";
import { getApprovedListings } from "@/lib/api/listings";
import { SITE_URL } from "@/lib/site";
import { blogPosts } from "@/utils/blogdata";
import type { Listing } from "@/types";

/** Rebuilt at most once an hour, so new listings show up without a redeploy. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const page = (path: string, changeFrequency: "daily" | "weekly" | "monthly", priority: number) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const staticPages = [
    page("", "daily", 1.0),
    page("/listings", "daily", 0.9),
    page("/how-it-works", "monthly", 0.7),
    page("/listings/submit", "monthly", 0.6),
    page("/blog", "weekly", 0.7),
    page("/contact", "monthly", 0.6),
    page("/register", "monthly", 0.4),
  ];

  const blogPages = blogPosts.map((post) => {
    const date = new Date(post.date);
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: Number.isNaN(date.getTime()) ? now : date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  // The server may be asleep: still serve the rest of the sitemap rather than an error.
  const listings = await getApprovedListings().catch((): Listing[] => []);
  const listingPages = listings.map((listing) => ({
    url: `${SITE_URL}/listings/${listing.id}`,
    lastModified: new Date(listing.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...listingPages, ...blogPages];
}
