import { Metadata } from "next";
import { getAllProducts } from "@/data/products";
import { createSeoMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/getSiteSettings";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = createSeoMetadata({
  title: "สินค้าและบริการคอนกรีต | โพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป",
  description:
    "รวมบริการออกแบบ ผลิต และติดตั้งงานพื้นโพสเทนชั่น กำแพงกันดินตัว L รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป และเสารั้วลวดหนาม ขอนแก่น",
  path: "/products",
  keywords: [
    "สินค้า PCC Post-Tension",
    "รับเหมาโพสเทนชั่น",
    "กำแพงกันดินตัว L",
    "รั้วสำเร็จรูป ขอนแก่น",
    "แผ่นพื้นสำเร็จรูป",
  ],
});

export default async function ProductsPage() {
  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  const phoneRaw = settings.contact.mainPhone.replace(/\D/g, "");
  const products = await getAllProducts();

  return (
    <div className="pt-24 pb-32 bg-zinc-50 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-50 rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            สินค้าและบริการของเรา
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            บริการครบวงจรตั้งแต่การออกแบบ ผลิต และติดตั้งงานคอนกรีตอัดแรง พร้อมทีมวิศวกรดูแลทุกขั้นตอน
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex bg-accent-500 hover:bg-accent-600 text-white px-7 py-4 font-bold rounded-xl items-center justify-center gap-3 transition-all animate-pulse-glow hover:-translate-y-1 group"
            >
              <Phone size={22} className="group-hover:rotate-12 transition-transform" />
              ขอใบเสนอราคาฟรี
            </a>
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-[#06C755]/10 border border-[#06C755]/50 hover:bg-[#06C755]/20 text-[#06C755] backdrop-blur-md px-7 py-4 font-bold rounded-xl transition-all hover:shadow-[0_10px_30px_rgba(6,199,85,0.2)] hover:-translate-y-1 items-center justify-center gap-3 group"
            >
              <MessageCircle size={22} className="group-hover:animate-bounce" />
              ส่งแบบให้ฝ่ายขายประเมิน
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.slug} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-3 flex flex-col relative">
              <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-brand-600 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg cursor-pointer">
                <ArrowUpRight size={24} />
              </div>
              <div className="h-72 bg-slate-200 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
              </div>
              <div className="p-8 flex flex-col flex-grow relative bg-white z-10 -mt-6 rounded-t-3xl border-t border-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-600 transition-colors">{product.shortTitle}</h2>
                <p className="text-gray-600 mb-8 line-clamp-3 flex-grow text-lg leading-relaxed">{product.description}</p>
                <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition-colors w-max group/link text-lg">
                  ดูรายละเอียดเพิ่มเติม
                  <div className="bg-brand-50 rounded-full p-2 group-hover/link:bg-brand-100 transition-colors">
                    <ChevronRight size={20} className="group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
