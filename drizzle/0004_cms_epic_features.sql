DO $$ BEGIN
 CREATE TYPE "public"."workflow_state" AS ENUM('draft', 'review', 'published', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"data" jsonb NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seo_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"title" text,
	"description" text,
	"keywords" text,
	"canonical" text,
	"og_image" text,
	"twitter_image" text,
	"robots" text DEFAULT 'index, follow',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "workflow_state" "workflow_state" DEFAULT 'published';
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "preview_token_hash" text;
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "preview_expires_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "workflow_state" "workflow_state" DEFAULT 'published';
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "preview_token_hash" text;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "preview_expires_at" timestamp with time zone;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_resource_version_idx" ON "revisions" USING btree ("resource_type", "resource_id", "version");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seo_resource_idx" ON "seo_metadata" USING btree ("resource_type", "resource_id");