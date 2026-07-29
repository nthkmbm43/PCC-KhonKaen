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
);

CREATE INDEX IF NOT EXISTS "articles_status_updated_at_idx"
  ON "articles" USING btree ("workflow_state", "updated_at");
CREATE INDEX IF NOT EXISTS "articles_category_idx"
  ON "articles" USING btree ("category");
