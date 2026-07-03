import { db } from "@/db";
import { products, seoMetadata } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cache } from "react";

export const getProductWithSeo = cache(async (slug: string) => {
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
});

export const getPublishedProducts = cache(async () => {
  // Only select necessary fields to reduce payload as requested by PA
  const result = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      shortTitle: products.shortTitle,
      description: products.description,
      image: products.image,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.workflowState, "published"))
    .orderBy(products.createdAt); // Or some manual order if needed

  return result;
});
