import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    // Keep one canonical sitemap URL. Legacy google-sitemap files can remain
    // reachable, but crawlers should discover and submit this endpoint.
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
