import { getProductWithSeo, getPublishedProducts } from "@/lib/repositories/product";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import ExitPreviewButton from '@/components/ExitPreviewButton';
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

  const features = Array.isArray((product as { features?: string[] }).features) ? (product as { features?: string[] }).features : [];
  const highlights = Array.isArray(product.highlights) ? product.highlights : [];

  const productJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${absoluteUrl(`/products/${product.slug}`)}#service`,
      name: product.title,
      description: product.description,
      image: absoluteUrl(product.image || undefined),
      url: absoluteUrl(`/products/${product.slug}`),
      provider: {
        "@type": "Organization",
        "@id": `${siteConfig.url}#organization`,
        name: "PCC Post-Tension",
        brand: "PCC Post-Tension"
      },
      areaServed: siteConfig.serviceAreas.map((area) => ({
        "@type": "AdministrativeArea",
        name: area,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: product.shortTitle,
        itemListElement: (features || []).map((feature: string) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: feature,
          },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "หน้าแรก",
          "item": absoluteUrl("/")
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "สินค้าและบริการ",
          "item": absoluteUrl("/products")
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.title,
          "item": absoluteUrl(`/products/${product.slug}`)
        }
      ]
    }
  ];

  // Safe cast for content (sections)
  const sections = Array.isArray(product.content) ? product.content : [];

  return (
    <div className="bg-white">
      <JsonLd data={productJsonLd} />
      
      {isDraftMode && (
        <div className="bg-amber-100 text-amber-800 text-center text-xs py-1.5 font-semibold sticky top-0 z-50 flex justify-center items-center gap-4">
          <span>Preview Mode: You are viewing unpublished changes.</span>
          <ExitPreviewButton />
        </div>
      )}

      {/* Product Hero */}
      {product.imageLayout === 'full-width' ? (
        <div className="w-full relative h-[60vh] min-h-[500px] overflow-hidden">
          <Image 
            src={product.image || '/images/hero.jpg'} 
            alt={product.title} 
            fill
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-0"></div>
          {/* Subtle Engineered Grid Overlay */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute bottom-0 left-0 w-full z-10 p-8 lg:p-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center space-x-2 text-sm text-white/80 font-medium">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">หน้าแรก</Link>
                  </li>
                  <li><span className="text-white/40">/</span></li>
                  <li>
                    <Link href="/products" className="hover:text-white transition-colors">สินค้าและบริการ</Link>
                  </li>
                  <li><span className="text-white/40">/</span></li>
                  <li aria-current="page" className="text-white truncate max-w-[200px] sm:max-w-none block">
                    {product.shortTitle || product.title}
                  </li>
                </ol>
              </nav>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
                {product.title}
              </h1>
              <p className="text-xl lg:text-2xl text-slate-200 max-w-4xl drop-shadow-md leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-slate-900 pt-20 pb-12 lg:pt-40 lg:pb-16 overflow-hidden group">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay transition-transform duration-[10s] group-hover:scale-110">
            <Image 
              src={product.image || '/images/hero.jpg'} 
              alt={product.title} 
              fill
              className="object-cover blur-sm" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/30 opacity-90 z-0"></div>
          {/* Subtle Engineered Grid Overlay */}
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <nav aria-label="Breadcrumb" className="mb-8 flex justify-center">
              <ol className="flex items-center space-x-2 text-sm text-slate-300 font-medium bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">หน้าแรก</Link>
                </li>
                <li><span className="text-white/30">/</span></li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">สินค้าและบริการ</Link>
                </li>
                <li><span className="text-white/30">/</span></li>
                <li aria-current="page" className="text-white">
                  {product.shortTitle || product.title}
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
              {product.title}
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto drop-shadow-md leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-24 relative z-20 mt-0`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-12">
            {product.imageLayout !== 'full-width' && (
              <div className="rounded-[2.5rem] shadow-2xl overflow-hidden mb-16 border-4 border-white group cursor-default">
                <Image 
                  src={product.image || '/images/hero.jpg'} 
                  alt={product.title}
                  width={1200}
                  height={1600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              </div>
            )}

            <div className="space-y-12 lg:space-y-20">
              {sections.map((section: { type?: string; id?: string; title?: string; content?: string; image?: string; bullets?: string[] }, idx: number) => {
                if (section.type === 'text') {
                  return (
                    <div key={idx} id={section.id} className="relative group">
                      <div className="absolute -left-4 sm:-left-8 top-0 w-1 sm:w-2 h-full bg-gradient-to-b from-brand-500 via-brand-400 to-transparent rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      {section.title && (
                        <div className="mb-6">
                          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight inline-block relative">
                            {section.title}
                            <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-brand-500 rounded-full"></div>
                          </h2>
                        </div>
                      )}
                      {section.content && <div className="prose prose-lg sm:prose-xl max-w-none text-slate-700 leading-relaxed font-medium prose-p:mb-6 prose-strong:text-brand-900 prose-a:text-brand-600 hover:prose-a:text-brand-800 transition-all">{section.content.split('\\n').map((para, i) => <p key={i}>{para}</p>)}</div>}
                    </div>
                  );
                } else if (section.type === 'image') {
                  return (
                    <div key={idx} className="mb-8 lg:mb-10 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                      <Image src={section.image || '/images/placeholder.jpg'} alt={section.title || product.title} width={1200} height={800} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  );
                } else if (section.type === 'html') {
                  return (
                    <div key={idx} className="w-full" dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                  );
                } else {
                  // Fallback for old data
                  return (
                    <div key={idx} id={section.id} className="relative group">
                      <div className="absolute -left-4 sm:-left-8 top-0 w-1 sm:w-2 h-full bg-gradient-to-b from-brand-500 via-brand-400 to-transparent rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      {section.title && (
                        <div className="mb-6">
                          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight inline-block relative">
                            {section.title}
                            <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-brand-500 rounded-full"></div>
                          </h2>
                        </div>
                      )}
                      {section.content && <div className="prose prose-lg sm:prose-xl max-w-none text-slate-700 leading-relaxed font-medium prose-p:mb-6 prose-strong:text-brand-900">{section.content.split('\\n').map((para, i) => <p key={i}>{para}</p>)}</div>}
                      
                      {section.image && (
                        <div className="mb-8 lg:mb-12 mt-8 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                          <Image src={section.image || '/images/placeholder.jpg'} alt={section.title || product.title} width={1200} height={800} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                      
                      {section.bullets && section.bullets.length > 0 && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                          {section.bullets.map((bullet: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 bg-white shadow-sm p-6 rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-lg transition-all duration-300 group/bullet hover:-translate-y-1">
                              <CheckCircle2 size={24} className="text-brand-500 shrink-0 mt-0.5 group-hover/bullet:scale-110 group-hover/bullet:text-brand-600 transition-all" />
                              <span className="text-slate-800 text-lg font-medium">{bullet}</span>
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
            <div className="mt-12 lg:mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl group transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              {/* Subtle Animated Engineering Grid Overlay */}
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20 group-hover:bg-brand-500/20 group-hover:border-brand-400/50 transition-all duration-500 relative">
                  <div className="absolute inset-0 rounded-full border border-brand-400 animate-ping opacity-20 group-hover:opacity-40"></div>
                  <CheckCircle2 size={28} className="text-brand-400 group-hover:text-brand-300 transition-colors" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">มาตรฐานวิศวกรรมที่คุณวางใจได้</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                  <div className="text-brand-400 font-bold text-xl mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                    ผลิตตามมาตรฐาน มอก.
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed font-medium">สินค้าคอนกรีตอัดแรงทุกชิ้นผ่านการควบคุมคุณภาพอย่างเข้มงวด ได้รับมาตรฐานผลิตภัณฑ์อุตสาหกรรม (มอก.)</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                  <div className="text-brand-400 font-bold text-xl mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                    ออกแบบโดยวิศวกร (สย.)
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed font-medium">ทุกโครงสร้างได้รับการคำนวณและออกแบบโดยวิศวกรโยธาผู้มีใบอนุญาตประกอบวิชาชีพ มั่นใจในความปลอดภัย 100%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 lg:top-32 bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-6 lg:p-8 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
              
              {highlights.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 relative z-10 flex items-center gap-3">
                    <div className="w-2 h-8 bg-brand-500 rounded-full"></div>
                    จุดเด่นของบริการ
                  </h3>
                  
                  <ul className="space-y-5 mb-12 relative z-10">
                    {highlights.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 group">
                        <CheckCircle2 size={24} className="text-[#06C755] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-700 font-medium text-lg group-hover:text-gray-900 transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="space-y-4 relative z-10 pt-6">
                {(prevProduct || nextProduct) && (
                  <div className={`flex flex-col gap-3 pb-8 mb-4 border-b border-gray-100 ${highlights.length > 0 ? 'pt-8 border-t mt-4' : ''}`}>
                    {prevProduct && (
                      <Link href={`/products/${prevProduct.slug}`} title={prevProduct.title} className="w-full flex items-center gap-3 text-brand-600 hover:text-brand-700 font-bold transition-all group/nav bg-brand-50 hover:bg-brand-100/70 p-3 rounded-xl border border-brand-100/50">
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover/nav:shadow shrink-0">
                          <ArrowLeft size={16} className="group-hover/nav:-translate-x-0.5 transition-transform" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] sm:text-xs text-brand-500/80 font-semibold mb-0.5 uppercase tracking-wider">สินค้าก่อนหน้า</span>
                          <span className="truncate w-full text-sm">{prevProduct.shortTitle || prevProduct.title}</span>
                        </div>
                      </Link>
                    )}
                    {nextProduct && (
                      <Link href={`/products/${nextProduct.slug}`} title={nextProduct.title} className="w-full flex items-center justify-end gap-3 text-brand-600 hover:text-brand-700 font-bold transition-all group/nav bg-brand-50 hover:bg-brand-100/70 p-3 rounded-xl border border-brand-100/50 text-right">
                        <div className="flex flex-col overflow-hidden items-end">
                          <span className="text-[10px] sm:text-xs text-brand-500/80 font-semibold mb-0.5 uppercase tracking-wider">สินค้าถัดไป</span>
                          <span className="truncate w-full text-sm">{nextProduct.shortTitle || nextProduct.title}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover/nav:shadow shrink-0">
                          <ArrowRight size={16} className="group-hover/nav:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    )}
                  </div>
                )}
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
