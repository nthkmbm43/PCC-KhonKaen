import { HelpCircle } from "lucide-react";
import { faqs as homeFAQ } from "@/data/faq";

export default function FAQBlock() {
  return (
    <section className="py-16 bg-white relative sm:py-20 lg:py-24" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:text-4xl md:text-5xl sm:mb-6">
            คำถามที่พบบ่อย (FAQ)
          </h2>
          <p className="text-base text-gray-600 sm:text-lg md:text-xl">
            ข้อสงสัยเบื้องต้นที่คุณอาจมีเกี่ยวกับการสั่งซื้อและบริการของเรา
          </p>
        </div>

        <div className="space-y-6">
          {homeFAQ.map((faq, index) => (
            <div key={index} className="bg-white border-2 border-gray-50 p-6 md:p-8 rounded-[2rem] hover:border-brand-500 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] transition-all duration-300 group cursor-default hover:-translate-y-1">
              <h3 className="flex items-start gap-4 text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-600 transition-colors">
                <div className="bg-brand-50 p-2.5 rounded-xl group-hover:bg-brand-100 transition-colors shrink-0">
                  <HelpCircle className="text-brand-500" size={24} />
                </div>
                <span className="mt-1.5">{faq.question}</span>
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed md:ml-[4.25rem]">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
