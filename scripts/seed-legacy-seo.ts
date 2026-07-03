import { db } from '../src/db';
import { pages, products, seoMetadata } from '../src/db/schema';
import crypto from 'crypto';

async function seedLegacySeo() {
  console.log('Starting seed for 143 legacy SEO rows...');

  // Let's create 100 pages and 43 products
  const NUM_PAGES = 100;
  const NUM_PRODUCTS = 43;

  for (let i = 0; i < NUM_PAGES; i++) {
    const uniqueSlug = `legacy-page-${crypto.randomUUID()}`;
    await db.insert(pages).values({
      slug: uniqueSlug,
      title: `Legacy Page ${i + 1}`,
      seoTitle: `Legacy SEO Title Page ${i + 1}`,
      seoDescription: `Legacy SEO Description Page ${i + 1}`,
      seoKeywords: 'legacy, seo, page',
    });
  }

  for (let i = 0; i < NUM_PRODUCTS; i++) {
    const uniqueSlug = `legacy-product-${crypto.randomUUID()}`;
    await db.insert(products).values({
      slug: uniqueSlug,
      shortTitle: `Prod ${i + 1}`,
      title: `Legacy Product ${i + 1}`,
      seoTitle: `Legacy SEO Title Product ${i + 1}`,
      seoDescription: `Legacy SEO Description Product ${i + 1}`,
      seoKeywords: 'legacy, seo, product',
    });
  }

  console.log('Seeding completed.');
  process.exit(0);
}

seedLegacySeo().catch(console.error);
