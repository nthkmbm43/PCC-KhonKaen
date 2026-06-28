import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { pages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import RenderBlocks from '@/components/blocks/RenderBlocks'
import { createSeoMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  try {
    const allPages = await db.select({ slug: pages.slug }).from(pages)
    return allPages.map((doc) => ({
      slug: doc.slug,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  let docs: any[] = [];
  try {
    docs = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1)
  } catch (error) {
    console.error('Error in generateMetadata from DB:', error);
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
    title: page.seoTitle || `${page.title} | PCC Post-Tension`,
    description: page.seoDescription || '',
    path: `/${page.slug}`,
  })
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let docs: any[] = [];
  try {
    docs = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1)
  } catch (error) {
    console.error('Error fetching page from DB:', error);
  }

  const page = docs[0]
  
  if (!page) {
    notFound()
  }

  // Parse the content JSONB as the layout array for RenderBlocks
  const layout = Array.isArray(page.content) ? page.content : []

  return (
    <div className="flex flex-col min-h-screen">
      <RenderBlocks layout={layout} />
    </div>
  )
}
