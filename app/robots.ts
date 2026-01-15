import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/contact/", "/login/", "/blog/"],
            disallow: ["/admin/", "/api/", "/how-it-works/", "/submit-request/", "/reset-password/", "/dashboard/", "/complete-profile/", "/browse-requests/", "/forgot-password/", "/requests/"],
            
        },
        sitemap: "https://www.jointventureassets.com/sitemap.xml"
    }
}