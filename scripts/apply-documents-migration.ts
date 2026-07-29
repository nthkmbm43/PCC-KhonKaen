import dotenv from 'dotenv';
import { sql } from '@vercel/postgres';
import { db } from '../src/db';
import { documents } from '../src/db/schema';
import { starterDocuments } from '../src/data/documents';

dotenv.config({ path: '.env.local' });

async function main() {
  await sql.query(`ALTER TYPE "audit_resource" ADD VALUE IF NOT EXISTS 'document'`);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS "documents" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "slug" text NOT NULL UNIQUE,
      "title" text NOT NULL,
      "category" text NOT NULL,
      "workflow_state" "workflow_state" DEFAULT 'published' NOT NULL,
      "data" jsonb NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "download_count" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    )
  `);
  await sql.query('CREATE INDEX IF NOT EXISTS "documents_status_sort_idx" ON "documents" ("workflow_state", "sort_order")');
  await sql.query('CREATE INDEX IF NOT EXISTS "documents_category_idx" ON "documents" ("category")');

  for (const document of starterDocuments) {
    await db.insert(documents).values({
      slug: document.slug,
      title: document.title,
      category: document.category,
      workflowState: 'published',
      data: document,
      sortOrder: document.sortOrder,
    }).onConflictDoNothing({ target: documents.slug });
  }

  const result = await sql.query('SELECT COUNT(*)::int AS count FROM "documents"');
  const count = Number(result.rows[0]?.count || 0);
  if (count < starterDocuments.length) throw new Error(`Document migration verification failed: ${count} rows`);
  console.log(`Document library ready (${count} documents verified).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
