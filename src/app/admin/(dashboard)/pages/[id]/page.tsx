import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageForm } from "@/components/admin/PageForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the page AND its SEO metadata in one query
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
    .where(eq(pages.id, id))
    .limit(1);

  if (result.length === 0) {
    notFound();
  }

  const { page, seo } = result[0];

  // Merge SEO data into the initialData so the form receives them as top-level fields
  const initialData = {
    ...page,
    seoTitle: seo?.title ?? "",
    seoDescription: seo?.description ?? "",
    seoKeywords: seo?.keywords ?? "",
    ogImage: seo?.ogImage ?? "",
  };

  return <PageForm initialData={initialData as Record<string, unknown>} pageId={page.id} />;
}
