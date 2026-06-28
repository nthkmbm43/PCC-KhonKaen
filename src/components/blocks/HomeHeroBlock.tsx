import { Phone, MessageCircle, CheckCircle2, Factory, Truck, Sparkles } from "lucide-react";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function HomeHeroBlock() {
  const settings = await getSiteSettings();
  const lineUrl = settings.contact.lineUrl;
  const phoneNo = settings.contact.mainPhone.replace(/\D/g, "");

  return (
    <section className="relative overflow-hidden bg-gray-900 pt-14 pb-20 group sm:pt-20 sm:pb-28 lg:pt-32 lg:pb-40">
      <div className="absolute inset-0 z-0 transition-transform duration-[20s] group-hover:scale-110">
        <img src="https://pcc-posttension.com/wp-content/uploads/2025/02/pcc-โรงงาน-copy.jpg" alt="PCC Post-Tension Factory" className="w-full h-full object-cover opacity-60" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-brand-900/90 z-0 mix-blend-multiply"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
        <div className="inline-flex max-w-full items-center gap-2 bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-6 backdrop-blur-md sm:px-6 sm:py-2.5 sm:text-sm sm:mb-8 hover:bg-white/20 transition-colors">
          <Sparkles size={16} className="animate-pulse text-brand-400" /> รับประกันคุณภาพโดยทีมวิศวกรมืออาชีพ
        </div>
        <h1 className="text-3xl font-bold text-white mb-5 leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-7xl lg:mb-6">
          รับเหมา <span className="text-brand-400">งานโพสเทนชั่น</span> <br className="hidden md:block" />
          และผลิตภัณฑ์คอนกรีต
        </h1>
        <p className="mt-5 text-base text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed sm:text-lg md:text-xl lg:mb-12">
          บริการออกแบบ ผลิต และติดตั้งงานพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป มั่นคง ปลอดภัย ด้วยมาตรฐานวิศวกรรมระดับสากล
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <a href={`tel:${phoneNo}`} className="relative overflow-hidden bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all animate-pulse-glow sm:px-8 sm:text-lg group">
            <Phone size={24} className="group-hover:rotate-12 transition-transform" />
            ขอใบเสนอราคาฟรี
          </a>
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-50 text-[#06C755] border-2 border-[#06C755] px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,199,85,0.2)] sm:px-8 sm:text-lg">
            <MessageCircle size={24} />
            ติดต่อสอบถามทาง LINE
          </a>
        </div>
        
        <div className="mt-14 grid grid-cols-1 gap-4 max-w-5xl mx-auto text-left sm:mt-20 md:grid-cols-3 md:gap-6 lg:mt-24">
           <div className="bg-white p-6 rounded-3xl flex items-start gap-5 transition-all duration-300 hover:-translate-y-3 shadow-md hover:shadow-xl border border-gray-100 hover:border-brand-200 group/feature">
             <div className="bg-brand-50 p-4 rounded-2xl text-brand-500 shrink-0 group-hover/feature:bg-brand-500 group-hover/feature:text-white transition-colors duration-300">
               <CheckCircle2 size={28} />
             </div>
             <div>
               <h3 className="text-gray-900 font-bold text-xl mb-1 group-hover/feature:text-brand-600 transition-colors">งานเสร็จตรงเวลา</h3>
               <p className="text-gray-600 text-sm mt-2 leading-relaxed">รับประกันคุณภาพและระยะเวลาส่งมอบงาน ตามสัญญาทุกประการ</p>
             </div>
           </div>
           <div className="bg-white p-6 rounded-3xl flex items-start gap-5 transition-all duration-300 hover:-translate-y-3 shadow-md hover:shadow-xl border border-gray-100 hover:border-brand-200 group/feature">
             <div className="bg-brand-50 p-4 rounded-2xl text-brand-500 shrink-0 group-hover/feature:bg-brand-500 group-hover/feature:text-white transition-colors duration-300">
               <Factory size={28} />
             </div>
             <div>
               <h3 className="text-gray-900 font-bold text-xl mb-1 group-hover/feature:text-brand-600 transition-colors">โรงงานมาตรฐาน</h3>
               <p className="text-gray-600 text-sm mt-2 leading-relaxed">ผลิตด้วยเครื่องจักรทันสมัย ควบคุมโดยวิศวกรผู้มีใบประกอบวิชาชีพ</p>
             </div>
           </div>
           <div className="bg-white p-6 rounded-3xl flex items-start gap-5 transition-all duration-300 hover:-translate-y-3 shadow-md hover:shadow-xl border border-gray-100 hover:border-brand-200 group/feature">
             <div className="bg-brand-50 p-4 rounded-2xl text-brand-500 shrink-0 group-hover/feature:bg-brand-500 group-hover/feature:text-white transition-colors duration-300">
               <Truck size={28} />
             </div>
             <div>
               <h3 className="text-gray-900 font-bold text-xl mb-1 group-hover/feature:text-brand-600 transition-colors">บริการรวดเร็ว</h3>
               <p className="text-gray-600 text-sm mt-2 leading-relaxed">มีรถขนส่งและเครื่องจักรพร้อมให้บริการทั่วภาคอีสานและเชียงใหม่</p>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
