import { ArrowUpRight, ChevronRight, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPublishedProducts } from "@/lib/repositories/product";

export default async function ServicesGridBlock() {
  const rawProducts = await getPublishedProducts();

  const hotProducts = rawProducts.filter(p => p.badge === 'มาแรง');
  const newProducts = rawProducts.filter(p => p.badge === 'ใหม่');
  const normalProducts = rawProducts.filter(p => p.badge !== 'มาแรง' && p.badge !== 'ใหม่');

  const selectedProducts = [];
  
  // Pick up to 3 hot products
  const selectedHot = hotProducts.slice(0, 3);
  selectedProducts.push(...selectedHot);
  
  // Pick up to 3 new products
  const selectedNew = newProducts.slice(0, 3);
  selectedProducts.push(...selectedNew);
  
  // If < 6, add more hot products
  if (selectedProducts.length < 6) {
    const remainingHot = hotProducts.slice(selectedHot.length);
    selectedProducts.push(...remainingHot.slice(0, 6 - selectedProducts.length));
  }
  
  // If < 6, add more new products
  if (selectedProducts.length < 6) {
    const remainingNew = newProducts.slice(selectedNew.length);
    selectedProducts.push(...remainingNew.slice(0, 6 - selectedProducts.length));
  }
  
  // If < 6, fill with normal products
  if (selectedProducts.length < 6) {
    selectedProducts.push(...normalProducts.slice(0, 6 - selectedProducts.length));
  }
  
  const allProducts = selectedProducts;
  return (
    <section className="py-16 bg-white relative overflow-hidden sm:py-20 lg:py-24" id="services">
      <div className="absolute top-0 right-0 h-[360px] w-[360px] bg-brand-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none sm:h-[560px] sm:w-[560px] lg:h-[800px] lg:w-[800px]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 sm:mb-14 lg:mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight sm:text-4xl md:text-5xl sm:mb-6">
              สินค้าและบริการของเรา
            </h2>
            <p className="text-base text-gray-600 sm:text-lg md:text-xl">
              ผู้เชี่ยวชาญด้านงานคอนกรีตอัดแรงและผลิตภัณฑ์สำเร็จรูป พร้อมตอบสนองทุกความต้องการของโครงการก่อสร้าง
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
          {allProducts.map((product) => {
            const isHot = product.badge === 'มาแรง';
            const isNew = product.badge === 'ใหม่';
            return (
            <div key={product.slug} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col relative">
              <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-brand-600 opacity-100 translate-y-0 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500 shadow-lg cursor-pointer">
                <ArrowUpRight size={24} />
              </div>
              <div className="h-64 bg-slate-200 relative overflow-hidden">
                {isHot && (
                  <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Zap size={14} /> มาแรง
                  </div>
                )}
                {isNew && (
                  <div className="absolute top-4 left-4 z-20 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles size={14} /> ใหม่
                  </div>
                )}
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">{product.shortTitle}</h3>
              </div>
              <div className="p-6 flex flex-col flex-grow bg-white z-10 relative sm:p-8">
                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow text-base leading-relaxed sm:mb-8 sm:text-lg sm:line-clamp-2">{product.description}</p>
                <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition-colors w-max group/link">
                  ดูรายละเอียดเพิ่มเติม 
                  <div className="bg-brand-50 rounded-full p-1.5 group-hover/link:bg-brand-100 transition-colors">
                    <ChevronRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
