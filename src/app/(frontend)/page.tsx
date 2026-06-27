import { Phone, MessageCircle, CheckCircle2, Factory, Truck, ChevronRight, MapPin, ArrowUpRight, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";
import { getAllProducts } from "@/data/products";
import { getAllPortfolios } from "@/data/portfolio";
import { faqs as homeFAQ } from "@/data/faq";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { createSeoMetadata, faqJsonLd, JsonLd } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title:
    "รับเหมาโพสเทนชั่น ขอนแก่น | กำแพงกันดิน รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป",
  description:
    "พีซีซี โพสเทนชั่น รับออกแบบ ผลิต และติดตั้งงานโพสเทนชั่น กำแพงกันดินตัว L รั้วสำเร็จรูป และแผ่นพื้นสำเร็จรูป ขอนแก่น ภาคอีสาน และเชียงใหม่",
  path: "/",
});

export default async function Home() {
  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  // Replace non-digits for tel link
  const phoneNo = settings.contact.mainPhone.replace(/\D/g, "");

  // Show all products instead of just 3
  const allProducts = await getAllProducts();
  
  // Get latest 6 portfolio items
  const recentPortfolios = (await getAllPortfolios()).slice(0, 6);


  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
      <JsonLd data={faqJsonLd(homeFAQ)} />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-50 pt-14 pb-20 group sm:pt-20 sm:pb-28 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100/50 opacity-95 z-0 transition-opacity duration-1000"></div>

        <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay transition-transform duration-[20s] group-hover:scale-110">
          <img src="/images/hero-banner.webp" alt="PCC Post-Tension Factory" className="w-full h-full object-cover grayscale" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
          <div className="inline-flex max-w-full items-center gap-2 bg-brand-100 text-brand-700 border border-brand-200 px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-6 backdrop-blur-sm sm:px-6 sm:py-2.5 sm:text-sm sm:mb-8">
            <Sparkles size={16} className="animate-pulse text-brand-500" /> รับประกันคุณภาพโดยทีมวิศวกรมืออาชีพ
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-5 leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-7xl lg:mb-6">
            รับเหมา <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">งานโพสเทนชั่น</span> <br className="hidden md:block" />
            และผลิตภัณฑ์คอนกรีต
          </h1>
          <p className="mt-5 text-base text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed sm:text-lg md:text-xl lg:mb-12">
            บริการออกแบบ ผลิต และติดตั้งงานพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป มั่นคง ปลอดภัย ด้วยมาตรฐานวิศวกรรมระดับสากล
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <a href={`tel:${phoneNo}`} className="relative overflow-hidden bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all animate-pulse-glow sm:px-8 sm:text-lg group">
              <Phone size={24} className="group-hover:rotate-12 transition-transform" />
              ขอใบเสนอราคาฟรี
            </a>
            <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-50 text-[#06C755] border-2 border-[#06C755] px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,199,85,0.2)] sm:px-8 sm:text-lg">
              <MessageCircle size={24} />
              ติดต่อสอบถามทาง LINE
            </a>
          </div>
          
          <div className="mt-14 grid grid-cols-1 gap-4 max-w-5xl mx-auto text-left sm:mt-20 md:grid-cols-3 md:gap-6 lg:mt-24">
             <div className="bg-white p-6 rounded-3xl flex items-start gap-5 transition-all duration-300 hover:-translate-y-3 shadow-md hover:shadow-xl border border-gray-100 hover:border-brand-200 group/feature">
               <div className="bg-brand-50 p-4 rounded-2xl text-brand-500 shrink-0 group-hover/feature:bg-brand-500 group-hover/feature:text-white transition-colors duration-300">
                 <CheckCircle2 size={28} />
               </div>
               <div>
                 <h3 className="text-gray-900 font-bold text-xl mb-1 group-hover/feature:text-brand-600 transition-colors">งานเสร็จตรงเวลา</h3>
                 <p className="text-gray-600 text-sm mt-2 leading-relaxed">รับประกันคุณภาพและระยะเวลาส่งมอบงาน ตามสัญญาทุกประการ</p>
               </div>
             </div>
             <div className="bg-white p-6 rounded-3xl flex items-start gap-5 transition-all duration-300 hover:-translate-y-3 shadow-md hover:shadow-xl border border-gray-100 hover:border-brand-200 group/feature">
               <div className="bg-brand-50 p-4 rounded-2xl text-brand-500 shrink-0 group-hover/feature:bg-brand-500 group-hover/feature:text-white transition-colors duration-300">
                 <Factory size={28} />
               </div>
               <div>
                 <h3 className="text-gray-900 font-bold text-xl mb-1 group-hover/feature:text-brand-600 transition-colors">โรงงานมาตรฐาน</h3>
                 <p className="text-gray-600 text-sm mt-2 leading-relaxed">ผลิตด้วยเครื่องจักรทันสมัย ควบคุมโดยวิศวกรผู้มีใบประกอบวิชาชีพ</p>
               </div>
             </div>
             <div className="bg-white p-6 rounded-3xl flex items-start gap-5 transition-all duration-300 hover:-translate-y-3 shadow-md hover:shadow-xl border border-gray-100 hover:border-brand-200 group/feature">
               <div className="bg-brand-50 p-4 rounded-2xl text-brand-500 shrink-0 group-hover/feature:bg-brand-500 group-hover/feature:text-white transition-colors duration-300">
                 <Truck size={28} />
               </div>
               <div>
                 <h3 className="text-gray-900 font-bold text-xl mb-1 group-hover/feature:text-brand-600 transition-colors">บริการรวดเร็ว</h3>
                 <p className="text-gray-600 text-sm mt-2 leading-relaxed">มีรถขนส่งและเครื่องจักรพร้อมให้บริการทั่วภาคอีสานและเชียงใหม่</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust & Certification Banner */}
      <div className="bg-white border-b border-gray-100 py-8 relative z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3 font-bold text-gray-800 text-lg sm:text-xl">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-800 font-black text-xl">15+</span>
              </div>
              ปีแห่งความเชี่ยวชาญ
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-300"></div>
            <div className="flex items-center gap-3 font-bold text-gray-800 text-lg sm:text-xl">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-red-700 font-black text-xl">มอก.</span>
              </div>
              มาตรฐานผลิตภัณฑ์อุตสาหกรรม
            </div>
            <div className="hidden lg:block w-px h-10 bg-gray-300"></div>
            <div className="flex items-center gap-3 font-bold text-gray-800 text-lg sm:text-xl">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <Factory size={24} className="text-gray-700" />
              </div>
              โรงงานผลิตโดยตรง ไม่ผ่านคนกลาง
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
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
            {allProducts.map((product) => (
              <div key={product.slug} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col relative">
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-brand-600 opacity-100 translate-y-0 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500 shadow-lg cursor-pointer">
                  <ArrowUpRight size={24} />
                </div>
                <div className="h-64 bg-slate-200 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
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
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 bg-zinc-50 relative overflow-hidden sm:py-20 lg:py-24" id="portfolio">
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] bg-slate-200 rounded-full blur-[120px] opacity-50 translate-y-1/2 -translate-x-1/4 pointer-events-none sm:h-[480px] sm:w-[480px] lg:h-[600px] lg:w-[600px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:text-4xl md:text-5xl sm:mb-6">
              ผลงานที่ผ่านมาของเรา
            </h2>
            <p className="text-base text-gray-600 sm:text-lg md:text-xl">
              ความไว้วางใจจากโครงการชั้นนำทั่วภาคอีสานและเชียงใหม่ การันตีคุณภาพและมาตรฐานวิศวกรรม
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
            {recentPortfolios.map((portfolio, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-3 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-56 bg-slate-200 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img 
                    src={portfolio.image} 
                    alt={portfolio.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-brand-700 shadow-sm transform translate-y-0 opacity-100 lg:-translate-y-full lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-300">
                    {portfolio.category === "post-tension" ? "งานโพสเทนชั่น" : "งานผลิตภัณฑ์คอนกรีต"}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{portfolio.title}</h3>
                  {portfolio.location && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 w-max px-3 py-1.5 rounded-lg border border-gray-100 group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                      <MapPin size={16} />
                      {portfolio.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white relative sm:py-20 lg:py-24" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 lg:mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:text-4xl md:text-5xl sm:mb-6">
              คำถามที่พบบ่อย (FAQ)
            </h2>
            <p className="text-base text-gray-600 sm:text-lg md:text-xl">
              ข้อสงสัยเบื้องต้นที่คุณอาจมีเกี่ยวกับการสั่งซื้อและบริการของเรา
            </p>
          </div>

          <div className="space-y-6">
            {homeFAQ.map((faq, index) => (
              <div key={index} className="bg-white border-2 border-gray-50 p-6 md:p-8 rounded-[2rem] hover:border-brand-500 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group cursor-default hover:-translate-y-1">
                <h3 className="flex items-start gap-4 text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-600 transition-colors">
                  <div className="bg-brand-50 p-2.5 rounded-xl group-hover:bg-brand-100 transition-colors shrink-0">
                    <HelpCircle className="text-brand-500" size={24} />
                  </div>
                  <span className="mt-1.5">{faq.question}</span>
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed md:ml-[4.25rem]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">พร้อมเริ่มต้นโครงการของคุณหรือยัง?</h2>
          <p className="text-xl text-brand-50 mb-12 drop-shadow-sm">ให้ทีมวิศวกรของเราช่วยประเมินราคาและให้คำปรึกษาฟรี ไม่มีค่าใช้จ่ายแอบแฝง</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <a href={`tel:${phoneNo}`} className="inline-flex bg-white text-brand-600 hover:bg-gray-50 px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-4 transition-all animate-pulse-glow hover:-translate-y-2 hover:scale-105 group">
              <Phone size={28} className="group-hover:rotate-12 transition-transform" />
              ขอใบเสนอราคาฟรี
            </a>
            <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="inline-flex bg-[#06C755] hover:bg-[#05b34c] text-white px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-4 transition-all hover:shadow-[0_15px_40px_rgba(6,199,85,0.4)] hover:-translate-y-2 hover:scale-105 group">
              <MessageCircle size={28} className="group-hover:animate-bounce" />
              ส่งแบบแปลนมาประเมินทาง LINE
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
