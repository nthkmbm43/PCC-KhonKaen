import React from 'react';
import Image from "next/image";
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
  const facebookUrl = settings.contact.facebookUrl || siteConfig.social.facebook.url;
  const tiktokUrl = settings.contact.tiktokUrl || siteConfig.social.tiktok.url;
  const phoneNo = settings.contact.mainPhone.replace(/\D/g, "");
  const displayPhone = settings.contact.mainPhone;
  const socialLinks = [
    {
      label: "LINE Official",
      href: lineUrl,
      icon: "/images/social/line.png",
      colorClass: "bg-[#06C755]/10",
      textClass: "hover:text-[#06C755]",
      text: "แอดเพื่อนเพื่อคุยกับเซลส์",
    },
    {
      label: "Facebook",
      href: facebookUrl,
      icon: "/images/social/facebook.png",
      colorClass: "bg-[#1877F2]/10",
      textClass: "hover:text-[#1877F2]",
      text: "ติดตามผลงานและข่าวสาร",
    },
    tiktokUrl
      ? {
          label: "TikTok",
          href: tiktokUrl,
          icon: "/images/social/tiktok.png",
          colorClass: "bg-black/10",
          textClass: "hover:text-black",
          text: "ชมวิดีโอผลงานหน้างาน",
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item?.href));

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
                  <Image src="/images/social/line.png" alt="LINE Official" width={28} height={28} className="h-7 w-7 object-contain" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">LINE Official</p>
                  <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-900 hover:text-[#06C755] transition-colors">
                    แอดเพื่อนเพื่อคุยกับเซลส์
                  </a>
                </div>
              </div>

              {socialLinks.filter((item) => item.label !== "LINE Official").map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className={`w-12 h-12 ${item.colorClass} rounded-full flex items-center justify-center shrink-0`}>
                    <Image src={item.icon} alt={item.label} width={28} height={28} className="h-7 w-7 object-contain" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">{item.label}</p>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={`text-lg font-bold text-gray-900 ${item.textClass} transition-colors`}>
                      {item.text}
                    </a>
                  </div>
                </div>
              ))}

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
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">ที่ตั้งสำนักงาน</p>
                  <div className="space-y-4">
                    {siteConfig.offices.map((office, idx) => (
                      <div key={idx}>
                        <p className="text-gray-900 font-bold">{office.name}</p>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                          {office.addressLines.join('\n')}
                        </p>
                      </div>
                    ))}
                  </div>
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

        {/* Map link */}
        <div className="w-full lg:w-2/3">
          <div className="flex h-full min-h-[420px] flex-col justify-between rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800 p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-200">
                PCC Post-Tension Khon Kaen
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight">
                แผนที่สำนักงานและโรงงานขอนแก่น
              </h2>
              <p className="mt-4 leading-8 text-blue-100">
                เปิดเส้นทางผ่าน Google Maps เพื่อเดินทางมาปรึกษางานกำแพงกันดิน รั้วสำเร็จรูป พื้น Precast และงานโพสเทนชั่น
              </p>
            </div>
            {settings.contact.googleMapsUrl && (
              <a
                href={settings.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-500 px-6 py-4 text-center font-bold text-white transition-colors hover:bg-brand-600"
              >
                เปิดเส้นทางใน Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
