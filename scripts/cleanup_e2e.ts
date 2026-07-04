import { db } from "../src/db";
import { pages, products, seoMetadata } from "../src/db/schema";
import { ilike, like } from "drizzle-orm";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' }); // Fallback if no .env.local

async function cleanup() {
  console.log("Starting E2E dummy data cleanup...");
  
  try {
    const deletedPages = await db.delete(pages).where(like(pages.slug, 'e2e-%')).returning();
    console.log(`Deleted ${deletedPages.length} dummy pages.`);

    const deletedProducts = await db.delete(products).where(like(products.slug, 'e2e-%')).returning();
    console.log(`Deleted ${deletedProducts.length} dummy products.`);
    
    // seoMetadata might have cascade deletion, but let's delete orphans just in case
    // Wait, let's not touch seoMetadata directly if it might be huge, or let's assume it cascades.

    console.log("Cleanup finished.");
  } catch (err) {
    console.error("Cleanup failed:", err);
  }
}

cleanup();
