"use client";

import React, { useEffect, useRef } from 'react';

export default function CustomCodeBlock({ description, code, html }: { description?: string, code?: string, html?: string }) {
  const content = code || html || description;
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
