import { Phone, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function CTABannerBlock() {
  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  const phoneNo = settings.contact.mainPhone.replace(/\D/g, "");

  return (
    <section className="py-24 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">พร้อมเริ่มต้นโครงการของคุณหรือยัง?</h2>
        <p className="text-xl text-brand-50 mb-12 drop-shadow-sm">ให้ทีมวิศวกรของเราช่วยประเมินราคาและให้คำปรึกษาฟรี ไม่มีค่าใช้จ่ายแอบแฝง</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <a aria-label={`โทรขอใบเสนอราคาฟรีที่เบอร์ ${phoneNo}`} href={`tel:${phoneNo}`} className="inline-flex bg-white text-brand-600 hover:bg-gray-50 px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-4 transition-all animate-pulse-glow hover:-translate-y-2 hover:scale-105 group">
            <Phone size={28} className="group-hover:rotate-12 transition-transform" />
            ขอใบเสนอราคาฟรี
          </a>
          <a aria-label="ส่งแบบแปลนมาประเมินราคากับทีมวิศวกรทาง LINE" href={lineUrl} target="_blank" rel="noopener noreferrer" className="inline-flex bg-[#06C755] hover:bg-[#05b34c] text-white px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-4 transition-all hover:shadow-[0_15px_40px_rgba(6,199,85,0.4)] hover:-translate-y-2 hover:scale-105 group">
            <MessageCircle size={28} className="group-hover:animate-bounce" />
            ส่งแบบแปลนมาประเมินทาง LINE
          </a>
        </div>
      </div>
    </section>
  );
}
