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
    layout?: string;
    overlayOpacity?: number;
    textColor?: string;
  };
}

export default function CtaBlock({ data }: CtaBlockProps) {
  const { headline, description, backgroundImage, buttonText, buttonUrl, ctaText, ctaHref, layout, overlayOpacity } = data || {};
  const actualButtonText = ctaText || buttonText || "ติดต่อเรา";
  const actualButtonUrl = ctaHref || buttonUrl || "/contact";
  const alignmentClass = layout === 'left' ? 'text-left items-start' : layout === 'right' ? 'text-right items-end' : 'text-center items-center';
  const flexAlignmentClass = layout === 'left' ? 'justify-start' : layout === 'right' ? 'justify-end' : 'justify-center';
  const bgOpacity = overlayOpacity !== undefined ? overlayOpacity / 100 : 0.8;
  
  return (
    <div className={`relative py-24 overflow-hidden flex flex-col ${alignmentClass}`} data-analytics={`cta-block-${headline ? headline.substring(0, 15) : 'default'}`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image src={backgroundImage} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-slate-900" style={{ opacity: bgOpacity }}></div>
        </div>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-slate-900 z-0"></div>}
      <div className={`relative z-10 max-w-4xl mx-auto px-4 ${alignmentClass} w-full flex flex-col`}>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{headline || "ปรึกษาผู้เชี่ยวชาญของเรา"}</h2>
        {description && <p className="text-xl text-slate-300 mb-10">{description}</p>}
        <div className={`flex w-full ${flexAlignmentClass}`}>
          <Link prefetch={false} href={actualButtonUrl} className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all">
            {actualButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
