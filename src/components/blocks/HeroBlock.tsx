import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Phone, MessageCircle } from 'lucide-react'

type HeroBlockProps = {
  data: {
    heading?: string
    subheading?: string
    backgroundImage?: any // string from CMS, or object from older PayloadCMS
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
    headline?: string
    description?: string
    ctaText?: string
    ctaHref?: string
  }
}

export default function HeroBlock({ data }: HeroBlockProps) {
  const { heading, subheading, backgroundImage, buttons, links, headline, description, ctaText, ctaHref } = data || {}
  const imageUrl = typeof backgroundImage === 'string' ? backgroundImage : (backgroundImage?.url || '/images/hero-banner.webp')
  const actualHeading = heading || headline || "PCC Post-Tension";
  const actualSubheading = subheading || description || "ผู้นำด้านผลิตภัณฑ์คอนกรีตอัดแรงและเสาเข็มคุณภาพสูง มาตรฐาน มอก.";

  return (
    <section className="relative overflow-hidden bg-slate-900 pt-20 pb-24 group sm:pt-28 sm:pb-32 lg:pt-40 lg:pb-48">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-900 to-slate-950 z-0"></div>

      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay transition-transform duration-[20s] group-hover:scale-110">
        {imageUrl ? (
          <Image src={imageUrl} alt={typeof backgroundImage === 'object' ? (backgroundImage?.alt || actualHeading || '') : (actualHeading || '')} fill className="object-cover" />
        ) : null}
      </div>
      
      {/* Abstract Shapes for Premium feel */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
        <div className="inline-flex max-w-full items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide mb-8 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.1)] sm:text-sm sm:mb-10">
          <Sparkles size={16} className="text-accent-400 animate-pulse" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-100 to-white">
            Premium Corporate Engineering
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-6 leading-[1.15] drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-[5rem] lg:mb-8 tracking-tight">
          {actualHeading}
        </h1>
        {actualSubheading && (
          <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md sm:text-xl lg:mb-14">
            {actualSubheading}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-6">
          {ctaText ? (
            <Link href={ctaHref || "#"} className="relative overflow-hidden bg-[#00B900] hover:bg-[#009900] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_8px_30px_rgba(0,185,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,185,0,0.5)] group">
              <Phone size={22} className="group-hover:rotate-12 transition-transform" />
              {ctaText}
            </Link>
          ) : null}
          {links && links.length > 0 ? (
            links.map(({ link }, index) => {
              const href = link.type === 'reference' && link.reference?.value?.slug 
                ? `/${link.reference.value.slug}` 
                : link.url || '#';
              
              if (link.appearance === 'primary') {
                return (
                  <Link key={index} href={href} target={link.newTab ? '_blank' : undefined} className="relative overflow-hidden bg-[#00B900] hover:bg-[#009900] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_8px_30px_rgba(0,185,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,185,0,0.5)] group">
                    <Phone size={22} className="group-hover:rotate-12 transition-transform" />
                    {link.label}
                  </Link>
                )
              }
              return (
                <Link key={index} href={href} target={link.newTab ? '_blank' : undefined} className="bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_8px_30px_rgba(0,0,0,0.1)] group">
                  <MessageCircle size={22} className="group-hover:-translate-y-0.5 transition-transform" />
                  {link.label}
                </Link>
              )
            })
          ) : buttons && buttons.length > 0 ? (
            buttons.map((btn, index) => {
              if (btn.style === 'primary') {
                return (
                  <Link key={index} href={btn.url} className="relative overflow-hidden bg-[#00B900] hover:bg-[#009900] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_8px_30px_rgba(0,185,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,185,0,0.5)] group">
                    <Phone size={22} className="group-hover:rotate-12 transition-transform" />
                    {btn.label}
                  </Link>
                )
              }
              return (
                <Link key={index} href={btn.url} className="bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_8px_30px_rgba(0,0,0,0.1)] group">
                  <MessageCircle size={22} className="group-hover:-translate-y-0.5 transition-transform" />
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
