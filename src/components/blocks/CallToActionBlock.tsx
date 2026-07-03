import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type CallToActionBlockProps = {
  headline: string
  subheadline?: string
  theme: 'navy' | 'amber' | 'light'
  buttons?: {
    label: string
    url: string
    style: 'primary' | 'secondary'
  }[]
  links?: {
    link: {
      type: 'reference' | 'custom'
      reference?: { value: { slug?: string; [key: string]: unknown }, relationTo: string }
      url?: string
      label: string
      newTab?: boolean
      appearance?: 'primary' | 'secondary' | 'outline'
    }
  }[]
}

export default function CallToActionBlock({ headline, subheadline, theme, buttons, links }: CallToActionBlockProps) {
  let bgClass = ''
  let textClass = ''
  let descClass = ''

  if (theme === 'navy') {
    bgClass = 'bg-gradient-to-br from-[#0a174f] to-[#1e3ca6]'
    textClass = 'text-white'
    descClass = 'text-brand-100'
  } else if (theme === 'amber') {
    bgClass = 'bg-gradient-to-br from-accent-500 to-accent-600'
    textClass = 'text-white'
    descClass = 'text-white/90'
  } else {
    bgClass = 'bg-gray-100'
    textClass = 'text-gray-900'
    descClass = 'text-gray-600'
  }

  return (
    <section className={`py-24 relative overflow-hidden ${bgClass}`}>
      {theme === 'navy' && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 drop-shadow-md ${textClass}`}>{headline}</h2>
        {subheadline && (
          <p className={`text-xl mb-12 drop-shadow-sm ${descClass}`}>{subheadline}</p>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {links && links.length > 0 ? (
            links.map(({ link }, index) => {
              const href = link.type === 'reference' && link.reference?.value?.slug 
                ? `/${link.reference.value.slug}` 
                : link.url || '#';
                
              if (link.appearance === 'primary') {
                return (
                  <Link key={index} href={href} target={link.newTab ? '_blank' : undefined} className="inline-flex bg-accent-500 hover:bg-accent-600 text-white px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-4 transition-all animate-pulse-glow hover:-translate-y-2 hover:scale-105 group">
                    {link.label}
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )
              }
              return (
                <Link key={index} href={href} target={link.newTab ? '_blank' : undefined} className={`inline-flex px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-4 transition-all hover:-translate-y-2 hover:scale-105 group ${theme === 'light' ? 'bg-white text-brand-600 border border-brand-200 shadow-sm' : 'bg-white/10 text-white backdrop-blur-md border border-white/30 hover:bg-white/20'}`}>
                  {link.label}
                </Link>
              )
            })
          ) : buttons && buttons.length > 0 ? (
            buttons.map((btn, index) => {
              if (btn.style === 'primary') {
                return (
                  <Link key={index} href={btn.url} className="inline-flex bg-accent-500 hover:bg-accent-600 text-white px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-4 transition-all animate-pulse-glow hover:-translate-y-2 hover:scale-105 group">
                    {btn.label}
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )
              }
              return (
                <Link key={index} href={btn.url} className={`inline-flex px-10 py-5 rounded-full font-bold text-xl items-center justify-center gap-4 transition-all hover:-translate-y-2 hover:scale-105 group ${theme === 'light' ? 'bg-white text-brand-600 border border-brand-200 shadow-sm' : 'bg-white/10 text-white backdrop-blur-md border border-white/30 hover:bg-white/20'}`}>
                  {btn.label}
                </Link>
              )
            })
          ) : null}
        </div>
      </div>
    </section>
  )
}
