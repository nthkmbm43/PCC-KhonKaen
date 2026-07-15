import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, ChevronRight, MapPin, Phone } from "lucide-react";
import {
  footerProductLinks,
  footerQuickLinks,
  footerSecondaryLinks,
  siteConfig,
} from "@/data/site-config";

const sectionBase =
  "border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

function FooterHeading({ children, eyebrow }: { children: React.ReactNode; eyebrow: string }) {
  return (
    <div className="mb-5 border-l-4 border-accent-500 pl-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">
        {eyebrow}
      </p>
      <h4 className="mt-1 text-xl font-bold text-white">{children}</h4>
    </div>
  );
}

function FooterLinkList({
  links,
}: {
  links: readonly { label: string; href: string; external?: boolean }[];
}) {
  return (
    <ul className="divide-y divide-white/10">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            prefetch={false}
            href={link.href}
            className="group flex min-h-12 items-center justify-between gap-4 py-3 text-slate-300 transition-colors hover:text-brand-400"
            target={link.external ? "_blank" : undefined}
          >
            <span className="flex items-center gap-2">
              <ChevronRight
                size={16}
                className="text-accent-500 transition-transform group-hover:translate-x-1"
              />
              {link.label}
            </span>
            <ArrowUpRight
              size={15}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

interface ContactInfo {
  logoUrl?: string;
  lineUrl: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  mainPhone: string;
  googleMapsUrl?: string;
  companyAddress?: string;
  workingHours?: string;
  holidayNotice?: string;
}

interface FooterData {
  footerLogoUrl?: string | null;
  description?: string | null;
  copyright?: string | null;
}

export default function Footer({
  contact,
  footerData,
}: {
  contact: ContactInfo;
  footerData?: FooterData;
}) {
  const currentYear = new Date().getFullYear();
  const address = contact.companyAddress || siteConfig.offices[0].addressLines.join("\n");
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address.replace(/\s+/g, " ").trim()
  )}`;
  const socialLinks = [
    {
      label: "LINE",
      href: contact.lineUrl,
      icon: "/images/social/line.png",
      className: "border-line-app/40 bg-line-app/10 hover:border-line-app",
    },
    {
      label: "Facebook",
      href: contact.facebookUrl || siteConfig.social.facebook.url,
      icon: "/images/social/facebook.png",
      className: "border-[#1877F2]/40 bg-[#1877F2]/10 hover:border-[#1877F2]",
    },
    contact.tiktokUrl
      ? {
          label: "TikTok",
          href: contact.tiktokUrl,
          icon: "/images/social/tiktok.png",
          className: "border-white/20 bg-white/[0.03] hover:border-white/50",
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item?.href));

  return (
    <footer className="border-t-4 border-brand-500 bg-slate-950 pt-16 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-white/15 pb-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1.08fr]">
            <section className={`${sectionBase} md:row-span-2 lg:row-span-2`}>
              <div className="border-b border-white/10 pb-6">
                <div className="relative h-24 w-48 sm:h-28 sm:w-56">
                  <Image
                    src={footerData?.footerLogoUrl || contact.logoUrl || "/images/logo-full-light.png"}
                    alt="PCC Post-Tension Logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <div className="mt-5 inline-flex items-center gap-2 border border-brand-400/40 bg-brand-400/10 px-3 py-1.5 text-sm font-semibold text-brand-200">
                  <Building2 size={16} />
                  สำนักงานขอนแก่น
                </div>
                {footerData?.description && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    {footerData.description}
                  </p>
                )}
              </div>

              <div className="space-y-6 pt-6">
                <div className="border-l border-white/15 pl-4">
                  <h5 className="font-bold text-white">สำนักงานใหญ่</h5>
                  <div className="mt-2 space-y-1 whitespace-pre-line text-sm leading-6 text-slate-400">
                    {address}
                  </div>
                </div>
              </div>
            </section>

            <section className={sectionBase}>
              <FooterHeading eyebrow="Products">ผลิตภัณฑ์ของเรา</FooterHeading>
              <FooterLinkList links={footerProductLinks} />
            </section>

            <section className={sectionBase}>
              <FooterHeading eyebrow="Menu">เมนูด่วน</FooterHeading>
              <FooterLinkList links={footerQuickLinks} />
            </section>

            <section className={sectionBase}>
              <FooterHeading eyebrow="Location">แผนที่</FooterHeading>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open PCC Post-Tension Khon Kaen location in Google Maps"
                className="group block overflow-hidden rounded-xl border border-white/15 bg-slate-900 transition-colors hover:border-brand-400/60"
              >
                <div className="relative flex h-48 items-center justify-center bg-[linear-gradient(135deg,#07111f_0%,#0f1f3d_45%,#132a55_100%)] p-5">
                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(96,165,250,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,.22)_1px,transparent_1px)] [background-size:32px_32px]" />
                  <div className="relative w-full max-w-[250px] bg-white p-4 text-slate-900 shadow-xl">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <MapPin size={22} />
                    </div>
                    <p className="text-sm font-bold leading-snug">PCC Post-Tension Khon Kaen</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {address}
                    </p>
                  </div>
                </div>
                <div className="flex min-h-14 items-center justify-between gap-3 border-t border-white/10 px-4 py-3 font-bold text-white">
                  <span>Open in Google Maps</span>
                  <ArrowUpRight size={18} className="shrink-0 text-accent-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
              <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-start gap-3 text-slate-400">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-brand-400" />
                  <span className="whitespace-pre-line text-sm leading-relaxed">
                    {address}
                  </span>
                </div>
              </div>
            </section>

            <section className={`${sectionBase} flex flex-col md:col-span-2 lg:col-span-3 lg:col-start-2`}>
              <FooterHeading eyebrow="Resources">ข้อมูลเพิ่มเติม</FooterHeading>
              <div className="grid flex-1 gap-3 sm:grid-cols-3">
                {footerSecondaryLinks.map((link) => (
                  <Link
                    prefetch={false}
                    key={link.label}
                    href={link.href}
                    className="flex min-h-20 items-center justify-center border border-white/10 px-4 py-4 text-center font-semibold text-slate-200 transition-colors hover:border-brand-400/60 hover:text-brand-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="border-b border-white/15 py-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <a
              href={`tel:${contact.mainPhone.replace(/\D/g, "")}`}
              className="flex min-h-14 items-center gap-3 border border-white/10 bg-white/[0.03] px-5 py-4 font-semibold text-white transition-colors hover:border-brand-400/50"
            >
              <Phone size={20} className="text-brand-300" />
              {contact.mainPhone}
            </a>
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-14 items-center gap-3 border px-5 py-4 font-semibold text-white transition-colors ${item.className}`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={22}
                  height={22}
                  className="h-5 w-5 object-contain"
                />
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>{footerData?.copyright || `© ${currentYear} ${siteConfig.legalName}. All rights reserved.`}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-semibold text-slate-400">
            {footerSecondaryLinks.slice(0, 3).map((link) => (
              <Link
                key={link.label}
                prefetch={false}
                href={link.href}
                className="inline-flex min-h-11 items-center hover:text-brand-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
