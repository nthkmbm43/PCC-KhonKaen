import React from 'react';
import { CheckCircle2, Award, Users } from 'lucide-react';

interface AboutFeatureGridBlockProps {
  headline?: string;
  description?: string;
}

export default function AboutFeatureGridBlock({ headline, description }: AboutFeatureGridBlockProps) {
  const title = headline || "จุดเด่นและมาตรฐานของเรา";
  const desc = description || "เราใส่ใจในทุกรายละเอียดเพื่อผลงานที่ดีที่สุดสำหรับลูกค้า";

  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{desc}</p>
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
  );
}
