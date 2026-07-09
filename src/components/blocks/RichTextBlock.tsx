import React from 'react';
import parse from 'html-react-parser';

type RichTextBlockProps = {
  data: Record<string, any>;
}

export default function RichTextBlock({ data }: RichTextBlockProps) {
  // Extract content from data, default to empty string if not found
  const htmlContent = data?.content || data?.html || data?.description || '';
  const headline = data?.headline || data?.title;
  const backgroundStyle = data?.backgroundStyle || '';
  const paddingTop = data?.paddingTop || 'py-8';
  const paddingBottom = data?.paddingBottom || '';
  const customCss = data?.customCss || '';
  
  if (!htmlContent || typeof htmlContent !== 'string') {
    return null;
  }

  // Parse HTML string into React components safely
  // html-react-parser avoids dangerouslySetInnerHTML and raw scripts
  const parsedContent = parse(htmlContent);

  return (
    <section className={`rich-text-block w-full ${backgroundStyle} ${paddingTop} ${paddingBottom}`} style={customCss ? { cssText: customCss } as any : undefined}>
      <div className="max-w-4xl mx-auto px-4 prose lg:prose-xl dark:prose-invert">
        {headline && <h2 className="text-3xl font-bold mb-6">{headline}</h2>}
        {parsedContent}
      </div>
    </section>
  );
}
