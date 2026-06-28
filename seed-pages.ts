import { db } from './src/db';
import { pages } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  const defaultPages = [
    {
      slug: 'home',
      title: 'หน้าหลัก',
      content: [
        { blockType: 'homeHero' },
        { blockType: 'trustBanner' },
        { blockType: 'servicesGrid' },
        { blockType: 'portfolioGrid' },
        { blockType: 'faqSection' },
        { blockType: 'ctaBanner' }
      ]
    },
    {
      slug: 'about',
      title: 'เกี่ยวกับเรา',
      content: [
        { blockType: 'aboutHero' },
        { blockType: 'aboutContent' },
        { blockType: 'aboutFeatureGrid' }
      ]
    },
    {
      slug: 'contact',
      title: 'ติดต่อเรา',
      content: [
        { blockType: 'contactInfo' },
        { blockType: 'contactSocial' }
      ]
    },
    {
      slug: 'portfolio',
      title: 'ผลงานของเรา',
      content: [
        { blockType: 'portfolioFullGrid' }
      ]
    }
  ];

  console.log('Starting seed...');
  for (const page of defaultPages) {
    const existing = await db.select().from(pages).where(eq(pages.slug, page.slug));
    if (existing.length === 0) {
      console.log(`Inserting page: ${page.slug}`);
      await db.insert(pages).values({
        slug: page.slug,
        title: page.title,
        content: page.content,
        seoTitle: `${page.title} | PCC Post-Tension`,
        status: 'published'
      });
    } else {
      console.log(`Page already exists: ${page.slug}`);
    }
  }
  console.log('Seed complete!');
}

seed().catch(console.error);
