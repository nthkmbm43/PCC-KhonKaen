import Link from "next/link";
import { CheckCircle2, Award, Clock, Users, Building2, MessageCircle, Phone } from "lucide-react";
import { Metadata } from "next";
import { siteConfig } from "@/data/site-config";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "เกี่ยวกับ พีซีซี โพสเทนชั่น | โรงงานคอนกรีตและทีมวิศวกร ขอนแก่น",
  description:
    "รู้จักบริษัท พีซีซี โพสเทนชั่น จำกัด ผู้เชี่ยวชาญงานพื้นโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป และผลิตภัณฑ์คอนกรีตสำเร็จรูป ขอนแก่น",
  path: "/about",
  image: "/images/about-factory.jpg",
});

export default function AboutPage() {
  const lineUrl = siteConfig.social.line.url;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 bg-[#0a174f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a174f] via-brand-900 to-brand-800/80 opacity-95 z-0 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img src="/images/about-factory.jpg" alt="PCC Factory" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">เกี่ยวกับ พีซีซี โพสเทนชั่น</h1>
          <p className="text-xl max-w-3xl mx-auto text-slate-200 drop-shadow-md">
            ผู้นำด้านผลิตภัณฑ์คอนกรีตอัดแรงและงานระบบโพสเทนชั่นแห่งภาคอีสาน 
            มุ่งมั่นส่งมอบความแข็งแกร่ง ทนทาน และคุ้มค่าทุกโครงการ
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">บริษัท พีซีซี โพสเทนชั่น จำกัด</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                เราเริ่มต้นธุรกิจจากความตั้งใจที่จะยกระดับมาตรฐานงานก่อสร้างในภาคตะวันออกเฉียงเหนือ 
                ด้วยวิศวกรผู้เชี่ยวชาญเฉพาะทางในระบบโพสเทนชั่น (Post-tension) และผลิตภัณฑ์คอนกรีตสำเร็จรูป
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                ปัจจุบันเรามีโรงงานผลิตที่ได้มาตรฐาน พร้อมด้วยเครื่องจักรทันสมัย และกระบวนการควบคุมคุณภาพอย่างเข้มงวด 
                เพื่อให้ลูกค้ามั่นใจในทุกชิ้นงาน ไม่ว่าจะเป็น แผ่นพื้นสำเร็จรูป กำแพงกันดิน รั้ว หรือเสาลวดหนาม
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-brand-50 p-6 rounded-2xl">
                  <Clock className="text-brand-500 mb-3" size={32} />
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">10+</h4>
                  <p className="text-gray-600 font-medium">ปีแห่งประสบการณ์</p>
                </div>
                <div className="bg-brand-50 p-6 rounded-2xl">
                  <Building2 className="text-brand-500 mb-3" size={32} />
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">100+</h4>
                  <p className="text-gray-600 font-medium">โครงการที่ไว้วางใจ</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute inset-0 bg-brand-500 rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10"></div>
              <img src="/images/about-factory-interior.png" alt="โรงงานผลิต" className="w-full rounded-[2.5rem] shadow-xl object-cover aspect-[4/3]" />
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">จุดเด่นและมาตรฐานของเรา</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">เราใส่ใจในทุกรายละเอียดเพื่อผลงานที่ดีที่สุดสำหรับลูกค้า</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ควบคุมโดยวิศวกร</h3>
              <p className="text-gray-600 leading-relaxed">
                ดูแลการผลิตและติดตั้งทุกขั้นตอนโดยทีมวิศวกรที่มีใบอนุญาต เพื่อให้มั่นใจในความถูกต้องตามหลักวิศวกรรม
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">วัสดุคุณภาพสูง</h3>
              <p className="text-gray-600 leading-relaxed">
                คัดสรรวัตถุดิบชั้นเยี่ยม ปูนซีเมนต์คุณภาพ ลวดอัดแรงที่ได้มาตรฐานอุตสาหกรรม
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">บริการดุจญาติมิตร</h3>
              <p className="text-gray-600 leading-relaxed">
                ให้คำปรึกษาด้วยความจริงใจ ประเมินราคาโปร่งใส และบริการหลังการขายที่รวดเร็ว
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#0a174f] to-[#1e3ca6] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8 relative z-10">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              ให้ทีมวิศวกรช่วยดูแบบหรือหน้างานของคุณ
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              ส่งรูปหน้างานหรือแบบแปลนเบื้องต้นมาให้ทีมฝ่ายขายประเมินความเหมาะสมของสินค้าและงบประมาณได้ทันที
            </p>
          </div>
          <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-[#06C755]/10 border border-[#06C755]/50 hover:bg-[#06C755]/20 text-[#06C755] backdrop-blur-md px-7 py-4 font-bold rounded-xl transition-all hover:shadow-[0_10px_30px_rgba(6,199,85,0.2)] hover:-translate-y-1 items-center justify-center gap-3"
            >
              <MessageCircle size={22} />
              ส่งข้อมูลทาง LINE
            </a>
            <Link
              href="/contact"
              className="inline-flex bg-accent-500 hover:bg-accent-600 text-white px-7 py-4 font-bold rounded-xl items-center justify-center gap-3 transition-all animate-pulse-glow hover:-translate-y-1"
            >
              <Phone size={22} />
              ดูช่องทางติดต่อทั้งหมด
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
