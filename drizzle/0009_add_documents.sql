ALTER TYPE "audit_resource" ADD VALUE IF NOT EXISTS 'document';

CREATE TABLE IF NOT EXISTS "documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "workflow_state" "workflow_state" DEFAULT 'published' NOT NULL,
  "data" jsonb NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "download_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "documents_slug_unique" UNIQUE("slug")
);

CREATE INDEX IF NOT EXISTS "documents_status_sort_idx" ON "documents" USING btree ("workflow_state", "sort_order");
CREATE INDEX IF NOT EXISTS "documents_category_idx" ON "documents" USING btree ("category");
