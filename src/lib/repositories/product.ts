import { db } from "@/db";
import { products, seoMetadata } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getProductWithSeo = unstable_cache(
  async (slug: string) => {
    const result = await db
      .select({
        product: products,
        seo: seoMetadata,
      })
      .from(products)
      .leftJoin(
        seoMetadata,
        and(
          eq(seoMetadata.resourceId, products.id),
          eq(seoMetadata.resourceType, "product")
        )
      )
      .where(eq(products.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].product,
      seo: result[0].seo,
    };
  },
  ['product-with-seo'],
  { tags: ['products'], revalidate: 3600 }
);

export const getPublishedProducts = unstable_cache(
  async () => {
    // Only select necessary fields to reduce payload as requested by PA
    const result = await db
      .select({
        id: products.id,
        slug: products.slug,
        title: products.title,
        shortTitle: products.shortTitle,
        description: products.description,
        image: products.image,
        category: products.category,
        isFeatured: products.isFeatured,
        badge: products.badge,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.workflowState, "published"))
      .orderBy(products.createdAt); // Or some manual order if needed

    const badgePriority: Record<string, number> = {
      "มาแรง": 1,
      "ใหม่": 2,
    };

    return result.sort((a, b) => {
      const aPriority = badgePriority[a.badge || ""] || 3;
      const bPriority = badgePriority[b.badge || ""] || 3;
      return aPriority - bPriority;
    });
  },
  ['published-products'],
  { tags: ['products'], revalidate: 3600 }
);
