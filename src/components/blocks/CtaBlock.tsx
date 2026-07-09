import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CtaBlockProps {
  data: {
    headline?: string;
    description?: string;
    backgroundImage?: string;
    buttonText?: string;
    buttonUrl?: string;
    ctaText?: string;
    ctaHref?: string;
  };
}

export default function CtaBlock({ data }: CtaBlockProps) {
  const { headline, description, backgroundImage, buttonText, buttonUrl, ctaText, ctaHref } = data || {};
  const actualButtonText = ctaText || buttonText || "ติดต่อเรา";
  const actualButtonUrl = ctaHref || buttonUrl || "/contact";
  
  return (
    <div className="relative py-24 overflow-hidden" data-analytics={`cta-block-${headline ? headline.substring(0, 15) : 'default'}`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image src={backgroundImage} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-slate-900 z-0"></div>}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{headline || "ปรึกษาผู้เชี่ยวชาญของเรา"}</h2>
        {description && <p className="text-xl text-slate-300 mb-10">{description}</p>}
        <Link prefetch={false} href={actualButtonUrl} className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all">
          {actualButtonText}
        </Link>
      </div>
    </div>
  );
}
