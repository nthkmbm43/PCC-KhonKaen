import React from 'react';
import { getAllPortfolios, portfolioCategoryLabels } from "@/data/portfolio";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PortfolioFullGridBlockProps {
  headline?: string;
  description?: string;
}

export default async function PortfolioFullGridBlock({ headline, description }: PortfolioFullGridBlockProps) {
  const portfolios = await getAllPortfolios();
  const title = headline || "ผลงานความสำเร็จ";
  const desc = description || "รวมผลงานอ้างอิงจากประสบการณ์การดำเนินงานเดิมของบริษัท เพื่อให้ลูกค้าประเมินรูปแบบและขอบเขตงานก่อนส่งข้อมูลให้ทีมขายและวิศวกรผู้ดูแล";

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

      <div className="mb-10 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-center text-sm leading-6 text-blue-900">
        ผลงานทั้งหมดเป็นผลงานอ้างอิงจากประสบการณ์ของบริษัท การประเมินราคาและรับงานใหม่จะส่งต่อให้ทีมขายและวิศวกรผู้รับผิดชอบโดยตรง
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {portfolios.map((item) => (
          <article key={item.slug} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
            <div className="h-64 sm:h-72 bg-slate-200 relative overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.title}
                fill
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-90"></div>
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {portfolioCategoryLabels[item.category] || item.category}
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-accent-400 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between bg-white relative z-10">
              <p className="text-gray-600 leading-relaxed text-base line-clamp-4">
                {item.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 font-medium">
                <MapPin size={16} /> {item.location || 'ประเทศไทย'}
              </div>
              <Link href={`/portfolio/${item.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-brand-700 hover:text-brand-900">
                ดูรายละเอียดในเว็บไซต์นี้ <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
