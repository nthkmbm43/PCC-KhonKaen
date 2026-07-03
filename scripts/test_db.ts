import { db } from '../src/db';
import { sql } from 'drizzle-orm';
async function test() {
  try {
    const res = await db.execute(sql`SELECT * FROM products LIMIT 1`);
    console.log("Products:", res.rows);
    
    const pages = await db.execute(sql`SELECT * FROM pages LIMIT 1`);
    console.log("Pages:", pages.rows);
  } catch (e) {
    console.error("DB Error:", e);
  }
}
test();
