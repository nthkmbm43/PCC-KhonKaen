import { RichText } from '@payloadcms/richtext-lexical/react'

export default function ContentBlock({ richText }: { richText: any }) {
  if (!richText) return null

  return (
    <section className="py-16 bg-white sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg prose-blue mx-auto prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-600 hover:prose-a:text-brand-700 max-w-none">
          <RichText data={richText} />
        </div>
      </div>
    </section>
  )
}
