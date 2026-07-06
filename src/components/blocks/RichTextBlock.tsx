import React from 'react';
import parse from 'html-react-parser';

type RichTextBlockProps = {
  data: Record<string, any>;
}

export default function RichTextBlock({ data }: RichTextBlockProps) {
  // Extract content from data, default to empty string if not found
  const htmlContent = data?.content || data?.html || '';
  
  if (!htmlContent || typeof htmlContent !== 'string') {
    return null;
  }

  // Parse HTML string into React components safely
  // html-react-parser avoids dangerouslySetInnerHTML and raw scripts
  const parsedContent = parse(htmlContent);

  return (
    <section className="rich-text-block max-w-4xl mx-auto px-4 py-8 prose lg:prose-xl dark:prose-invert">
      {parsedContent}
    </section>
  );
}
