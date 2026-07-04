import React from 'react';

export default function CustomCodeBlock({ description }: { description?: string }) {
  if (!description) return null;
  return (
    <div className="custom-code-widget w-full" dangerouslySetInnerHTML={{ __html: description }} />
  );
}
