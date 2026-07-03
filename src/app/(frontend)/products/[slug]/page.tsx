import { getProductWithSeo, getPublishedProducts } from "@/lib/repositories/product";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Phone, ArrowLeft, ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { absoluteUrl, createSeoMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { draftMode } from "next/headers";

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductWithSeo(slug);
  
  if (!product) {
    return createSeoMetadata({
      title: "ไม่พบสินค้า | PCC Post-Tension",
      description: "ไม่พบข้อมูลสินค้าและบริการที่คุณต้องการ",
      path: `/products/${slug}`,
    });
  }

  return createSeoMetadata({
    title: product.seo?.title || `${product.title} | PCC Post-Tension ขอนแก่น`,
    description: product.seo?.description || product.description || "",
    keywords: product.seo?.keywords ? product.seo.keywords.split(',').map((k: string) => k.trim()) : [],
    path: `/products/${product.slug}`,
    image: product.seo?.ogImage || product.image || undefined,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductWithSeo(slug);
  const isDraftMode = (await draftMode()).isEnabled;
  
  if (!product || (!isDraftMode && product.workflowState !== "published")) {
    notFound();
  }

  const allProducts = await getPublishedProducts();
  const currentIndex = allProducts.findIndex(p => p.slug === slug);
  const nextProduct = currentIndex >= 0 && currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : null;
  const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null;

  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  const phoneNo = settings.contact.mainPhone.replace(/\D/g, "");
  const displayPhone = settings.contact.mainPhone;

  // Type cast for features if it is stored as JSON
  const features = Array.isArray((product as any).features) ? (product as any).features : [];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/products/${product.slug}`)}#service`,
    name: product.title,
    description: product.description,
    image: absoluteUrl(product.image || undefined),
    url: absoluteUrl(`/products/${product.slug}`),
    provider: {
      "@id": `${siteConfig.url}#organization`,
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: product.shortTitle,
      itemListElement: features.map((feature: any) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: feature,
        },
      })),
    },
  };

  // Safe cast for content (sections)
  const sections = Array.isArray(product.content) ? product.content : [];

  return (
    <div className="bg-white">
      <JsonLd data={productJsonLd} />
      
      {isDraftMode && (
        <div className="bg-amber-100 text-amber-800 text-center text-xs py-1 font-semibold sticky top-0 z-50">
          Preview Mode: You are viewing unpublished changes.
        </div>
      )}

      {/* Product Hero */}
      <div className="relative bg-slate-900 pt-20 pb-32 lg:pt-40 lg:pb-40 overflow-hidden group">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay transition-transform duration-[10s] group-hover:scale-110">
          <img 
            src={product.image || '/images/hero.jpg'} 
            alt={product.title} 
            className="w-full h-full object-cover blur-sm" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent opacity-90 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-brand-400 font-semibold hover:text-white transition-all hover:-translate-x-1 mb-8 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft size={18} /> กลับไปหน้าสินค้าทั้งหมด
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
            {product.title}
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto drop-shadow-md leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative -mt-20 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-[2.5rem] shadow-2xl overflow-hidden mb-16 border-4 border-white bg-white group cursor-default">
              <img 
                src={product.image || '/images/hero.jpg'} 
                alt={product.title} 
                className="w-full object-cover aspect-video group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>

            <div className="space-y-20">
              {sections.map((section: any, idx: number) => {
                if (section.type === 'text') {
                  return (
                    <div key={idx} id={section.id} className="relative">
                      <div className="absolute -left-8 top-2 w-2 h-full bg-gradient-to-b from-brand-500 to-transparent rounded-full opacity-20"></div>
                      {section.title && <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">{section.title}</h2>}
                      {section.content && <p className="text-xl text-gray-700 leading-relaxed mb-8">{section.content}</p>}
                    </div>
                  );
                } else if (section.type === 'image') {
                  return (
                    <div key={idx} className="mb-10 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                      <img src={section.image} alt={section.title || product.title} className="w-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  );
                } else if (section.type === 'html') {
                  return (
                    <div key={idx} className="w-full" dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                  );
                } else {
                  // Fallback for old data
                  return (
                    <div key={idx} id={section.id} className="relative">
                      <div className="absolute -left-8 top-2 w-2 h-full bg-gradient-to-b from-brand-500 to-transparent rounded-full opacity-20"></div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">{section.title}</h2>
                      <p className="text-xl text-gray-700 leading-relaxed mb-8">{section.content}</p>
                      
                      {section.image && (
                        <div className="mb-10 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                          <img src={section.image} alt={section.title} className="w-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                      
                      {section.bullets && section.bullets.length > 0 && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {section.bullets.map((bullet: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 bg-zinc-50 p-6 rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-md transition-all group hover:-translate-y-1">
                              <CheckCircle2 size={24} className="text-brand-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                              <span className="text-gray-800 text-lg">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }
              })}
            </div>

            {/* Engineering Standards Box */}
            <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} className="text-brand-400" />
                </div>
                มาตรฐานวิศวกรรมที่คุณวางใจได้
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                  <div className="text-brand-400 font-bold text-lg mb-2">ผลิตตามมาตรฐาน มอก.</div>
                  <p className="text-slate-300 text-sm leading-relaxed">สินค้าคอนกรีตอัดแรงทุกชิ้นผ่านการควบคุมคุณภาพอย่างเข้มงวด ได้รับมาตรฐานผลิตภัณฑ์อุตสาหกรรม (มอก.)</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                  <div className="text-brand-400 font-bold text-lg mb-2">ออกแบบโดยวิศวกร (สย.)</div>
                  <p className="text-slate-300 text-sm leading-relaxed">ทุกโครงสร้างได้รับการคำนวณและออกแบบโดยวิศวกรโยธาผู้มีใบอนุญาตประกอบวิชาชีพ มั่นใจในความปลอดภัย 100%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-8 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-8 relative z-10 flex items-center gap-3">
                <div className="w-2 h-8 bg-brand-500 rounded-full"></div>
                จุดเด่นของบริการ
              </h3>
              
              <ul className="space-y-5 mb-12 relative z-10">
                {features.map((feature: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <CheckCircle2 size={24} className="text-[#06C755] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700 font-medium text-lg group-hover:text-gray-900 transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 relative z-10 pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                  {prevProduct ? (
                    <Link href={`/products/${prevProduct.slug}`} className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold transition-colors group/nav">
                      <ArrowLeft size={20} className="group-hover/nav:-translate-x-1 transition-transform" /> {prevProduct.shortTitle}
                    </Link>
                  ) : <div></div>}
                  {nextProduct ? (
                    <Link href={`/products/${nextProduct.slug}`} className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold transition-colors group/nav">
                      {nextProduct.shortTitle} <ArrowRight size={20} className="group-hover/nav:translate-x-1 transition-transform" />
                    </Link>
                  ) : <div></div>}
                </div>
                <div className="bg-brand-50 text-brand-700 px-4 py-2 rounded-xl text-center font-bold text-sm mb-6 border border-brand-100 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                  จัดส่งด่วนทั่วอีสานตอนบนและเชียงใหม่
                </div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">สนใจให้เราประเมินราคา?</p>
                <a aria-label="แอด LINE เพื่อสอบถามเกี่ยวกับสินค้านี้" href={lineUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white px-6 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:shadow-[0_10px_25px_rgba(6,199,85,0.4)] hover:-translate-y-1 group">
                  <MessageCircle size={24} className="group-hover:animate-bounce" />
                  แอด LINE สอบถาม
                  <ArrowRight size={20} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </a>
                <a aria-label={`โทรปรึกษาวิศวกรเบอร์ ${displayPhone}`} href={`tel:${phoneNo}`} className="w-full bg-slate-100 hover:bg-slate-200 text-gray-800 px-6 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1">
                  <Phone size={24} />
                  โทรศัพท์: {displayPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
