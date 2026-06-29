import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyFloatingLineBtn from "@/components/ui/StickyFloatingLineBtn";
import { createSeoMetadata, JsonLd, organizationJsonLd } from "@/lib/seo";
import { getAllProducts } from "@/data/products";
import { getSiteSettings } from "@/lib/getSiteSettings";
import "../globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    ...createSeoMetadata({
      title: settings.seo.title,
      description: settings.seo.description,
      keywords: settings.seo.keywords ? settings.seo.keywords.split(',').map((k: string) => k.trim()) : undefined,
    }),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pcc-posttension.com"),
    applicationName: "PCC Post-Tension",
    authors: [{ name: "PCC Post-Tension" }],
    creator: "PCC Post-Tension",
    publisher: "PCC Post-Tension",
    category: "construction",
    icons: {
      icon: settings.contact.faviconUrl || settings.contact.logoUrl || "/images/logo.png",
      shortcut: settings.contact.faviconUrl || settings.contact.logoUrl || "/images/logo.png",
      apple: settings.contact.faviconUrl || settings.contact.logoUrl || "/images/logo.png",
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getAllProducts();
  const settings = await getSiteSettings();
  
  return (
    <html lang="th" className={`${prompt.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen flex flex-col">
        {settings.rawSettings?.customHeadCode ? (
          <div dangerouslySetInnerHTML={{ __html: settings.rawSettings.customHeadCode }} />
        ) : null}
        <JsonLd data={organizationJsonLd(settings.contact)} />
        <Navbar products={products} contact={settings.contact} navbarLinks={settings.navbarLinks} />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer contact={settings.contact} footerData={settings.footerData} />
        <StickyFloatingLineBtn lineUrl={settings.contact.lineUrl} />
        {settings.rawSettings?.customBodyCode ? (
          <div dangerouslySetInnerHTML={{ __html: settings.rawSettings.customBodyCode }} />
        ) : null}
      </body>
    </html>
  );
}
