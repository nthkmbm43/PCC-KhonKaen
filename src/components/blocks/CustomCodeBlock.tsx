"use client";

import React, { useEffect, useRef } from 'react';

export default function CustomCodeBlock({ data }: { data?: Record<string, any> }) {
  const content = data?.code || data?.html || data?.description || data?.customHeadCode || '';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Find all script tags in the rendered content and re-evaluate them so they execute
      const scripts = containerRef.current.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [content]);

  if (!content) return null;
  
  return (
    <div ref={containerRef} className="custom-code-widget w-full" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
