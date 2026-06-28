"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, ChevronDown, Menu, X } from "lucide-react";
import { Product } from "@/data/products";

interface NavbarProps {
  products: Product[];
  contact: {
    logoUrl?: string;
    lineUrl: string;
    mainPhone: string;
  };
}

export default function Navbar({ products, contact }: NavbarProps) {
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
        <Link href="/" className="flex shrink-0 items-center group py-2">
          {/* ใช้ความกว้าง (width) ในการกำหนดขนาด 3 ระดับ (Mobile, Tablet, PC) เพื่อแก้ปัญหาโลโก้เล็กจาก padding ของรูปภาพ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={contact.logoUrl || "/images/logo-full-dark.png"} 
            alt="PCC Post-Tension Logo" 
            className="w-[180px] md:w-[240px] lg:w-[320px] max-h-16 h-auto object-contain transition-transform group-hover:scale-105" 
          />
          {!contact.logoUrl && (
            <div className="hidden lg:flex items-center">
              <div className="h-10 w-px bg-slate-300 mx-3 xl:mx-5"></div>
              <span className="text-sm bg-brand-50 text-brand-700 px-4 py-2 rounded-full font-bold border border-brand-200 shadow-sm group-hover:bg-brand-100 group-hover:border-brand-300 transition-all whitespace-nowrap">สาขาขอนแก่น</span>
            </div>
          )}
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-14 font-bold text-slate-700 h-full text-[15px] xl:text-base tracking-wide">
          <Link href="/" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">หน้าแรก</Link>
          
          <div className="relative group/nav h-full flex items-center">
            <Link href="/products" className="relative flex items-center gap-1 hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 group-hover/nav:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
              สินค้าและบริการ <ChevronDown size={16} className="group-hover/nav:rotate-180 transition-transform duration-300" />
            </Link>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[min(650px,calc(100vw-2rem))] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-4 group-hover/nav:translate-y-0">
              <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl p-6 -mt-2">
                <div className="grid grid-cols-2 gap-3">
                  {products.map(product => (
                    <Link key={product.slug} href={`/products/${product.slug}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 hover:shadow-md transition-all group/item border border-transparent hover:border-brand-100">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover/item:text-brand-700 transition-colors leading-tight">{product.shortTitle}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1.5">{product.description}</p>
                      </div>
                    </Link>
                  ))}
                  <Link href="/products" className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold transition-all border border-dashed border-brand-200 hover:border-brand-400">
                    ดูสินค้าทั้งหมด
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/about" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">เกี่ยวกับเรา</Link>
          <Link href="/contact" className="relative hover:text-brand-700 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-accent-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">ติดต่อเรา</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <a href={`tel:${phoneNo}`} className="hidden xl:flex items-center gap-2 text-gray-600 hover:text-brand-600 font-medium transition-colors">
            <Phone size={20} />
            {displayPhone}
          </a>
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="bg-[#06C755] hover:bg-[#05b34c] text-white px-3 py-2.5 rounded-full font-medium flex items-center gap-2 whitespace-nowrap transition-all sm:px-5 lg:px-6 hover:shadow-lg hover:shadow-[#06C755]/30 hover:-translate-y-0.5">
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
        <Link href="/" className="p-4 text-lg font-bold text-gray-800 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>หน้าแรก</Link>
        
        <div className="flex flex-col">
          <button 
            className="flex items-center justify-between p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors w-full"
            onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
          >
            สินค้าและบริการ <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180 text-brand-700' : ''}`} />
          </button>
          <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            {products.map(product => (
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
        </div>

        <Link href="/portfolio" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ผลงานของเรา</Link>
        <Link href="/about" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>เกี่ยวกับเรา</Link>
        <Link href="/contact" className="p-4 text-lg font-bold text-gray-800 hover:bg-slate-50 hover:text-brand-700 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ติดต่อเรา</Link>
        
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

