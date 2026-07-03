import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cache } from "react";

export const getPageWithSeo = cache(async (slug: string) => {
  const result = await db
    .select({
      page: pages,
      seo: seoMetadata,
    })
    .from(pages)
    .leftJoin(
      seoMetadata,
      and(
        eq(seoMetadata.resourceId, pages.id),
        eq(seoMetadata.resourceType, "page")
      )
    )
    .where(eq(pages.slug, slug))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return {
    ...result[0].page,
    seo: result[0].seo,
  };
});

export const getPublishedPages = cache(async () => {
  return await db
    .select()
    .from(pages)
    .where(eq(pages.workflowState, "published"));
});
