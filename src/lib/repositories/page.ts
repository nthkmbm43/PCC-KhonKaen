import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getPageWithSeo = unstable_cache(
  async (slug: string) => {
    let result;
    try {
      result = await db
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
    } catch (error) {
      console.error(`Error fetching page "${slug}" from DB:`, error);
      return null;
    }

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].page,
      seo: result[0].seo,
    };
  },
  ['page-with-seo'],
  { tags: ['pages'], revalidate: 3600 }
);

export const getPublishedPages = unstable_cache(
  async () => {
    try {
      return await db
        .select()
        .from(pages)
        .where(eq(pages.workflowState, "published"));
    } catch (error) {
      console.error("Error fetching published pages from DB:", error);
      return [];
    }
  },
  ['published-pages'],
  { tags: ['pages'], revalidate: 3600 }
);
