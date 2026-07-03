/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { Sparkles, Phone, MessageCircle } from 'lucide-react'

type HeroBlockProps = {
  heading: string
  subheading?: string
  backgroundImage: unknown
  buttons?: {
    label: string
    url: string
    style: 'primary' | 'secondary'
  }[]
  links?: {
    link: {
      type: 'reference' | 'custom'
      reference?: { value: unknown, relationTo: string }
      url?: string
      label: string
      newTab?: boolean
      appearance?: 'primary' | 'secondary' | 'outline'
    }
  }[]
}

export default function HeroBlock({ heading, subheading, backgroundImage, buttons, links }: HeroBlockProps) {
  const imageUrl = backgroundImage?.url || '/images/hero-banner.webp'

  return (
    <section className="relative overflow-hidden bg-[#0a174f] pt-14 pb-20 group sm:pt-20 sm:pb-28 lg:pt-32 lg:pb-40">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a174f] via-brand-900 to-brand-800/80 opacity-95 z-0 transition-opacity duration-1000"></div>

      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay transition-transform duration-[20s] group-hover:scale-110">
        <img src={imageUrl} alt={backgroundImage?.alt || heading} className="w-full h-full object-cover" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
        <div className="inline-flex max-w-full items-center gap-2 bg-accent-500/10 text-accent-400 border border-accent-500/30 px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-6 backdrop-blur-sm sm:px-6 sm:py-2.5 sm:text-sm sm:mb-8">
          <Sparkles size={16} className="animate-pulse" /> PCC Post-Tension Page Builder
        </div>
        <h1 className="text-3xl font-bold text-white mb-5 leading-tight drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-7xl lg:mb-6">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-5 text-base text-brand-100 max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow-md sm:text-lg md:text-xl lg:mb-12">
            {subheading}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {links && links.length > 0 ? (
            links.map(({ link }, index) => {
              const href = link.type === 'reference' && link.reference?.value?.slug 
                ? `/${link.reference.value.slug}` 
                : link.url || '#';
              
              if (link.appearance === 'primary') {
                return (
                  <Link key={index} href={href} target={link.newTab ? '_blank' : undefined} className="relative overflow-hidden bg-accent-500 hover:bg-accent-600 text-white px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all animate-pulse-glow sm:px-8 sm:text-lg group">
                    <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                    {link.label}
                  </Link>
                )
              }
              return (
                <Link key={index} href={href} target={link.newTab ? '_blank' : undefined} className="bg-brand-50/10 hover:bg-brand-50/20 text-white backdrop-blur-md border border-white/30 px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg sm:px-8 sm:text-lg">
                  <MessageCircle size={24} />
                  {link.label}
                </Link>
              )
            })
          ) : buttons && buttons.length > 0 ? (
            buttons.map((btn, index) => {
              if (btn.style === 'primary') {
                return (
                  <Link key={index} href={btn.url} className="relative overflow-hidden bg-accent-500 hover:bg-accent-600 text-white px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all animate-pulse-glow sm:px-8 sm:text-lg group">
                    <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                    {btn.label}
                  </Link>
                )
              }
              return (
                <Link key={index} href={btn.url} className="bg-brand-50/10 hover:bg-brand-50/20 text-white backdrop-blur-md border border-white/30 px-6 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg sm:px-8 sm:text-lg">
                  <MessageCircle size={24} />
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
