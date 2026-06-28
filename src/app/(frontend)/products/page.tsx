import { createSeoMetadata } from "@/lib/seo";
import RenderBlocks from "@/components/blocks/RenderBlocks";
import { getAllProducts } from "@/data/products";

export const metadata = createSeoMetadata({
  title: "สินค้าและบริการ | PCC Post-Tension",
  description:
    "รายการสินค้าและบริการทั้งหมดของบริษัท พีซีซี โพสเทนชั่น จำกัด ทั้งงานโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป และแผ่นพื้นสำเร็จรูป",
  path: "/products",
});

export default async function ProductsPage() {
  const products = await getAllProducts();
  
  const layout = [
    { 
      blockType: "content", 
      content: {
        title: "สินค้าและบริการ",
        content: "บริการออกแบบ ผลิต และติดตั้งงานพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป มั่นคง ปลอดภัย ด้วยมาตรฐานวิศวกรรมระดับสากล",
      }
    },
    { blockType: "servicesGrid" },
    { blockType: "ctaBanner" },
  ];

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-clip pt-20">
      <RenderBlocks layout={layout} />
    </div>
  );
}
