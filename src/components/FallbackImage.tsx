"use client";

import { useState } from "react";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc: string;
  finalFallbackSrc?: string;
}

export default function FallbackImage({ src, fallbackSrc, finalFallbackSrc = "/images/about-factory.jpg", alt, ...props }: FallbackImageProps) {
  const [errorCount, setErrorCount] = useState(0);

  let currentSrc = src;
  if (errorCount === 1) currentSrc = fallbackSrc;
  if (errorCount >= 2) currentSrc = finalFallbackSrc;

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt || ""}
      onError={() => {
        setErrorCount(prev => prev + 1);
      }}
    />
  );
}
