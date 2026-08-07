import { db } from "@/db";
import { products, pages } from "@/db/schema";
import { LineMarketingForm } from "@/components/admin/LineMarketingForm";
import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const getLineProductOptions = unstable_cache(
  () => db.select({ id: products.id, title: products.title, slug: products.slug }).from(products).orderBy(desc(products.createdAt)),
  ["line-product-options"],
  { tags: ["products"], revalidate: 3600 },
);

const getLinePageOptions = unstable_cache(
  () => db.select({ id: pages.id, title: pages.title, slug: pages.slug }).from(pages).orderBy(desc(pages.createdAt)),
  ["line-page-options"],
  { tags: ["pages"], revalidate: 3600 },
);

export default async function LineMarketingPage() {
  const [allProducts, allPages] = await Promise.all([
    getLineProductOptions(),
    getLinePageOptions(),
  ]);
  
  // Format options for dropdown
  const productOptions = allProducts.map(p => ({
    label: `สินค้า: ${p.title}`,
    value: `/products/${p.slug}`
  }));
  
  const pageOptions = allPages.map(p => ({
    label: `เพจ: ${p.title}`,
    value: `/${p.slug}`
  }));

  const standardOptions = [
    { label: "หน้าแรก", value: "/" },
    { label: "สินค้าทั้งหมด", value: "/products" },
  ];

  const allOptions = [...standardOptions, ...productOptions, ...pageOptions];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการ LINE OA (Rich Menu)</h1>
          <p className="text-slate-500 text-sm mt-1">อัปโหลดรูปภาพและกำหนดลิงก์ให้กับ Rich Menu (รองรับแบบ 6 ปุ่ม)</p>
        </div>
      </div>

      <LineMarketingForm linkOptions={allOptions} />
    </div>
  );
}
