"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, ChevronDown, Menu, X, ArrowRight } from "lucide-react";

type NavProduct = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string | null;
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

export default function Navbar({ products, navbarLinks, contact }: NavbarProps) {
  const lineUrl = contact.lineUrl;
  const displayPhone = contact.mainPhone;
  // Remove non-digits for tel link
  const phoneNo = displayPhone.replace(/\D/g, "");
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 h-16 md:h-20 lg:h-24 xl:h-28 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link prefetch={false} href="/" className="flex shrink-0 items-center group py-2">
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
        
        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-14 font-bold text-slate-700 h-full text-[15px] xl:text-base tracking-wide">
          {navbarLinks && navbarLinks.length > 0 ? (
            navbarLinks.map((link: NavbarLink, index: number) => {
              if (link.url === "/products" || link.label === "สินค้าและบริการ") {
                return (
                  <div key={index} className="relative group/nav h-full flex items-center">
                    <Link prefetch={false} href={link.url} className="relative flex items-center gap-1 hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 group-hover/nav:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                      {link.label} <ChevronDown size={16} className="group-hover/nav:rotate-180 transition-transform duration-300" />
                    </Link>
                    
                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[min(900px,calc(100vw-2rem))] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-4 group-hover/nav:translate-y-0">
                      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex -mt-2">
                        {/* Left Sidebar: Categories */}
                        <div className="w-1/3 bg-slate-50 border-r border-gray-100 p-6 flex flex-col gap-2">
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">หมวดหมู่สินค้า</h4>
                          {products.map(product => {
                            const isHot = product.badge === 'มาแรง';
                            const isNew = product.badge === 'ใหม่';
                            return (
                              <Link prefetch={false} key={`cat-${product.slug}`} href={`/products/${product.slug}`} className="group/cat flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                                <span className="font-bold text-gray-700 group-hover/cat:text-brand-700 transition-colors">{product.shortTitle}</span>
                                {isHot && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">มาแรง</span>}
                                {isNew && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">ใหม่</span>}
                              </Link>
                            );
                          })}
                          <div className="mt-auto pt-4">
                            <Link prefetch={false} href="/products" className="flex items-center gap-2 text-sm text-brand-600 font-bold hover:text-brand-700 transition-colors">
                              ดูสินค้าทั้งหมด <ArrowRight size={16} />
                            </Link>
                          </div>
                        </div>
                        {/* Right Area: Featured Products */}
                        <div className="w-2/3 p-6">
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">สินค้าแนะนำ</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {products.filter(p => p.isFeatured === 'true' || ['retaining-wall', 'precast-fence', 'precast-slab', 'post-tension'].includes(p.slug)).slice(0, 4).map(product => (
                              <Link prefetch={false} key={`feat-${product.slug}`} href={`/products/${product.slug}`} className="group/feat relative h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <Image src={product.image || '/images/placeholder.jpg'} alt={product.title} fill className="object-cover group-hover/feat:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                                <h5 className="absolute bottom-3 left-3 right-3 text-white font-bold leading-tight translate-y-0 group-hover/feat:-translate-y-1 transition-transform duration-300">{product.shortTitle}</h5>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link prefetch={false} key={index} href={link.url} className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                  {link.label}
                </Link>
              );
            })
          ) : (
            <>
              <Link prefetch={false} href="/" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">หน้าแรก</Link>
              
              <div className="relative group/nav h-full flex items-center">
                <Link prefetch={false} href="/products" className="relative flex items-center gap-1 hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 group-hover/nav:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                  สินค้าและบริการ <ChevronDown size={16} className="group-hover/nav:rotate-180 transition-transform duration-300" />
                </Link>
                
                {/* Mega Menu Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[min(900px,calc(100vw-2rem))] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-4 group-hover/nav:translate-y-0">
                  <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex -mt-2">
                    {/* Left Sidebar: Categories */}
                    <div className="w-1/3 bg-slate-50 border-r border-gray-100 p-6 flex flex-col gap-2">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">หมวดหมู่สินค้า</h4>
                      {products.map(product => {
                        const isHot = product.slug === 'precast-slab' || product.slug === 'post-tension';
                        const isNew = product.slug === 'retaining-wall';
                        return (
                          <Link prefetch={false} key={`cat2-${product.slug}`} href={`/products/${product.slug}`} className="group/cat flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                            <span className="font-bold text-gray-700 group-hover/cat:text-brand-700 transition-colors">{product.shortTitle}</span>
                            {isHot && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">มาแรง</span>}
                            {isNew && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">ใหม่</span>}
                          </Link>
                        );
                      })}
                      <div className="mt-auto pt-4">
                        <Link prefetch={false} href="/products" className="flex items-center gap-2 text-sm text-brand-600 font-bold hover:text-brand-700 transition-colors">
                          ดูสินค้าทั้งหมด <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                    {/* Right Area: Featured Products */}
                    <div className="w-2/3 p-6">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">สินค้าแนะนำ</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {products.filter(p => p.isFeatured === 'true' || ['retaining-wall', 'precast-fence', 'precast-slab', 'post-tension'].includes(p.slug)).slice(0, 4).map(product => (
                          <Link prefetch={false} key={`feat2-${product.slug}`} href={`/products/${product.slug}`} className="group/feat relative h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <Image src={product.image || '/images/placeholder.jpg'} alt={product.title} fill className="object-cover group-hover/feat:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                            <h5 className="absolute bottom-3 left-3 right-3 text-white font-bold leading-tight translate-y-0 group-hover/feat:-translate-y-1 transition-transform duration-300">{product.shortTitle}</h5>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link prefetch={false} href="/about" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">เกี่ยวกับเรา</Link>
              <Link prefetch={false} href="/contact" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">ติดต่อเรา</Link>
            </>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <a href={`tel:${phoneNo}`} className="hidden xl:flex items-center gap-2 text-gray-600 hover:text-brand-600 font-medium transition-colors">
            <Phone size={20} />
            {displayPhone}
          </a>
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="bg-[#06C755] hover:bg-[#05b34c] text-white px-3 py-2.5 rounded-full font-medium flex items-center gap-2 whitespace-nowrap transition-all sm:px-5 lg:px-6 hover:shadow-[0_8px_20px_rgba(6,199,85,0.4)] hover:-translate-y-1">
            <MessageCircle size={20} className="shrink-0" />
            <span className="hidden sm:inline">แอดไลน์สอบถาม</span>
            <span className="sm:hidden">แอดไลน์</span>
          </a>
          
          {/* Hamburger Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    <div 
      className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={() => setIsMobileMenuOpen(false)}
    ></div>

    {/* Mobile Menu Drawer */}
    <div className={`fixed top-16 sm:top-20 right-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl border-l border-gray-100 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col p-6 gap-2">
        {navbarLinks && navbarLinks.length > 0 ? (
            navbarLinks.map((link: NavbarLink, index: number) => {
              if (link.url === "/products" || link.label === "สินค้าและบริการ") {
                return (
                  <div key={index} className="flex flex-col">
                    <button 
                      className="flex items-center justify-between p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors w-full"
                      onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                    >
                      {link.label} <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180 text-brand-700' : ''}`} />
                    </button>
                    <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      {products.map(product => (
                        <Link prefetch={false} 
                          key={product.slug} 
                          href={`/products/${product.slug}`} 
                          className="pl-8 pr-4 py-3 text-base text-gray-600 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-500"></div>
                          {product.shortTitle}
                        </Link>
                      ))}
                      <Link prefetch={false} 
                        href="/products" 
                        className="pl-8 pr-4 py-3 mt-1 text-base text-brand-700 font-bold hover:bg-brand-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ดูสินค้าทั้งหมด &rarr;
                      </Link>
                    </div>
                  </div>
                );
              }
              return (
                <Link prefetch={false} key={index} href={link.url} className="p-4 text-lg font-bold text-gray-800 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{link.label}</Link>
              );
            })
        ) : (
          <>
            <Link prefetch={false} href="/" className="p-4 text-lg font-bold text-gray-800 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>หน้าแรก</Link>
            
            <div className="flex flex-col">
              <button 
                className="flex items-center justify-between p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors w-full"
                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
              >
                สินค้าและบริการ <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180 text-brand-700' : ''}`} />
              </button>
              <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                {products.map(product => (
                  <Link prefetch={false} 
                    key={product.slug} 
                    href={`/products/${product.slug}`} 
                    className="pl-8 pr-4 py-3 text-base text-gray-600 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500"></div>
                    {product.shortTitle}
                  </Link>
                ))}
                <Link prefetch={false} 
                  href="/products" 
                  className="pl-8 pr-4 py-3 mt-1 text-base text-brand-700 font-bold hover:bg-brand-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ดูสินค้าทั้งหมด &rarr;
                </Link>
              </div>
            </div>

            <Link prefetch={false} href="/portfolio" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ผลงานของเรา</Link>
            <Link prefetch={false} href="/about" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>เกี่ยวกับเรา</Link>
            <Link prefetch={false} href="/contact" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ติดต่อเรา</Link>
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

