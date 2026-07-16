import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import { getSiteSettings } from "@/lib/getSiteSettings";

interface ContactSocialBlockProps {
  headline?: string;
  description?: string;
  data?: {
    headline?: unknown;
    description?: unknown;
    title?: unknown;
  };
}

function readText(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

export default async function ContactSocialBlock({ headline, description, data }: ContactSocialBlockProps) {
  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  const facebookUrl = settings.contact.facebookUrl || siteConfig.social.facebook.url;
  const tiktokUrl = settings.contact.tiktokUrl || siteConfig.social.tiktok.url;
  const headOffice = siteConfig.offices[0];

  const title =
    headline ||
    readText(data?.headline) ||
    readText(data?.title) ||
    "ช่องทางติดต่อออนไลน์";
  const desc =
    description ||
    readText(data?.description) ||
    "เลือกช่องทางที่สะดวก แล้วกดเพื่อเปิด LINE, Facebook, TikTok หรือแผนที่ได้ทันที";

  const links = [
    {
      label: "LINE",
      href: lineUrl,
      icon: "/images/social/line.png",
      borderClass: "border-t-[#06C755]",
      text: "ส่งรูปหน้างาน ขอใบเสนอราคา และสอบถามรายละเอียดสินค้าได้รวดเร็ว",
    },
    facebookUrl
      ? {
          label: "Facebook",
          href: facebookUrl,
          icon: "/images/social/facebook.png",
          borderClass: "border-t-[#1877F2]",
          text: "ติดตามผลงานจริง ข่าวสาร งานจัดส่ง และภาพหน้างานล่าสุด",
        }
      : null,
    tiktokUrl
      ? {
          label: "TikTok",
          href: tiktokUrl,
          icon: "/images/social/tiktok.png",
          borderClass: "border-t-black",
          text: "ชมวิดีโอผลงานติดตั้ง การยกวาง การจัดส่ง และบรรยากาศหน้างานจริง",
        }
      : null,
    {
      label: "Google Map สำนักงานขอนแก่น",
      href: headOffice.mapUrl,
      icon: "/images/social/google-map.png",
      borderClass: "border-t-[#EA4335]",
      text: "เปิดหมุดสำนักงานขอนแก่นเพื่อดูเส้นทางใน Google Maps",
    },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item?.href));

  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <span className="inline-flex border border-brand-200 bg-white px-3 py-1 text-sm font-bold text-brand-700">
            Contact channels
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            {desc}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex min-h-56 flex-col border border-gray-100 ${item.borderClass} border-t-4 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={64}
                height={64}
                className="h-16 w-16 object-contain transition-transform group-hover:scale-105"
              />
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {item.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {item.text}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
