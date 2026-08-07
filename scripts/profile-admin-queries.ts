import dotenv from "dotenv";
import { desc } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

async function main() {
  const { db } = await import("../src/db");
  const schema = await import("../src/db/schema");
  const queries = [
    ["articles", () => db.select({ id: schema.articles.id, slug: schema.articles.slug, title: schema.articles.title }).from(schema.articles).orderBy(desc(schema.articles.updatedAt))],
    ["products", () => db.select({ id: schema.products.id, slug: schema.products.slug, title: schema.products.title }).from(schema.products)],
    ["pages", () => db.select({ id: schema.pages.id, slug: schema.pages.slug, title: schema.pages.title }).from(schema.pages)],
    ["leads", () => db.select({ id: schema.leads.id, name: schema.leads.name }).from(schema.leads).limit(50)],
  ] as const;

  for (const [name, query] of queries) {
    for (let run = 1; run <= 3; run += 1) {
      const startedAt = performance.now();
      const rows = await query();
      console.log(`${name} run=${run} duration=${Math.round(performance.now() - startedAt)}ms rows=${rows.length}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
