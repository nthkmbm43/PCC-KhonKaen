import dotenv from 'dotenv';
import { sql } from '@vercel/postgres';

dotenv.config({ path: '.env.local' });

async function main() {
  await sql.query(`
    DO $$ BEGIN
      CREATE TYPE "lead_status" AS ENUM ('new', 'contacted', 'qualified', 'closed', 'spam');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS "leads" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "phone" text NOT NULL,
      "email" text,
      "project" text,
      "message" text,
      "status" "lead_status" DEFAULT 'new' NOT NULL,
      "landing_page" text,
      "referrer" text,
      "utm_source" text,
      "utm_medium" text,
      "utm_campaign" text,
      "utm_content" text,
      "utm_term" text,
      "click_id" text,
      "user_agent" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    )
  `);

  await sql.query('CREATE INDEX IF NOT EXISTS "leads_status_created_at_idx" ON "leads" ("status", "created_at")');
  await sql.query('CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" ("created_at")');
  await sql.query('CREATE INDEX IF NOT EXISTS "leads_utm_source_idx" ON "leads" ("utm_source")');

  const result = await sql.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads'
    ORDER BY ordinal_position
  `);

  if (result.rows.length !== 17) {
    throw new Error(`Lead migration verification failed: found ${result.rows.length} columns`);
  }

  console.log(`Lead migration ready (${result.rows.length} columns verified).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
