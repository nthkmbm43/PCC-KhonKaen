import { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import CTABannerBlock from "@/components/blocks/CTABannerBlock";

export const metadata: Metadata = createSeoMetadata({
  title: "ติดต่อเรา | PCC Post-Tension",
  description:
    "ติดต่อบริษัท พีซีซี โพสเทนชั่น จำกัด สอบถามข้อมูล ขอใบเสนอราคา โครงสร้างคอนกรีตอัดแรง แผ่นพื้น กำแพงกันดิน รั้วสำเร็จรูป พร้อมให้บริการให้คำปรึกษาฟรี",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-4">
            ติดต่อสอบถาม
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            พร้อมให้คำปรึกษาฟรี
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            มีข้อสงสัยหรือต้องการประเมินราคางานโครงสร้าง? 
            ทีมวิศวกรของเราพร้อมให้คำปรึกษาและลงพื้นที่ประเมินหน้างาน
          </p>
        </div>
      </section>

      {/* Contact Info & Map */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">ข้อมูลการติดต่อ</h2>
              
              <div className="space-y-8 mb-10">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-50 p-4 rounded-full text-brand-600 shrink-0 mt-1">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">สำนักงานใหญ่</h3>
                    <p className="text-slate-600 leading-relaxed">
                      บริษัท พีซีซี โพสเทนชั่น จำกัด<br />
                      123 ถนนมิตรภาพ ตำบลในเมือง<br />
                      อำเภอเมือง จังหวัดขอนแก่น 40000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-50 p-4 rounded-full text-brand-600 shrink-0 mt-1">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">โทรศัพท์</h3>
                    <p className="text-slate-600 leading-relaxed text-lg font-medium">
                      043-123-456<br />
                      089-123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-50 p-4 rounded-full text-brand-600 shrink-0 mt-1">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">เวลาทำการ</h3>
                    <p className="text-slate-600 leading-relaxed">
                      จันทร์ - เสาร์: 08:00 - 17:00 น.<br />
                      หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct LINE Action */}
              <a 
                href="https://line.me/ti/p/~@pccposttension" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#00B900] hover:bg-[#00a000] text-white py-4 px-8 rounded-full text-lg font-bold transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-[#00B900]/30"
              >
                <MessageCircle size={24} />
                แอดไลน์สอบถามราคา (ตอบไว)
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col h-full min-h-[500px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3827.240509657062!2d102.8277343!3d16.412586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31222a768e745db3%3A0x6b107e3a9c7b9417!2sKhon%20Kaen!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth" 
                width="100%" 
                height="100%" 
                style={{ border: 0, flexGrow: 1 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="PCC Post-Tension Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABannerBlock />
    </div>
  );
}
