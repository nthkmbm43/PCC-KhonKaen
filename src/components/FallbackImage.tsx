"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface FallbackImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  fallbackSrc: string;
  finalFallbackSrc?: string;
  alt?: string;
}

export default function FallbackImage({ src, fallbackSrc, finalFallbackSrc = "/images/about-factory.jpg", alt, ...props }: FallbackImageProps) {
  const [errorCount, setErrorCount] = useState(0);

  let currentSrc = src;
  if (errorCount === 1) currentSrc = fallbackSrc;
  if (errorCount >= 2) currentSrc = finalFallbackSrc;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || ""}
      width={props.width || (props.fill ? undefined : 800)}
      height={props.height || (props.fill ? undefined : 600)}
      onError={() => {
        setErrorCount(prev => prev + 1);
      }}
    />
  );
}
