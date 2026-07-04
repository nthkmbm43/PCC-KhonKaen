import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type ColumnType = {
  size: 'oneThird' | 'half' | 'twoThirds' | 'full' | string
  richText?: string | Record<string, unknown>
  content?: string
  enableLink?: boolean
  link?: {
    type?: 'reference' | 'custom'
    reference?: { value: { slug?: string; [key: string]: unknown }, relationTo: string }
    url?: string
    label?: string
    newTab?: boolean
    appearance?: 'primary' | 'secondary' | 'outline'
  }
}

export default function ContentBlock({ richText, content, columns }: { richText?: string | Record<string, unknown>, content?: string, columns?: ColumnType[] }) {
  const displayContent = content || richText
  if (!displayContent && (!columns || columns.length === 0)) return null

  const sizeClasses: Record<string, string> = {
    oneThird: 'col-span-12 md:col-span-4',
    half: 'col-span-12 md:col-span-6',
    twoThirds: 'col-span-12 md:col-span-8',
    full: 'col-span-12',
  }

  const renderContent = (data: unknown) => {
    if (!data) return null;
    if (typeof data === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: data }} />
    }
    // Fallback for objects if there's any residual JSON
    return <div>{JSON.stringify(data)}</div>
  }

  return (
    <section className="py-20 bg-white sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Legacy Support */}
        {!columns || columns.length === 0 ? (
          <div className="prose prose-lg prose-slate mx-auto prose-headings:font-extrabold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-brand-600 hover:prose-a:text-brand-700 max-w-4xl">
            {renderContent(displayContent)}
          </div>
        ) : (
          /* New Column Layout */
          <div className="grid grid-cols-12 gap-10 md:gap-16 lg:gap-20">
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
                  <div className="prose prose-lg prose-slate prose-headings:font-extrabold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-brand-600 hover:prose-a:text-brand-700 max-w-none h-full flex flex-col">
                    <div className="flex-grow">
                      {colContent && renderContent(colContent)}
                    </div>
                    {col.enableLink && col.link && col.link.label && (
                      <div className="mt-10">
                        <Link 
                          href={href} 
                          target={col.link.newTab ? '_blank' : undefined}
                          className={`inline-flex items-center gap-2 font-bold transition-all duration-300 ${
                            col.link.appearance === 'primary' 
                              ? 'bg-[#00B900] hover:bg-[#009900] text-white px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(0,185,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,185,0,0.4)] hover:scale-105' 
                              : col.link.appearance === 'outline'
                              ? 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50 px-8 py-4 rounded-full hover:scale-105 shadow-[0_4px_14px_rgba(0,0,0,0.05)]'
                              : 'text-brand-600 hover:text-brand-800 group text-lg'
                          }`}
                        >
                          {col.link.label}
                          {col.link.appearance !== 'primary' && col.link.appearance !== 'outline' && (
                            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
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
