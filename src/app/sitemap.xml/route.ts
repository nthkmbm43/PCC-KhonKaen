import { siteConfig } from "@/data/site-config";
import { getPublishedPages } from "@/lib/repositories/page";
import { getPublishedProducts } from "@/lib/repositories/product";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

type SitemapEntry = {
  url: string;
  lastModified: Date | string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

const redirectedPageSlugs = new Set(["retaining-wall", "post-tension"]);

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function entryToXml(entry: SitemapEntry) {
  return [
    "<url>",
    `<loc>${xmlEscape(entry.url)}</loc>`,
    `<lastmod>${toIsoDate(entry.lastModified)}</lastmod>`,
    `<changefreq>${entry.changeFrequency}</changefreq>`,
    `<priority>${entry.priority}</priority>`,
    "</url>",
  ].join("");
}

export async function GET() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const now = new Date();
  const products = await getPublishedProducts();
  const pages = await getPublishedPages();

  const pageEntries: SitemapEntry[] = pages
    .filter((page) => !redirectedPageSlugs.has(page.slug))
    .map((page) => {
      const path = page.slug === "home" ? "" : `/${page.slug === "products" ? "products" : page.slug}`;

      return {
        url: `${baseUrl}${path}`,
        lastModified: page.updatedAt || now,
        changeFrequency: page.slug === "home" ? "daily" : "monthly",
        priority: page.slug === "home" ? 1 : page.slug === "products" || page.slug === "portfolio" ? 0.9 : 0.8,
      };
    });

  const productEntries: SitemapEntry[] = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt || now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const hasHome = pageEntries.some((entry) => entry.url === baseUrl);
  const entries: SitemapEntry[] = [
    ...(hasHome
      ? []
      : [
          {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "daily" as const,
            priority: 1,
          },
        ]),
    ...pageEntries,
    ...productEntries,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries
    .map(entryToXml)
    .join("")}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
