import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageForm } from "@/components/admin/PageForm";
import { unstable_cache } from "next/cache";

const getAdminPage = unstable_cache(async (id: string) => db
  .select({ page: pages, seo: seoMetadata })
  .from(pages)
  .leftJoin(
    seoMetadata,
    and(eq(seoMetadata.resourceId, pages.id), eq(seoMetadata.resourceType, "page"))
  )
  .where(eq(pages.id, id))
  .limit(1), ["admin-page-by-id"], { tags: ["pages"], revalidate: 3600 });

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the page AND its SEO metadata in one query
  const result = await getAdminPage(id);

  if (result.length === 0) {

    notFound();
  }

  const { page, seo } = result[0];

  // Merge SEO data into the initialData so the form receives them as top-level fields
  const initialData = {
    ...page,
    title: page.title ?? undefined,
    slug: page.slug ?? undefined,
    content: page.content as unknown,
    status: (page.status || undefined) as "draft" | "published" | undefined,
    workflowState: (page.workflowState || undefined) as string | undefined,
    seoTitle: seo?.title ?? "",
    seoDescription: seo?.description ?? "",
    seoKeywords: seo?.keywords ?? "",
    ogImage: seo?.ogImage ?? "",
  };

  // Clean up remaining nulls to undefined for the entire object
  const safeInitialData = Object.fromEntries(
    Object.entries(initialData).map(([key, value]) => [key, value === null ? undefined : value])
  );

  return <PageForm initialData={safeInitialData as unknown as React.ComponentProps<typeof PageForm>['initialData']} pageId={page.id} />;
}
