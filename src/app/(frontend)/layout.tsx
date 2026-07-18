import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyFloatingLineBtn from "@/components/ui/StickyFloatingLineBtn";
import { createSeoMetadata, JsonLd, organizationJsonLd, serviceCatalogJsonLd, websiteJsonLd } from "@/lib/seo";
import { getPublishedProducts } from "@/lib/repositories/product";
import { getSiteSettings } from "@/lib/getSiteSettings";
import "../globals.css";

import parse from "html-react-parser";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  // Extract Google Site Verification from custom head code if present
  const verificationMatch = settings.rawSettings?.customHeadCode?.match(/<meta\s+name=["']google-site-verification["']\s+content=["']([^"']+)["']/i);
  const googleVerification = verificationMatch ? verificationMatch[1] : undefined;
  
  return {
    ...createSeoMetadata({
      title: settings.seo.title,
      description: settings.seo.description,
      keywords: settings.seo.keywords ? settings.seo.keywords.split(',').map((k: string) => k.trim()) : undefined,
    }),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pcc-khon-kaen.vercel.app"),
    applicationName: "PCC Post-Tension",
    authors: [{ name: "PCC Post-Tension" }],
    creator: "PCC Post-Tension",
    publisher: "PCC Post-Tension",
    category: "construction",
    icons: {
      icon: settings.contact.faviconUrl || settings.contact.logoUrl || "/images/logo.png",
      shortcut: settings.contact.faviconUrl || settings.contact.logoUrl || "/images/logo.png",
      apple: settings.contact.faviconUrl || settings.contact.logoUrl || "/images/logo.png",
    },
    verification: {
      google: googleVerification,
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [products, settings] = await Promise.all([
    getPublishedProducts(),
    getSiteSettings(),
  ]);
  
  return (
    <html lang="th" className="antialiased scroll-smooth">
      <head>
        {settings.rawSettings?.customHeadCode ? parse(settings.rawSettings.customHeadCode) : null}
      </head>
      <body className="min-h-screen flex flex-col">
        <JsonLd data={organizationJsonLd(settings.contact)} />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={serviceCatalogJsonLd()} />
        <Navbar products={products} contact={settings.contact} navbarLinks={settings.navbarLinks as { label: string; url: string }[]} />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer contact={settings.contact} footerData={settings.footerData as { footerLogoUrl?: string; description?: string; copyright?: string }} />
        <StickyFloatingLineBtn lineUrl={settings.contact.lineUrl} />
        {settings.rawSettings?.customBodyCode ? (
          <div dangerouslySetInnerHTML={{ __html: settings.rawSettings.customBodyCode }} />
        ) : null}
      </body>
    </html>
  );
}
