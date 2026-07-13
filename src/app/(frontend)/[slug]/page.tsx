import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { breadcrumbJsonLd, createSeoMetadata, JsonLd } from '@/lib/seo'
import { getPageWithSeo } from '@/lib/repositories/page'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { draftMode } from 'next/headers'
import ExitPreviewButton from '@/components/ExitPreviewButton'

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug);
  const page = await getPageWithSeo(decodedSlug)

  if (!page) {
    return createSeoMetadata({
      title: 'ไม่พบหน้า | PCC Post-Tension',
      description: 'ไม่พบหน้าที่คุณต้องการ',
      path: `/${decodedSlug}`,
    })
  }

  return createSeoMetadata({
    title: page.seo?.title || page.title || 'PCC Post-Tension',
    description: page.seo?.description || '',
    keywords: page.seo?.keywords ? page.seo.keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean) : undefined,
    path: `/${page.slug}`,
    image: page.seo?.ogImage || undefined,
  })
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug);

  // Home page is handled by /page.tsx
  if (decodedSlug === 'home') {
    notFound();
  }

  const [page, settings] = await Promise.all([
    getPageWithSeo(decodedSlug),
    getSiteSettings(),
  ])

  const isDraftMode = (await draftMode()).isEnabled

  // Strict check: if not in draft mode, page must be published
  if (!page || (!isDraftMode && page.workflowState !== 'published')) {
    notFound()
  }

  // Inject global CMS settings into blocks that need them (e.g. ContactFormBlock)
  const rawLayout = Array.isArray(page.content) ? page.content : []
  const layout = rawLayout.map((block) => {
    if ((block as Record<string, unknown>).type === 'contactForm') {
      return {
        ...block,
        phone: (block as Record<string, unknown>).phone || settings.contact.mainPhone,
        lineUrl: (block as Record<string, unknown>).lineUrl || settings.contact.lineUrl,
        workingHours: (block as Record<string, unknown>).workingHours || settings.contact.workingHours || 'จันทร์ – อาทิตย์: 08:00 – 17:00 น.',
        holidayNotice: (block as Record<string, unknown>).holidayNotice || settings.contact.holidayNotice || '',
      }
    }
    return block
  })
  const hasContactSocial = layout.some((block) => {
    const blockType = (block as Record<string, unknown>).type || (block as Record<string, unknown>).blockType
    return blockType === 'contactSocial'
  })
  const renderedLayout =
    decodedSlug === 'contact' && !hasContactSocial
      ? [
          ...layout,
          {
            type: 'contactSocial',
            headline: 'ติดต่อเราได้ทุกช่องทาง',
            description: 'เลือก LINE, Facebook, TikTok หรือ Google Map แล้วกดเพื่อเปิดลิงก์ได้ทันที',
          },
        ]
      : layout

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: page.title || decodedSlug, url: `/${page.slug}` },
        ])}
      />
      {isDraftMode && (
        <div className="bg-amber-100 text-amber-800 text-center text-xs py-1.5 font-semibold sticky top-0 z-50 flex justify-center items-center gap-4">
          <span>Preview Mode: You are viewing unpublished changes.</span>
          <ExitPreviewButton />
        </div>
      )}
      <BlockRenderer layout={renderedLayout} />
    </div>
  )
}
