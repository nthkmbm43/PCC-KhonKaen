import { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Trophy, Users } from "lucide-react";
import CTABannerBlock from "@/components/blocks/CTABannerBlock";

export const metadata: Metadata = createSeoMetadata({
  title: "เกี่ยวกับเรา | PCC Post-Tension",
  description:
    "รู้จักกับ PCC Post-Tension บริษัทรับเหมาก่อสร้างและผลิตแผ่นพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป ด้วยมาตรฐานวิศวกรรมระดับสากล ประสบการณ์กว่า 10 ปี",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-brand-500 blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
            เกี่ยวกับองค์กร
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            ผู้นำด้านโครงสร้างคอนกรีตอัดแรง
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            บริษัท พีซีซี โพสเทนชั่น จำกัด ก่อตั้งขึ้นด้วยความมุ่งมั่นที่จะยกระดับมาตรฐานวงการก่อสร้างไทย
            ผ่านนวัตกรรมคอนกรีตอัดแรงที่แข็งแรง ปลอดภัย และตอบโจทย์ทุกโครงสร้าง
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-slate-200">
                {/* Fallback pattern if no image */}
                <div className="w-full h-full opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
              <Image
                src="/images/placeholder-factory.jpg"
                alt="โรงงานผลิตแผ่นพื้น PCC Post-Tension"
                fill
                sizes="(max-w-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">วิสัยทัศน์ของเรา</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                เรามุ่งมั่นที่จะเป็นพันธมิตรที่ไว้วางใจได้ที่สุดในทุกโครงการก่อสร้าง
                ด้วยการส่งมอบผลิตภัณฑ์และบริการที่ได้มาตรฐานวิศวกรรมสูงสุด
                พร้อมทีมงานมืออาชีพที่พร้อมดูแลตั้งแต่ขั้นตอนการออกแบบจนถึงการติดตั้ง
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "มาตรฐานวิศวกรรม", desc: "ควบคุมคุณภาพทุกขั้นตอนโดยวิศวกรผู้เชี่ยวชาญ" },
                  { icon: Users, title: "ทีมงานมืออาชีพ", desc: "ประสบการณ์เฉพาะด้านมากกว่า 10 ปี" },
                  { icon: Trophy, title: "ความพึงพอใจสูงสุด", desc: "ส่งมอบงานตรงเวลา ได้คุณภาพตามข้อตกลง" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="bg-brand-50 p-3 rounded-2xl text-brand-600 shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABannerBlock />
    </div>
  );
}
