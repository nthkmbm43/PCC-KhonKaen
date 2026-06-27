import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  footerProductLinks,
  footerQuickLinks,
  footerSecondaryLinks,
  siteConfig,
} from "@/data/site-config";

const sectionBase =
  "border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

function FooterHeading({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow: string;
}) {
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
            href={link.href}
            className="group flex items-center justify-between gap-4 py-3 text-slate-300 transition-colors hover:text-brand-400"
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

export default function Footer() {
  return (
    <footer className="bg-slate-950 pt-16 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-white/15 pb-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1.08fr]">
            <section className={`${sectionBase} md:row-span-2 lg:row-span-2`}>
              <div className="border-b border-white/10 pb-6">
                <img
                  src="/images/logo-full-light.png"
                  alt="PCC Post-Tension Logo"
                  className="h-24 w-auto max-w-full object-contain sm:h-28"
                />
                <div className="mt-5 inline-flex items-center gap-2 border border-brand-400/40 bg-brand-400/10 px-3 py-1.5 text-sm font-semibold text-brand-200">
                  <Building2 size={16} />
                  สำนักงานขอนแก่น
                </div>
              </div>

              <div className="space-y-6 pt-6">
                {siteConfig.offices.map((office) => (
                  <div
                    key={office.name}
                    className="border-l border-white/15 pl-4"
                  >
                    <h5 className="font-bold text-white">{office.name}</h5>
                    <div className="mt-2 space-y-1 text-sm leading-6 text-slate-400">
                      {office.addressLines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
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
              <div className="relative h-56 overflow-hidden border border-white/15 bg-slate-900 sm:h-64">
                <iframe
                  src={siteConfig.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PCC Post-Tension Location Map"
                  className="absolute inset-0"
                />
              </div>
              <p className="mt-4 flex items-start gap-2 border-t border-white/10 pt-4 text-sm leading-6 text-slate-400">
                <MapPin size={17} className="mt-1 shrink-0 text-brand-400" />
                {siteConfig.offices[0].address}
              </p>
            </section>

            <section className={`${sectionBase} flex flex-col md:col-span-2 lg:col-span-3 lg:col-start-2`}>
              <FooterHeading eyebrow="Resources">ข้อมูลเพิ่มเติม</FooterHeading>
              <div className="grid flex-1 gap-3 sm:grid-cols-3">
                {footerSecondaryLinks.map((link) => (
                  <Link
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
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-3 border border-white/10 bg-white/[0.03] px-5 py-4 font-semibold text-white transition-colors hover:border-brand-400/50"
            >
              <Mail size={20} className="text-brand-300" />
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="flex items-center gap-3 border border-white/10 bg-white/[0.03] px-5 py-4 font-semibold text-white transition-colors hover:border-brand-400/50"
            >
              <Phone size={20} className="text-brand-300" />
              {siteConfig.phone}
            </a>
            <a
              href={siteConfig.social.line.url}
              target="_blank"
              className="flex items-center gap-3 border border-line-app/40 bg-line-app/10 px-5 py-4 font-semibold text-white transition-colors hover:border-line-app"
            >
              <MessageCircle size={20} className="text-line-app" />
              {siteConfig.social.line.label}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.legalName}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-semibold text-slate-400">
            <Link href="/contact" className="hover:text-brand-300">
              TERMS
            </Link>
            <Link href="/contact" className="hover:text-brand-300">
              PRIVACY
            </Link>
            <Link href="/contact" className="hover:text-brand-300">
              COOKIES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
