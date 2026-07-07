import { db } from "@/db";
import { products, seoMetadata } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let initialData = null;

  if (id !== "new") {
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
      .where(eq(products.id, id))
      .limit(1);

    if (result.length > 0) {
      const { product, seo } = result[0];
      initialData = {
        ...product,
        seoTitle: seo?.title ?? "",
        seoDescription: seo?.description ?? "",
        seoKeywords: seo?.keywords ?? "",
        ogImage: seo?.ogImage ?? "",
      };
    }
  }

  const formattedData: any = initialData ? {
    ...initialData,
    description: initialData.description ?? undefined,
    image: initialData.image ?? undefined,
    category: initialData.category ?? undefined,
    shortTitle: initialData.shortTitle ?? undefined,
    status: initialData.status ?? undefined,
    updatedAt: initialData.updatedAt ?? undefined,
    isFeatured: initialData.isFeatured ?? undefined,
    workflowState: initialData.workflowState ?? undefined,
    previewTokenHash: initialData.previewTokenHash ?? undefined,
    previewExpiresAt: initialData.previewExpiresAt ?? undefined,
    imageLayout: initialData.imageLayout ?? undefined,
    highlights: initialData.highlights ?? undefined,
  } : undefined;

  return (
    <div className="space-y-6">
      <ProductForm initialData={formattedData} productId={id} />
    </div>
  );
}
