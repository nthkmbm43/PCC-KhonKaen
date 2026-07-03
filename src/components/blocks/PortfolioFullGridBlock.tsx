import React from 'react';
import { getAllPortfolios } from "@/data/portfolio";
import { MapPin } from "lucide-react";
import Image from "next/image";

interface PortfolioFullGridBlockProps {
  headline?: string;
  description?: string;
}

export default async function PortfolioFullGridBlock({ headline, description }: PortfolioFullGridBlockProps) {
  const portfolios = await getAllPortfolios();
  const title = headline || "ผลงานความสำเร็จ";
  const desc = description || "ภาพผลงานบางส่วนที่เราได้รับความไว้วางใจจากลูกค้าทั้งภาครัฐและเอกชน ในการติดตั้งระบบพื้นและผลิตภัณฑ์คอนกรีตสำเร็จรูป";

  return (
    <div className="pt-24 pb-20 lg:pt-32 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {portfolios.map((item, idx) => (
          <div key={idx} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
            <div className="h-64 sm:h-72 bg-slate-200 relative overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-90"></div>
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {item.category}
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-accent-400 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between bg-white relative z-10">
              <p className="text-gray-600 leading-relaxed text-base">
                {item.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-400 font-medium">
                <MapPin size={16} /> ภาคตะวันออกเฉียงเหนือ / เชียงใหม่
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
