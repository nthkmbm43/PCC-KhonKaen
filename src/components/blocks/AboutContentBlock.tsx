import React from 'react';
import { Clock, Building2 } from 'lucide-react';
import Image from 'next/image';

interface AboutContentBlockProps {
  headline?: string;
  description?: string; // Rich text content if we want, but keeping it simple as a string or rich text HTML
  image?: string;
}

export default function AboutContentBlock({ headline, description, image }: AboutContentBlockProps) {
  const title = headline || "บริษัท พีซีซี โพสเทนชั่น จำกัด";
  const bgImage = image || "/images/about-factory-interior.png";
  
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h2>
            {description ? (
              <div 
                className="prose prose-lg text-gray-600 mb-8"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  เราเริ่มต้นธุรกิจจากความตั้งใจที่จะยกระดับมาตรฐานงานก่อสร้างในภาคตะวันออกเฉียงเหนือ 
                  ด้วยวิศวกรผู้เชี่ยวชาญเฉพาะทางในระบบโพสเทนชั่น (Post-tension) และผลิตภัณฑ์คอนกรีตสำเร็จรูป
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  ปัจจุบันเรามีโรงงานผลิตที่ได้มาตรฐาน พร้อมด้วยเครื่องจักรทันสมัย และกระบวนการควบคุมคุณภาพอย่างเข้มงวด 
                  เพื่อให้ลูกค้ามั่นใจในทุกชิ้นงาน ไม่ว่าจะเป็น แผ่นพื้นสำเร็จรูป กำแพงกันดิน รั้ว หรือเสาลวดหนาม
                </p>
              </>
            )}
            
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
            {bgImage ? (
              <div className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-xl">
                <Image src={bgImage} alt="About Us" fill quality={75} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
