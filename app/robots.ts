import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Signed-in and internal pages: nothing there for a search engine.
      disallow: ["/api/", "/admin", "/dashboard", "/profile", "/saved", "/my-reviews"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
