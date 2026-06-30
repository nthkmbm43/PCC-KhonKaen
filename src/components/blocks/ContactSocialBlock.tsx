import React from 'react';
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
        <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-[#00C300] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00b900] to-[#20d720] flex items-center justify-center shadow-lg shadow-green-500/25 mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
               <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.266 8.887 7.72 9.613.303.064.717.195.823.447.095.228.061.58.028.81l-.265 1.597c-.042.253-.193.978.857.535 1.049-.444 5.658-3.332 7.795-5.748C21.751 14.802 24 12.696 24 10.304zm-14.887 3.033h-2.502c-.221 0-.4-.179-.4-.4V8.423c0-.221.179-.4.4-.4h.896c.221 0 .4.179.4.4v3.618h1.206c.221 0 .4.179.4.4v.896c0 .221-.179.4-.4.4zm3.931-1.39l-1.637-2.735c-.066-.111-.144-.194-.236-.245-.091-.053-.192-.078-.302-.078-.112 0-.214.025-.306.078-.093.051-.17.134-.236.245l-1.636 2.735c-.063.106-.095.216-.095.334 0 .221.179.4.4.4h.896c.112 0 .214-.047.288-.124l1.011-1.69 1.011 1.69c.074.077.176.124.288.124h.896c.221 0 .4-.179.4-.4 0-.118-.032-.228-.095-.334zm2.146 1.39h-.896c-.221 0-.4-.179-.4-.4V8.423c0-.221.179-.4.4-.4h.896c.221 0 .4.179.4.4v4.514c0 .221-.179.4-.4.4zm3.626-2.906h-1.613V8.823h1.613c.221 0 .4-.179.4-.4v-.896c0-.221-.179-.4-.4-.4h-2.508c-.221 0-.4.179-.4.4v4.514c0 .221.179.4.4.4h2.508c.221 0 .4-.179.4-.4v-.896c0-.221-.179-.4-.4-.4h-1.613v-1.12h1.613c.221 0 .4-.179.4-.4v-.896c0-.221-.179-.4-.4-.4z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">LINE</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            ส่งรูปหน้างาน ขอใบเสนอราคา และสอบถามรายละเอียดสินค้าได้รวดเร็ว
          </p>
        </a>

        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-[#1877F2] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1877F2] to-[#3b8ef2] flex items-center justify-center shadow-lg shadow-blue-500/25 mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Facebook</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            ติดตามผลงานจริง ข่าวสาร งานจัดส่ง และภาพหน้างานจาก พีซีซี โพสเทนชั่น ขอนแก่น
          </p>
        </a>

        <a href={siteConfig.social?.tiktok?.url || "#"} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-black hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gray-900 to-black flex items-center justify-center shadow-lg shadow-gray-900/25 mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.41-2.93 5.76-1.76 1.36-4.14 1.88-6.31 1.41-2.6-.55-4.71-2.61-5.36-5.18-.74-2.88.22-6.07 2.45-7.98 1.95-1.66 4.67-2.22 7.15-1.57.01 1.45-.01 2.91.02 4.36-1.22-.44-2.61-.43-3.79.08-1.42.59-2.39 1.99-2.52 3.52-.16 1.7.74 3.39 2.22 4.18 1.46.79 3.32.74 4.74-.15 1.51-.95 2.43-2.61 2.48-4.36.09-5.91.05-11.83.05-17.74h-2.26z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">TikTok</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            ชมวิดีโอผลงานติดตั้ง การยกวาง การจัดส่ง และบรรยากาศหน้างานจริง
          </p>
        </a>

        <a href="https://www.google.com/maps/place/16.476942,102.774184" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-[#EA4335] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#EA4335] to-[#f46859] flex items-center justify-center shadow-lg shadow-red-500/25 mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Google Map</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            เปิดแผนที่เพื่อดูเส้นทางมายังสำนักงานสาขาขอนแก่น
          </p>
        </a>
      </div>
    </section>
  );
}
