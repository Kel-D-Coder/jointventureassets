import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Public pages are open to search engines; account and form-flow pages are kept out. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/dashboard",
        "/complete-profile",
        "/forgot-password",
        "/reset-password",
        "/submit-request",
        "/browse-requests",
        "/requests/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
