ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "lead_code" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "province" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "district" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "estimated_length" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "level_difference" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "water_condition" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "access_condition" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "nearby_load" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "handoff_status" text DEFAULT 'pending' NOT NULL;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "handed_off_at" timestamp with time zone;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "confirmed_area_sqm" numeric(12,2);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "sale_value" numeric(14,2);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "commission_rate" numeric(6,2);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "commission_amount" numeric(14,2);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "sales_notes" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;

UPDATE "leads"
SET "lead_code" = 'KK-' || to_char("created_at" AT TIME ZONE 'Asia/Bangkok', 'YYYYMMDD') || '-' || upper(substring(replace("id"::text, '-', '') from 1 for 6))
WHERE "lead_code" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "leads_lead_code_unique" ON "leads" ("lead_code");
CREATE INDEX IF NOT EXISTS "leads_handoff_status_created_at_idx" ON "leads" ("handoff_status", "created_at");
