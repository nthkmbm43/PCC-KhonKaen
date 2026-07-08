import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { createSeoMetadata } from '@/lib/seo'
import { getPageWithSeo } from '@/lib/repositories/page'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { draftMode } from 'next/headers'
import Link from 'next/link'

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
    path: `/${page.slug}`,
    image: page.seo?.ogImage || undefined,
  })
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug);
  
  console.log(`[DynamicPage] Raw slug: "${slug}", Decoded slug: "${decodedSlug}"`);

  // Home page is handled by /page.tsx
  if (decodedSlug === 'home') {
    console.log(`[DynamicPage] Slug is 'home', returning notFound`);
    notFound();
  }

  const [page, settings] = await Promise.all([
    getPageWithSeo(decodedSlug),
    getSiteSettings(),
  ])
  console.log(`[DynamicPage] DB result for "${decodedSlug}":`, page ? `FOUND (ID: ${page.id}, Status: ${page.workflowState})` : 'NOT_FOUND');

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

  return (
    <div className="flex flex-col min-h-screen">
      {isDraftMode && (
        <div className="bg-amber-100 text-amber-800 text-center text-xs py-1.5 font-semibold sticky top-0 z-50 flex justify-center items-center gap-4">
          <span>Preview Mode: You are viewing unpublished changes.</span>
          <Link href="/api/exit-preview" prefetch={false} className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-full transition-colors underline-none">
            Exit Preview
          </Link>
        </div>
      )}
      <BlockRenderer layout={layout} />
    </div>
  )
}
