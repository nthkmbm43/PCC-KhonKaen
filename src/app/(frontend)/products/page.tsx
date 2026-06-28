import { createSeoMetadata } from "@/lib/seo";
import ServicesGridBlock from "@/components/blocks/ServicesGridBlock";
import CTABannerBlock from "@/components/blocks/CTABannerBlock";

export const metadata = createSeoMetadata({
  title: "สินค้าและบริการ | PCC Post-Tension",
  description:
    "รายการสินค้าและบริการทั้งหมดของบริษัท พีซีซี โพสเทนชั่น จำกัด ทั้งงานโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป และแผ่นพื้นสำเร็จรูป",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
            ผลิตภัณฑ์ & บริการ
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            สินค้าและบริการของเรา
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            บริการออกแบบ ผลิต และติดตั้งงานพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป
            มั่นคง ปลอดภัย ด้วยมาตรฐานวิศวกรรมระดับสากล
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <ServicesGridBlock />

      {/* CTA */}
      <CTABannerBlock />
    </div>
  );
}
