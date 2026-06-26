import Link from "next/link";
import { Phone, MessageCircle, ChevronDown } from "lucide-react";
import { products } from "@/data/products";
import { siteConfig } from "@/data/site-config";

export default function Navbar() {
  const lineUrl = "https://lin.ee/5O8rHvD";
  const phoneNo = siteConfig.phoneRaw;
  const displayPhone = siteConfig.phone;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 h-16 md:h-20 lg:h-24 xl:h-28 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center group py-2">
          {/* ใช้ความกว้าง (width) ในการกำหนดขนาด 3 ระดับ (Mobile, Tablet, PC) เพื่อแก้ปัญหาโลโก้เล็กจาก padding ของรูปภาพ */}
          <img 
            src="/images/logo-full-dark.png" 
            alt="PCC Post-Tension Logo" 
            className="w-[180px] md:w-[240px] lg:w-[320px] h-auto object-contain transition-transform group-hover:scale-105" 
          />
          <div className="hidden lg:flex items-center">
            <div className="h-10 w-px bg-slate-300 mx-3 xl:mx-5"></div>
            <span className="text-sm bg-brand-50 text-brand-700 px-4 py-2 rounded-full font-bold border border-brand-200 shadow-sm group-hover:bg-brand-100 group-hover:border-brand-300 transition-all whitespace-nowrap">สาขาขอนแก่น</span>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-14 font-bold text-slate-700 h-full text-[15px] xl:text-base tracking-wide">
          <Link href="/" className="relative hover:text-brand-600 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-brand-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">หน้าแรก</Link>
          
          <div className="relative group/nav h-full flex items-center">
            <Link href="/products" className="relative flex items-center gap-1 hover:text-brand-600 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-brand-600 after:scale-x-0 group-hover/nav:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
              สินค้าและบริการ <ChevronDown size={16} className="group-hover/nav:rotate-180 transition-transform duration-300" />
            </Link>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[min(650px,calc(100vw-2rem))] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform translate-y-4 group-hover/nav:translate-y-0">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 -mt-2">
                <div className="grid grid-cols-2 gap-3">
                  {products.map(product => (
                    <Link key={product.slug} href={`/products/${product.slug}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-md transition-all group/item border border-transparent hover:border-brand-100">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover/item:text-brand-600 transition-colors leading-tight">{product.shortTitle}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1.5">{product.description}</p>
                      </div>
                    </Link>
                  ))}
                  <Link href="/products" className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-brand-50/50 hover:bg-brand-50 text-brand-600 font-bold transition-all border border-dashed border-brand-200 hover:border-brand-400">
                    ดูสินค้าทั้งหมด
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/about" className="relative hover:text-brand-600 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-brand-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">เกี่ยวกับเรา</Link>
          <Link href="/contact" className="relative hover:text-brand-600 transition-colors py-8 after:absolute after:bottom-[30%] after:left-0 after:w-full after:h-[2px] after:bg-brand-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">ติดต่อเรา</Link>
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
        </div>
      </div>
    </header>
  );
}

