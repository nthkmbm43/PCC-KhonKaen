import React from "react";
import Image from "next/image";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import StaticMapPreview from "@/components/StaticMapPreview";
import { siteConfig } from "@/data/site-config";
import { getSiteSettings } from "@/lib/getSiteSettings";

interface ContactInfoBlockProps {
  headline?: string;
  description?: string;
}

export default async function ContactInfoBlock({
  headline,
  description,
}: ContactInfoBlockProps) {
  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  const facebookUrl = settings.contact.facebookUrl || siteConfig.social.facebook.url;
  const tiktokUrl = settings.contact.tiktokUrl || siteConfig.social.tiktok.url;
  const phoneNo = settings.contact.mainPhone.replace(/\D/g, "");
  const displayPhone = settings.contact.mainPhone;
  const address = settings.contact.companyAddress || siteConfig.offices[0].addressLines.join("\n");
  const title = headline || "ติดต่อเรา";
  const desc =
    description ||
    "ทีมวิศวกรของเราพร้อมให้คำปรึกษา ประเมินราคา และแนะนำระบบก่อสร้างที่เหมาะกับหน้างานของคุณ";

  const socialLinks = [
    {
      label: "LINE Official",
      href: lineUrl,
      icon: "/images/social/line.png",
      colorClass: "bg-[#06C755]/10",
      textClass: "hover:text-[#06C755]",
      text: "แอดเพื่อนเพื่อคุยกับฝ่ายขาย",
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

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
          {title}
        </h1>
        <p className="text-xl leading-relaxed text-gray-600">{desc}</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="w-full space-y-8 lg:w-1/3">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              ช่องทางการติดต่อ
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-bold uppercase tracking-wider text-gray-500">
                    โทรศัพท์
                  </p>
                  <a
                    href={`tel:${phoneNo}`}
                    className="text-lg font-bold text-gray-900 transition-colors hover:text-brand-600"
                  >
                    {displayPhone}
                  </a>
                </div>
              </div>

              {socialLinks.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.colorClass}`}>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-wider text-gray-500">
                      {item.label}
                    </p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-lg font-bold text-gray-900 ${item.textClass} transition-colors`}
                    >
                      {item.text}
                    </a>
                  </div>
                </div>
              ))}

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                    ที่ตั้งสำนักงาน
                  </p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="mb-1 text-sm font-bold uppercase tracking-wider text-gray-500">
                    เวลาทำการ
                  </p>
                  <p className="whitespace-pre-line text-gray-900">
                    {settings.contact.workingHours || "จันทร์ - เสาร์: 08:00 - 17:00 น."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a174f] to-[#1e3ca6] p-8 text-white shadow-lg">
            <div className="relative z-10">
              <h3 className="mb-4 text-2xl font-bold">ส่งแบบแปลนมาให้เรา</h3>
              <p className="mb-6 leading-relaxed text-brand-100">
                ส่งแบบหน้างานหรือรายละเอียดงานผ่าน LINE เพื่อให้ทีมช่วยประเมินราคาเบื้องต้นได้ทันที
              </p>
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full animate-pulse-glow items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-4 font-bold text-white transition-all hover:bg-accent-600"
              >
                <MessageCircle size={24} />
                คลิกแอด LINE เลย
              </a>
            </div>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-10">
              <MessageCircle size={200} />
            </div>
          </div>
        </div>

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
                ดูตำแหน่งสำนักงานก่อนเดินทาง หรือกดเปิด Google Maps เพื่อให้นำทางมายัง PCC Post-Tension ขอนแก่น
              </p>
            </div>

            {settings.contact.googleMapsUrl && (
              <StaticMapPreview
                href={settings.contact.googleMapsUrl}
                address={address.replace(/\n/g, " ")}
                className="mt-6 rounded-3xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
