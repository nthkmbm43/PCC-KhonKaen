import { db } from "../../src/db";
import { pages, products } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' }); 

async function globalSetup() {
  console.log('Seeding database for E2E tests...');
  
  const dummyPages = [
    { slug: 'home', title: 'Home', content: [], workflowState: 'published' as const },
    { slug: 'about', title: 'About Us', content: [], workflowState: 'published' as const },
    { slug: 'contact', title: 'Contact Us', content: [], workflowState: 'published' as const },
    { slug: 'portfolio', title: 'Portfolio', content: [], workflowState: 'published' as const },
  ];

  for (const p of dummyPages) {
    const existing = await db.query.pages.findFirst({ where: eq(pages.slug, p.slug) });
    if (!existing) {
      await db.insert(pages).values(p);
    }
  }

  const dummyProducts = [
    { slug: 'retaining-wall', title: 'Retaining Wall', shortTitle: 'Retaining Wall', description: 'desc', workflowState: 'published' as const, category: 'general' },
    { slug: 'precast-fence', title: 'Precast Fence', shortTitle: 'Precast Fence', description: 'desc', workflowState: 'published' as const, category: 'general' },
    { slug: 'precast-slab', title: 'Precast Slab', shortTitle: 'Precast Slab', description: 'desc', workflowState: 'published' as const, category: 'general' },
    { slug: 'barbed-wire-post', title: 'Barbed Wire Post', shortTitle: 'Barbed Wire Post', description: 'desc', workflowState: 'published' as const, category: 'general' },
    { slug: 'post-tension', title: 'Post Tension', shortTitle: 'Post Tension', description: 'desc', workflowState: 'published' as const, category: 'general' },
  ];

  for (const p of dummyProducts) {
    const existing = await db.query.products.findFirst({ where: eq(products.slug, p.slug) });
    if (!existing) {
      await db.insert(products).values(p);
    }
  }

  console.log('Seed complete.');
}

export default globalSetup;
