import React from 'react';
import Image from 'next/image';

interface ImageBlockProps {
  image?: string;
}

export default function ImageBlock({ image }: ImageBlockProps) {
  if (!image) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="relative w-full h-auto aspect-video rounded-3xl overflow-hidden shadow-lg">
        <Image src={image} alt="" fill className="object-cover" />
      </div>
    </div>
  );
}
