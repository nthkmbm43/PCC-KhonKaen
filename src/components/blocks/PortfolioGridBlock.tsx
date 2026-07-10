import { MapPin } from "lucide-react";
import Image from "next/image";
import { getAllPortfolios } from "@/data/portfolio";

export default async function PortfolioGridBlock() {
  const recentPortfolios = (await getAllPortfolios()).slice(0, 6);

  return (
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
                <Image 
                  src={portfolio.image} 
                  alt={portfolio.title}
                  fill
                  quality={95}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
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
  );
}
