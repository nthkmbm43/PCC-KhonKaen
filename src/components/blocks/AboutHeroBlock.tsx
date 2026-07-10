import React from 'react';
import Image from 'next/image';

interface AboutHeroBlockProps {
  headline?: string;
  description?: string;
  backgroundImage?: string;
}

export default function AboutHeroBlock({ headline, description, backgroundImage }: AboutHeroBlockProps) {
  const bgImage = backgroundImage || "/images/about-factory.jpg";
  const title = headline || "เกี่ยวกับ พีซีซี โพสเทนชั่น";
  const desc = description || "ผู้นำด้านผลิตภัณฑ์คอนกรีตอัดแรงและงานระบบโพสเทนชั่นแห่งภาคอีสาน มุ่งมั่นส่งมอบความแข็งแกร่ง ทนทาน และคุ้มค่าทุกโครงการ";

  return (
    <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 bg-[#0a174f] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a174f] via-brand-900 to-brand-800/80 opacity-95 z-0 transition-opacity duration-1000"></div>
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        {bgImage ? (
          <Image src={bgImage} alt="Background" fill quality={95} sizes="100vw" className="object-cover" />
        ) : null}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">{title}</h1>
        <p className="text-xl max-w-3xl mx-auto text-slate-200 drop-shadow-md">
          {desc}
        </p>
      </div>
    </section>
  );
}
