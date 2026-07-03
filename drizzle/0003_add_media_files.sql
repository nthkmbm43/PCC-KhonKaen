ALTER TYPE "audit_action" ADD VALUE 'SEARCH';
ALTER TYPE "audit_action" ADD VALUE 'ROLLBACK';
ALTER TYPE "audit_action" ADD VALUE 'GENERATE';
ALTER TYPE "audit_resource" ADD VALUE 'media';
ALTER TYPE "audit_resource" ADD VALUE 'seo';
ALTER TYPE "audit_resource" ADD VALUE 'revision';

CREATE TABLE IF NOT EXISTS "media_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"blob_url" text NOT NULL,
	"alt" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_filename_idx" ON "media_files" USING btree ("filename");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_alt_idx" ON "media_files" USING btree ("alt");