import { db } from '../src/db';
import { products, pages } from '../src/db/schema';
import { like, or } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function cleanup() {
  console.log('🧹 Starting cleanup of E2E and Test data from Production DB...');
  
  try {
    // Delete Products
    const deletedProducts = await db.delete(products).where(
      or(
        like(products.slug, 'e2e-%'),
        like(products.slug, 'test-%')
      )
    ).returning({ slug: products.slug });

    console.log(`✅ Deleted ${deletedProducts.length} E2E products:`);
    deletedProducts.forEach(p => console.log(`   - ${p.slug}`));

    // Delete Pages
    const deletedPages = await db.delete(pages).where(
      or(
        like(pages.slug, 'e2e-%'),
        like(pages.slug, 'test-%')
      )
    ).returning({ slug: pages.slug });

    console.log(`✅ Deleted ${deletedPages.length} E2E pages:`);
    deletedPages.forEach(p => console.log(`   - ${p.slug}`));

    console.log('🎉 Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup();
