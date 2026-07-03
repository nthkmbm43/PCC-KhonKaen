import { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { getPublishedProducts } from "@/lib/repositories/product";
import { getPublishedPages } from "@/lib/repositories/page";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublishedProducts();
  const pages = await getPublishedPages();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: page.slug === 'home' ? siteConfig.url : `${siteConfig.url}/${page.slug === 'products' ? 'products' : page.slug}`,
    lastModified: page.updatedAt || new Date(),
    changeFrequency: page.slug === 'home' ? "daily" as const : "monthly" as const,
    priority: page.slug === 'home' ? 1.0 : (page.slug === 'products' || page.slug === 'portfolio' ? 0.9 : 0.8),
  }));

  // Ensure / is always present if 'home' isn't in DB yet
  const hasHome = pages.some(p => p.slug === 'home');
  const baseEntries: MetadataRoute.Sitemap = hasHome ? [] : [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    }
  ];

  return [
    ...baseEntries,
    ...pageEntries,
    ...productEntries,
  ];
}
