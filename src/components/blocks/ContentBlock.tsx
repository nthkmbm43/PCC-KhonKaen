import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type ColumnType = {
  size: 'oneThird' | 'half' | 'twoThirds' | 'full' | string
  richText?: any
  content?: string
  enableLink?: boolean
  link?: {
    type?: 'reference' | 'custom'
    reference?: { value: any, relationTo: string }
    url?: string
    label?: string
    newTab?: boolean
    appearance?: 'primary' | 'secondary' | 'outline'
  }
}

export default function ContentBlock({ richText, content, columns }: { richText?: any, content?: string, columns?: ColumnType[] }) {
  const displayContent = content || richText
  if (!displayContent && (!columns || columns.length === 0)) return null

  const sizeClasses: Record<string, string> = {
    oneThird: 'col-span-12 md:col-span-4',
    half: 'col-span-12 md:col-span-6',
    twoThirds: 'col-span-12 md:col-span-8',
    full: 'col-span-12',
  }

  const renderContent = (data: any) => {
    if (!data) return null;
    if (typeof data === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: data }} />
    }
    // Fallback for objects if there's any residual JSON
    return <div>{JSON.stringify(data)}</div>
  }

  return (
    <section className="py-16 bg-white sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Legacy Support */}
        {!columns || columns.length === 0 ? (
          <div className="prose prose-lg prose-blue mx-auto prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-600 hover:prose-a:text-brand-700 max-w-4xl">
            {renderContent(displayContent)}
          </div>
        ) : (
          /* New Column Layout */
          <div className="grid grid-cols-12 gap-8 md:gap-12">
            {columns.map((col, index) => {
              const size = col.size || 'full'
              const colContent = col.content || col.richText
              const colClass = sizeClasses[size] || sizeClasses.full
              
              let href = '#'
              if (col.link?.type === 'reference' && col.link.reference?.value?.slug) {
                href = `/${col.link.reference.value.slug}`
              } else if (col.link?.url) {
                href = col.link.url
              }

              return (
                <div key={index} className={colClass}>
                  <div className="prose prose-lg prose-blue prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-600 hover:prose-a:text-brand-700 max-w-none h-full flex flex-col">
                    <div className="flex-grow">
                      {colContent && renderContent(colContent)}
                    </div>
                    {col.enableLink && col.link && col.link.label && (
                      <div className="mt-8">
                        <Link 
                          href={href} 
                          target={col.link.newTab ? '_blank' : undefined}
                          className={`inline-flex items-center gap-2 font-bold transition-all ${
                            col.link.appearance === 'primary' 
                              ? 'bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full' 
                              : col.link.appearance === 'outline'
                              ? 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-full'
                              : 'text-brand-600 hover:text-brand-700 group'
                          }`}
                        >
                          {col.link.label}
                          {col.link.appearance !== 'primary' && col.link.appearance !== 'outline' && (
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
