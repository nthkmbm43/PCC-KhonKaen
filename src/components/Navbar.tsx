"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, ChevronDown, Menu, X, ArrowRight, Zap, Sparkles } from "lucide-react";

type NavProduct = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description?: string | null;
  image: string | null;
  category?: string | null;
  isFeatured?: string | null;
  badge?: string | null;
};

interface NavbarLink {
  label: string;
  url: string;
}

interface NavbarProps {
  products: NavProduct[];
  navbarLinks?: NavbarLink[];
  contact: {
    logoUrl?: string;
    lineUrl: string;
    mainPhone: string;
  };
}

const HOT_BADGE = "มาแรง";
const NEW_BADGE = "ใหม่";
const PRODUCT_LINK_LABEL = "สินค้าและบริการ";

function uniqueProducts(items: NavProduct[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

export default function Navbar({ products, navbarLinks, contact }: NavbarProps) {
  const lineUrl = contact.lineUrl;
  const displayPhone = contact.mainPhone;
  const phoneNo = displayPhone.replace(/\D/g, "");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);

  const hotProducts = products.filter((product) => product.badge === HOT_BADGE);
  const newProducts = products.filter((product) => product.badge === NEW_BADGE);
  const normalProducts = products.filter(
    (product) => product.badge !== HOT_BADGE && product.badge !== NEW_BADGE
  );
  const featuredPool = products.filter((product) => product.isFeatured === "true");
  const preferredSlugs = ["precast-wall", "post-tension", "precast-slab", "retaining-wall"];
  const menuProducts = uniqueProducts([
    ...hotProducts.slice(0, 3),
    ...newProducts.slice(0, 3),
    ...normalProducts.slice(0, 3),
    ...featuredPool,
    ...products.filter((product) => preferredSlugs.some((slug) => product.slug.includes(slug))),
    ...products,
  ]).slice(0, 9);

  const renderBadge = (product: NavProduct, compact = false) => {
    if (product.badge === HOT_BADGE) {
      return (
        <span className={`font-bold rounded-full shadow-sm flex items-center gap-1 ${compact ? "text-[10px] bg-red-100 text-red-600 px-2 py-0.5" : "bg-red-500 text-white text-[10px] px-2 py-1"}`}>
          {!compact && <Zap size={10} />} {HOT_BADGE}
        </span>
      );
    }

    if (product.badge === NEW_BADGE) {
      return (
        <span className={`font-bold rounded-full shadow-sm flex items-center gap-1 ${compact ? "text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5" : "bg-blue-500 text-white text-[10px] px-2 py-1"}`}>
          {!compact && <Sparkles size={10} />} {NEW_BADGE}
        </span>
      );
    }

    return null;
  };

  const renderMegaMenu = (keyPrefix: string) => (
    <div className="fixed top-24 xl:top-28 left-1/2 -translate-x-1/2 w-[min(1120px,calc(100vw-2rem))] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-4 group-hover/nav:translate-y-0">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex -mt-2">
        <div className="w-[30%] min-w-[280px] bg-slate-50 border-r border-gray-100 p-6 flex flex-col gap-2">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">หมวดหมู่สินค้า</h4>
          {products.map((product) => (
            <Link key={`${keyPrefix}-cat-${product.slug}`} href={`/products/${product.slug}`} className="group/cat flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
              <span className="font-bold text-gray-700 group-hover/cat:text-brand-700 transition-colors line-clamp-1">{product.shortTitle}</span>
              {renderBadge(product, true)}
            </Link>
          ))}
          <div className="mt-auto pt-4">
            <Link href="/products" className="flex items-center gap-2 text-sm text-brand-600 font-bold hover:text-brand-700 transition-colors">
              ดูสินค้าทั้งหมด <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="w-[70%] p-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">สินค้าแนะนำ</h4>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-4">
            {menuProducts.map((product) => (
              <Link key={`${keyPrefix}-feat-${product.slug}`} href={`/products/${product.slug}`} className="group/feat relative h-24 xl:h-28 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-slate-100">
                <Image
                  src={product.image || "/images/placeholder.jpg"}
                  alt={product.title}
                  fill
                  quality={75}
                  sizes="(max-width: 1280px) 33vw, 240px"
                  className="object-cover group-hover/feat:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/25 to-transparent"></div>
                <div className="absolute top-2 left-2 z-20">{renderBadge(product)}</div>
                <h5 className="absolute bottom-3 left-3 right-3 text-white font-bold leading-tight text-sm xl:text-base line-clamp-2 translate-y-0 group-hover/feat:-translate-y-1 transition-transform duration-300">
                  {product.shortTitle}
                </h5>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesktopProductLink = (label: string, url: string, keyPrefix: string) => (
    <div className="relative group/nav h-full flex items-center">
      <Link href={url} className="relative flex items-center gap-1 hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 group-hover/nav:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
        {label} <ChevronDown size={16} className="group-hover/nav:rotate-180 transition-transform duration-300" />
      </Link>
      {renderMegaMenu(keyPrefix)}
    </div>
  );

  const renderMobileProductLinks = () => (
    <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
      {products.map((product) => (
        <Link
          key={product.slug}
          href={`/products/${product.slug}`}
          className="pl-8 pr-4 py-3 text-base text-gray-600 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent-500"></div>
          {product.shortTitle}
        </Link>
      ))}
      <Link
        href="/products"
        className="pl-8 pr-4 py-3 mt-1 text-base text-brand-700 font-bold hover:bg-brand-50 rounded-lg transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        ดูสินค้าทั้งหมด &rarr;
      </Link>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 h-16 md:h-20 lg:h-24 xl:h-28 flex items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center group py-2">
            {contact.logoUrl ? (
              <div className="relative w-[180px] md:w-[240px] lg:w-[320px] h-10 md:h-12 lg:h-16">
                <Image
                  src={contact.logoUrl}
                  alt="PCC Post-Tension Logo"
                  fill
                  className="object-contain object-left transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 180px, (max-width: 1024px) 240px, 320px"
                />
              </div>
            ) : (
              <span className="text-xl md:text-2xl font-bold text-brand-800 tracking-tight transition-transform group-hover:scale-105">
                PCC Post-Tension
              </span>
            )}
            <div className="hidden lg:flex items-center">
              <div className="h-10 w-px bg-slate-300 mx-3 xl:mx-5"></div>
              <span className="text-sm bg-brand-50 text-brand-700 px-4 py-2 rounded-full font-bold border border-brand-200 shadow-sm group-hover:bg-brand-100 group-hover:border-brand-300 transition-all whitespace-nowrap">สาขาขอนแก่น</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-14 font-bold text-slate-700 h-full text-[15px] xl:text-base tracking-wide">
            {navbarLinks && navbarLinks.length > 0 ? (
              navbarLinks.map((link, index) => {
                if (link.url === "/products" || link.label === PRODUCT_LINK_LABEL) {
                  return <div key={index}>{renderDesktopProductLink(link.label, link.url, `cms-${index}`)}</div>;
                }

                return (
                  <Link key={index} href={link.url} className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                    {link.label}
                  </Link>
                );
              })
            ) : (
              <>
                <Link href="/" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">หน้าแรก</Link>
                {renderDesktopProductLink(PRODUCT_LINK_LABEL, "/products", "fallback")}
                <Link href="/portfolio" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">ผลงานของเรา</Link>
                <Link href="/about" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">เกี่ยวกับเรา</Link>
                <Link href="/contact" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">ติดต่อเรา</Link>
              </>
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a href={`tel:${phoneNo}`} className="hidden xl:flex items-center gap-2 text-gray-600 hover:text-brand-600 font-medium transition-colors">
              <Phone size={20} />
              {displayPhone}
            </a>
            <a href={lineUrl} target="_blank" rel="noopener noreferrer" aria-label="ติดต่อผ่าน LINE" className="flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#06C755] px-3 py-2.5 font-medium text-white transition-all hover:-translate-y-1 hover:bg-[#05b34c] hover:shadow-[0_8px_20px_rgba(6,199,85,0.4)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#06C755]/30 sm:px-5 lg:px-6">
              <MessageCircle size={20} className="shrink-0" />
              <span className="hidden sm:inline">แอดไลน์สอบถาม</span>
              <span className="sm:hidden">แอดไลน์</span>
            </a>

            <button
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-200 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div className={`fixed top-16 right-0 bottom-0 z-50 w-[min(88vw,340px)] transform overflow-y-auto border-l border-gray-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:top-20 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col p-6 gap-2">
          {navbarLinks && navbarLinks.length > 0 ? (
            navbarLinks.map((link, index) => {
              if (link.url === "/products" || link.label === PRODUCT_LINK_LABEL) {
                return (
                  <div key={index} className="flex flex-col">
                    <button
                      className="flex items-center justify-between p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors w-full"
                      onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                    >
                      {link.label} <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileProductsOpen ? "rotate-180 text-brand-700" : ""}`} />
                    </button>
                    {renderMobileProductLinks()}
                  </div>
                );
              }

              return (
                <Link key={index} href={link.url} className="p-4 text-lg font-bold text-gray-800 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              );
            })
          ) : (
            <>
              <Link href="/" className="p-4 text-lg font-bold text-gray-800 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>หน้าแรก</Link>
              <div className="flex flex-col">
                <button
                  className="flex items-center justify-between p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors w-full"
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                >
                  {PRODUCT_LINK_LABEL} <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileProductsOpen ? "rotate-180 text-brand-700" : ""}`} />
                </button>
                {renderMobileProductLinks()}
              </div>
              <Link href="/portfolio" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ผลงานของเรา</Link>
              <Link href="/about" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>เกี่ยวกับเรา</Link>
              <Link href="/contact" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ติดต่อเรา</Link>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <a href={`tel:${phoneNo}`} className="flex items-center justify-center gap-3 w-full py-4 bg-slate-100 text-gray-800 font-bold rounded-xl mb-4">
              <Phone size={20} /> โทรศัพท์
            </a>
            <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-[#06C755] text-white font-bold rounded-xl shadow-lg shadow-[#06C755]/30">
              <MessageCircle size={20} /> แอดไลน์สอบถาม
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
