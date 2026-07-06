import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { createSeoMetadata } from '@/lib/seo'
import { getPageWithSeo } from '@/lib/repositories/page'
import { draftMode } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithSeo('home')

  if (!page) {
    return createSeoMetadata({
      title: 'PCC Post-Tension',
      description: 'PCC Post-Tension Homepage',
      path: `/`,
    })
  }

  return createSeoMetadata({
    title: page.seo?.title || page.title || 'PCC Post-Tension',
    description: page.seo?.description || '',
    path: `/`,
    image: page.seo?.ogImage || undefined,
  })
}

export default async function HomePage() {
  const page = await getPageWithSeo('home')
  const isDraftMode = (await draftMode()).isEnabled

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
