import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductsClient } from "@/components/admin/ProductsClient";
import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const getAdminProductList = unstable_cache(async () => db.select({
    id: products.id,
    slug: products.slug,
    shortTitle: products.shortTitle,
    title: products.title,
    image: products.image,
    category: products.category,
    isFeatured: products.isFeatured,
    status: products.status,
    createdAt: products.createdAt,
    updatedAt: products.updatedAt,
  }).from(products).orderBy(desc(products.createdAt)), ["admin-product-list"], {
  tags: ["products"],
  revalidate: 3600,
});

export default async function ProductsPage() {
  // The list does not need the large JSON content/highlights documents.
  const allProducts = await getAdminProductList();

  const mappedProducts = allProducts.map(p => ({
    ...p,
    createdAt: p.createdAt ?? new Date(),
    updatedAt: p.updatedAt ?? new Date(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการสินค้าและบริการ</h1>
          <p className="text-slate-500 text-sm mt-1">เพิ่ม ลบ หรือแก้ไขข้อมูลสินค้าที่จะแสดงบนเว็บไซต์</p>
        </div>
      </div>

      <ProductsClient initialProducts={mappedProducts} />
    </div>
  );
}
