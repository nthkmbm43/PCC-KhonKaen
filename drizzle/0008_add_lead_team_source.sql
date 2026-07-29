ALTER TABLE "leads"
ADD COLUMN IF NOT EXISTS "team_code" text DEFAULT 'khon-kaen-new-team' NOT NULL;

ALTER TABLE "leads"
ADD COLUMN IF NOT EXISTS "source_host" text;

CREATE INDEX IF NOT EXISTS "leads_team_code_created_at_idx"
ON "leads" USING btree ("team_code", "created_at");
