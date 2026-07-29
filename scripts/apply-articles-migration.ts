import dotenv from "dotenv";
import { sql } from "@vercel/postgres";

dotenv.config({ path: ".env.local" });

async function main() {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS "articles" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "slug" text NOT NULL,
      "title" text NOT NULL,
      "category" text NOT NULL,
      "workflow_state" "workflow_state" DEFAULT 'published' NOT NULL,
      "data" jsonb NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "articles_slug_unique" UNIQUE("slug")
    )
  `);
  await sql.query('CREATE INDEX IF NOT EXISTS "articles_status_updated_at_idx" ON "articles" ("workflow_state", "updated_at")');
  await sql.query('CREATE INDEX IF NOT EXISTS "articles_category_idx" ON "articles" ("category")');

  const result = await sql.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles'
    ORDER BY ordinal_position
  `);
  if (result.rows.length !== 8) {
    throw new Error(`Article migration verification failed: found ${result.rows.length} columns`);
  }
  console.log(`Article CMS migration ready (${result.rows.length} columns verified).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
