import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type ColumnType = {
  size: 'oneThird' | 'half' | 'twoThirds' | 'full'
  richText: any
  enableLink?: boolean
  link?: {
    type: 'reference' | 'custom'
    reference?: { value: any, relationTo: string }
    url?: string
    label: string
    newTab?: boolean
    appearance?: 'primary' | 'secondary' | 'outline'
  }
}

export default function ContentBlock({ richText, columns }: { richText?: any, columns?: ColumnType[] }) {
  if (!richText && (!columns || columns.length === 0)) return null

  const sizeClasses = {
    oneThird: 'col-span-12 md:col-span-4',
    half: 'col-span-12 md:col-span-6',
    twoThirds: 'col-span-12 md:col-span-8',
    full: 'col-span-12',
  }

  return (
    <section className="py-16 bg-white sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Legacy Support */}
        {!columns || columns.length === 0 ? (
          <div className="prose prose-lg prose-blue mx-auto prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-600 hover:prose-a:text-brand-700 max-w-4xl">
            <RichText data={richText} />
          </div>
        ) : (
          /* New Column Layout */
          <div className="grid grid-cols-12 gap-8 md:gap-12">
            {columns.map((col, index) => {
              const { size, richText: colRichText, enableLink, link } = col
              const colClass = sizeClasses[size] || sizeClasses.full
              
              let href = '#'
              if (link?.type === 'reference' && link.reference?.value?.slug) {
                href = `/${link.reference.value.slug}`
              } else if (link?.url) {
                href = link.url
              }

              return (
                <div key={index} className={colClass}>
                  <div className="prose prose-lg prose-blue prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-600 hover:prose-a:text-brand-700 max-w-none h-full flex flex-col">
                    <div className="flex-grow">
                      {colRichText && <RichText data={colRichText} />}
                    </div>
                    {enableLink && link && (
                      <div className="mt-8">
                        <Link 
                          href={href} 
                          target={link.newTab ? '_blank' : undefined}
                          className={`inline-flex items-center gap-2 font-bold transition-all ${
                            link.appearance === 'primary' 
                              ? 'bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full' 
                              : link.appearance === 'outline'
                              ? 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-full'
                              : 'text-brand-600 hover:text-brand-700 group'
                          }`}
                        >
                          {link.label}
                          {link.appearance !== 'primary' && link.appearance !== 'outline' && (
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          )}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
