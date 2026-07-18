DO $$ BEGIN
  CREATE TYPE "lead_status" AS ENUM ('new', 'contacted', 'qualified', 'closed', 'spam');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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
);

CREATE INDEX IF NOT EXISTS "leads_status_created_at_idx" ON "leads" USING btree ("status", "created_at");
CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "leads_utm_source_idx" ON "leads" USING btree ("utm_source");
