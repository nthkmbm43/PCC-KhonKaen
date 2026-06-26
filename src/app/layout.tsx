import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyFloatingLineBtn from "@/components/ui/StickyFloatingLineBtn";
import { createSeoMetadata, JsonLd, organizationJsonLd } from "@/lib/seo";
import { getAllProducts } from "@/data/products";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

export const metadata: Metadata = {
  ...createSeoMetadata({
    title:
      "PCC Post-Tension ขอนแก่น | รับเหมาโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป",
    description:
      "รับเหมางานโพสเทนชั่น ผลิตและติดตั้งแผ่นพื้นสำเร็จรูป กำแพงกันดินตัว L รั้วสำเร็จรูป ขอนแก่น ภาคอีสาน และเชียงใหม่ โดยทีมวิศวกร",
  }),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pcc-posttension.com"),
  applicationName: "PCC Post-Tension",
  authors: [{ name: "PCC Post-Tension" }],
  creator: "PCC Post-Tension",
  publisher: "PCC Post-Tension",
  category: "construction",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getAllProducts();
  
  return (
    <html lang="th" className={`${prompt.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen flex flex-col">
        <JsonLd data={organizationJsonLd()} />
        <Navbar products={products} />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
        <StickyFloatingLineBtn />
      </body>
    </html>
  );
}
