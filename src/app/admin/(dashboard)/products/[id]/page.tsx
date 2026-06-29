import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let productData = null;

  if (id !== "new") {
    const data = await db.select().from(products).where(eq(products.id, id)).limit(1);
    productData = data[0];
  }

  return (
    <div className="space-y-6">
      <ProductForm initialData={productData} productId={id} />
    </div>
  );
}
