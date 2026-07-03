import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import { products } from '../src/db/schema';
import crypto from 'crypto';

async function seedAndAnalyze() {
  console.log("=== SEEDING PRODUCTS ===");
  // Clear existing
  await db.execute(sql`TRUNCATE TABLE products CASCADE;`);

  // Insert 1000 rows (950 published, 50 draft)
  const batch = [];
  for (let i = 0; i < 1000; i++) {
    const isDraft = i < 50;
    batch.push({
      id: crypto.randomUUID(),
      slug: `product-${i}`,
      title: `Product ${i}`,
      shortTitle: `P${i}`,
      status: (isDraft ? 'draft' : 'published') as 'draft' | 'published',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)),
    });
  }

  // Chunk inserts for Drizzle
  for (let i = 0; i < batch.length; i += 100) {
    await db.insert(products).values(batch.slice(i, i + 100));
  }
  console.log("Inserted 1000 products (950 published, 50 draft)");

  // Run ANALYZE to update statistics
  await db.execute(sql`ANALYZE products;`);

  console.log("\n=== CREATING COMPOSITE INDEX ===");
  await db.execute(sql`CREATE INDEX IF NOT EXISTS products_status_created_at_idx ON products (status, created_at DESC);`);
  // Run ANALYZE again just in case
  await db.execute(sql`ANALYZE products;`);

  console.log("\n=== EXPLAIN ANALYZE (AFTER COMPOSITE INDEX) ===");
  const explain = async (name: string, query: string) => {
    console.log(`\n-- ${name} --`);
    try {
      const res = await db.execute(sql.raw(`EXPLAIN ANALYZE ${query}`));
      res.rows.forEach(r => console.log(r['QUERY PLAN']));
    } catch(e) {
      console.log(`Error: ${(e as any).message}`);
    }
  };

  await explain("Frontend: Filter by Status, Order by CreatedAt", 
    "SELECT * FROM products WHERE status = 'published' ORDER BY created_at DESC LIMIT 20"
  );

  await explain("Admin: List All Products (No Filter)", 
    "SELECT * FROM products ORDER BY created_at DESC LIMIT 20"
  );
}

seedAndAnalyze().catch(console.error).finally(() => process.exit(0));
