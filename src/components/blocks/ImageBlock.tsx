import React from 'react';
import Image from 'next/image';

type ImageBlockProps = {
  data: {
    url?: string;
    alt?: string;
    caption?: string;
  };
};

export default function ImageBlock({ data }: ImageBlockProps) {
  const { url, alt } = data || {};
  if (!url) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="relative w-full h-auto aspect-video rounded-3xl overflow-hidden shadow-lg">
        <Image src={url} alt={alt || ''} fill className="object-cover" />
      </div>
    </div>
  );
}
