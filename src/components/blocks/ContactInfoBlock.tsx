import React from 'react';
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { getSiteSettings } from "@/lib/getSiteSettings";

interface ContactInfoBlockProps {
  headline?: string;
  description?: string;
}

export default async function ContactInfoBlock({ headline, description }: ContactInfoBlockProps) {
  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  const phoneNo = settings.contact.mainPhone.replace(/\D/g, "");
  const displayPhone = settings.contact.mainPhone;

  const title = headline || "ติดต่อเรา";
  const desc = description || "ทีมวิศวกรของเราพร้อมให้คำปรึกษาและประเมินราคาฟรี ไม่มีค่าใช้จ่าย";

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-xl text-gray-600">
          {desc}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Contact Info */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ช่องทางการติดต่อ</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center shrink-0 text-brand-600">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">เบอร์โทรศัพท์</p>
                  <a href={`tel:${phoneNo}`} className="text-lg font-bold text-gray-900 hover:text-brand-600 transition-colors">
                    {displayPhone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#06C755]/10 rounded-full flex items-center justify-center shrink-0 text-[#06C755]">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">LINE Official</p>
                  <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-900 hover:text-[#06C755] transition-colors">
                    แอดเพื่อนเพื่อคุยกับเซลส์
                  </a>
                </div>
              </div>

              {settings.contact.holidayNotice && (
                <div className="flex gap-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0 text-orange-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-orange-800 font-bold uppercase tracking-wider mb-1">ประกาศ (Notice)</p>
                    <p className="text-orange-900 font-medium">
                      {settings.contact.holidayNotice}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 text-slate-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">ที่ตั้งสำนักงาน/โรงงาน</p>
                  <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                    {settings.contact.companyAddress || siteConfig.offices[0].addressLines.join('\n')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 text-slate-600">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">เวลาทำการ</p>
                  <p className="text-gray-900 whitespace-pre-line">
                    {settings.contact.workingHours || "จันทร์ - เสาร์: 8:00 น. - 17:00 น."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0a174f] to-[#1e3ca6] p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">ส่งแบบแปลนมาให้เรา</h3>
              <p className="mb-6 text-brand-100 leading-relaxed">
                หากคุณมีแบบแปลนก่อสร้างแล้ว ส่งเข้ามาทาง LINE ให้วิศวกรของเราช่วยประเมินราคาเบื้องต้นได้ทันที!
              </p>
              <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full bg-accent-500 text-white px-6 py-4 rounded-xl font-bold justify-center items-center gap-2 hover:bg-accent-600 transition-all animate-pulse-glow">
                <MessageCircle size={24} />
                คลิกแอด LINE เลย
              </a>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
              <MessageCircle size={200} />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 h-full min-h-[500px]">
            <iframe
              src={settings.contact.googleMapsUrl || siteConfig.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "1.5rem" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[460px]"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
