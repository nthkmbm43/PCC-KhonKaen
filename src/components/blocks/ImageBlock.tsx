/* eslint-disable @next/next/no-img-element */
import React from 'react';

export default function ImageBlock({ image }: Record<string, unknown>) {
  if (!image) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <img src={image} alt="" className="w-full h-auto rounded-3xl shadow-lg" />
    </div>
  );
}
