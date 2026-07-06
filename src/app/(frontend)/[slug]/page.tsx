import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { createSeoMetadata } from '@/lib/seo'
import { getPageWithSeo } from '@/lib/repositories/page'
import { draftMode } from 'next/headers'

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageWithSeo(slug)

  if (!page) {
    return createSeoMetadata({
      title: 'ไม่พบหน้า | PCC Post-Tension',
      description: 'ไม่พบหน้าที่คุณต้องการ',
      path: `/${slug}`,
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
  
  console.log(`[DynamicPage] Fetching page for slug: ${slug}`);

  // Home page is handled by /page.tsx
  if (slug === 'home') {
    console.log(`[DynamicPage] Slug is 'home', returning notFound`);
    notFound();
  }

  const page = await getPageWithSeo(slug)
  console.log(`[DynamicPage] Retrieved page:`, page ? `ID: ${page.id}, Status: ${page.workflowState}` : 'NULL');

  const isDraftMode = (await draftMode()).isEnabled

  // Strict check: if not in draft mode, page must be published
  if (!page || (!isDraftMode && page.workflowState !== 'published')) {
    notFound()
  }

  const layout = Array.isArray(page.content) ? page.content : []

  return (
    <div className="flex flex-col min-h-screen">
      {isDraftMode && (
        <div className="bg-amber-100 text-amber-800 text-center text-xs py-1 font-semibold sticky top-0 z-50">
          Preview Mode: You are viewing unpublished changes.
        </div>
      )}
      <BlockRenderer layout={layout} />
    </div>
  )
}
