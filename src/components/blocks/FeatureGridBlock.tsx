import { ArrowUpRight, ChevronRight, Package, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPublishedProducts } from "@/lib/repositories/product";

export default async function FeatureGridBlock({ data }: { data?: Record<string, unknown> }) {
  const allProducts = await getPublishedProducts();
  const headline = (data?.headline as string) || "สินค้าและบริการของเรา";
  const description = (data?.description as string) || "ผู้เชี่ยวชาญด้านงานคอนกรีตอัดแรงและผลิตภัณฑ์สำเร็จรูป พร้อมตอบสนองทุกความต้องการของโครงการก่อสร้าง";

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden sm:py-24 lg:py-32" id="services">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-brand-100 rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-blue-100 rounded-full blur-[100px] opacity-40 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col text-center items-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 font-bold text-sm mb-6 border border-brand-200 shadow-sm">
            <Zap size={16} className="text-yellow-500" /> ผลิตภัณฑ์มาตรฐาน มอก.
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl leading-tight">
            {headline}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl sm:text-xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {allProducts.map((product, idx) => {
            const isHot = product.badge === 'มาแรง';
            const isNew = product.badge === 'ใหม่';
            return (
              <Link 
                key={product.slug} 
                href={`/products/${product.slug}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-100 p-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                  
                  {isHot && (
                    <div className="absolute top-6 left-6 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Zap size={14} /> มาแรง
                    </div>
                  )}

                  {isNew && (
                    <div className="absolute top-6 left-6 z-20 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Sparkles size={14} /> ใหม่
                    </div>
                  )}

                  <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-brand-600 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                    <ArrowUpRight size={24} />
                  </div>

                  {product.image ? (
                    <Image 
                      src={product.image} 
                      alt={product.title} 
                      fill
                      className="object-cover rounded-[1.25rem] group-hover:scale-105 transition-transform duration-700 ease-out" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 rounded-[1.25rem] border-2 border-dashed border-slate-200">
                      <Package size={48} />
                    </div>
                  )}
                  
                  <h3 className="absolute bottom-6 left-6 right-6 z-20 text-2xl font-bold text-white translate-y-0 group-hover:-translate-y-2 transition-transform duration-500 line-clamp-2">
                    {product.shortTitle}
                  </h3>
                </div>
                
                <div className="p-8 flex flex-col flex-grow bg-white">
                  <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                    <ShieldCheck size={16} /> ตรวจสอบมาตรฐานแล้ว
                  </div>
                  <p className="text-slate-600 mb-8 line-clamp-3 flex-grow text-base leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                    <span className="text-brand-600 font-bold group-hover:text-brand-700 transition-colors">
                      ดูรายละเอียด
                    </span>
                    <div className="bg-slate-50 rounded-full p-2 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors text-slate-400">
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
