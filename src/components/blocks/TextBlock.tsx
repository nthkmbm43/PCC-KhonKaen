import React from 'react';

export default function TextBlock({ description }: any) {
  return (
    <div 
      className="max-w-7xl mx-auto px-4 py-12 prose prose-lg" 
      dangerouslySetInnerHTML={{ __html: description || '' }} 
    />
  );
}
