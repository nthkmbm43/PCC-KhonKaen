import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import RenderBlocks from '@/components/blocks/RenderBlocks'
import HeroBlock from '@/components/blocks/HeroBlock'
import { createSeoMetadata, JsonLd } from '@/lib/seo'

// Avoid conflicts with static pages: Next.js will match static routes first (e.g. /about, /contact, /portfolio, /products).
// If none match, this catch-all route [slug] is invoked.

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'pages',
      limit: 100,
    })

    return pages.docs.map((doc) => ({
      slug: doc.slug,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error instanceof Error ? error.message : String(error))
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  let docs: any[] = [];
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    docs = result.docs;
  } catch (error) {
    console.error('Error in generateMetadata from Payload:', error instanceof Error ? error.message : String(error));
  }

  const page = docs[0]
  if (!page) {
    return createSeoMetadata({
      title: 'ไม่พบหน้า | PCC Post-Tension',
      description: 'ไม่พบหน้าที่คุณต้องการ',
      path: `/${slug}`,
    })
  }

  return createSeoMetadata({
    title: page.meta?.title || `${page.title} | PCC Post-Tension`,
    description: page.meta?.description || '',
    path: `/${page.slug}`,
  })
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let docs: any[] = [];
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    docs = result.docs;
  } catch (error) {
    console.error('Error fetching page from Payload:', error instanceof Error ? error.message : String(error));
  }

  const page = docs[0]
  
  if (!page) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* New Hero Tab Support */}
      {page.hero && page.hero.heading && (
        <HeroBlock {...page.hero} />
      )}
      
      <RenderBlocks layout={page.layout} />
    </div>
  )
}
