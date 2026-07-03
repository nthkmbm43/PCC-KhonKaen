import React from 'react';
import Image from 'next/image';
import { siteConfig } from "@/data/site-config";
import { getSiteSettings } from "@/lib/getSiteSettings";

interface ContactSocialBlockProps {
  headline?: string;
  description?: string;
}

export default async function ContactSocialBlock({ headline, description }: ContactSocialBlockProps) {
  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  const facebookUrl = settings.contact.facebookUrl || siteConfig.social?.facebook?.url || "#";

  const title = headline || "ติดตามและติดต่อผ่านช่องทางออนไลน์";
  const desc = description || "ช่องทางติดต่อหลักของ พีซีซี โพสเทนชั่น ขอนแก่น พร้อมลิงก์จริงและไอคอน SVG ฝังในหน้า";

  return (
    <section className="mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="inline-block bg-brand-50 text-brand-600 font-bold px-4 py-1.5 rounded-full text-sm mb-4">
          Social & Map
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-gray-600">
          {desc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-[#00C300] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group text-center flex flex-col items-center">
          <Image src="/images/social/line.png" alt="LINE" width={64} height={64} className="w-16 h-16 object-contain mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold font-sans text-gray-900 mb-3 w-full text-left">LINE</h3>
          <p className="text-gray-600 text-sm leading-relaxed w-full text-left">
            ส่งรูปหน้างาน ขอใบเสนอราคา และสอบถามรายละเอียดสินค้าได้รวดเร็ว
          </p>
        </a>

        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-[#1877F2] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group text-center flex flex-col items-center">
          <Image src="/images/social/facebook.png" alt="Facebook" width={64} height={64} className="w-16 h-16 object-contain mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold font-sans text-gray-900 mb-3 w-full text-left">Facebook</h3>
          <p className="text-gray-600 text-sm leading-relaxed w-full text-left">
            ติดตามผลงานจริง ข่าวสาร งานจัดส่ง และภาพหน้างานจาก พีซีซี โพสเทนชั่น ขอนแก่น
          </p>
        </a>

        <a href={siteConfig.social?.tiktok?.url || "#"} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-black hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group text-center flex flex-col items-center">
          <Image src="/images/social/tiktok.png" alt="TikTok" width={64} height={64} className="w-16 h-16 object-contain mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold font-sans text-gray-900 mb-3 w-full text-left">TikTok</h3>
          <p className="text-gray-600 text-sm leading-relaxed w-full text-left">
            ชมวิดีโอผลงานติดตั้ง การยกวาง การจัดส่ง และบรรยากาศหน้างานจริง
          </p>
        </a>

        <a href="https://www.google.com/maps/place/16.476942,102.774184" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-[#EA4335] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group text-center flex flex-col items-center">
          <Image src="/images/social/google-map.png" alt="Google Map" width={64} height={64} className="w-16 h-16 object-contain mb-4 group-hover:scale-110 transition-transform" />

          <h3 className="text-xl font-bold font-sans text-gray-900 mb-3 w-full text-left">Google Map</h3>
          <p className="text-gray-600 text-sm leading-relaxed w-full text-left">
            เปิดแผนที่เพื่อดูเส้นทางมายังสำนักงานสาขาขอนแก่น
          </p>
        </a>
      </div>
    </section>
  );
}
