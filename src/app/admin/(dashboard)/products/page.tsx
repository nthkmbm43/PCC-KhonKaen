import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductsClient } from "@/components/admin/ProductsClient";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

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
