import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CtaBlockProps {
  headline?: string;
  description?: string;
  backgroundImage?: string;
}

export default function CtaBlock({ headline, description, backgroundImage }: CtaBlockProps) {
  return (
    <div className="relative py-24 overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image src={backgroundImage} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-slate-900 z-0"></div>}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{headline}</h2>
        <p className="text-xl text-slate-300 mb-10">{description}</p>
        <Link href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:-translate-y-1 transition-all">
          ติดต่อเรา
        </Link>
      </div>
    </div>
  );
}
