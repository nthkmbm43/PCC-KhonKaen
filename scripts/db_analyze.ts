import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import { products, pages, admins, auditLogs, siteSettings } from '../src/db/schema';

async function analyze() {
  console.log("=== DB INVENTORY ===");
  const tableRows = async (table: string) => {
    const res = await db.execute(sql.raw(`SELECT count(*) FROM ${table}`));
    return res.rows[0].count;
  };

  console.log(`products rows: ${await tableRows('products')}`);
  console.log(`pages rows: ${await tableRows('pages')}`);
  console.log(`admins rows: ${await tableRows('admins')}`);
  console.log(`auditLogs rows: ${await tableRows('audit_logs')}`);
  console.log(`siteSettings rows: ${await tableRows('site_settings')}`);

  console.log("\n=== EXPLAIN PLANS ===");

  const explain = async (name: string, query: string) => {
    console.log(`\n-- Plan for: ${name} --`);
    try {
      const res = await db.execute(sql.raw(`EXPLAIN ${query}`));
      res.rows.forEach(r => console.log(r['QUERY PLAN']));
    } catch(e) {
      console.log(`Error: ${(e as any).message}`);
    }
  };

  // Common Queries found in src:
  
  // 1. Fetch page by slug
  await explain("Frontend: Get Page by Slug", "SELECT * FROM pages WHERE slug = 'home' LIMIT 1");
  
  // 2. Fetch all products order by createdAt desc
  await explain("Admin: List Products", "SELECT * FROM products ORDER BY created_at DESC");

  // 3. Fetch audit logs (assuming a future list view or current usage)
  // Actually, auditLogs is inserted, maybe fetched by userId or resource?
  await explain("Admin: List Audit Logs", "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50");

  // 4. Fetch site settings
  await explain("Global: Get Site Settings", "SELECT * FROM site_settings LIMIT 1");

  // 5. Fetch user by email
  await explain("Auth: Get User by Email", "SELECT * FROM admins WHERE email = 'test@example.com' LIMIT 1");

  console.log("\nDone.");
}

analyze().catch(console.error).finally(() => process.exit(0));
