CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'admin',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "favicon_url" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "navbar_links" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "footer_data" jsonb DEFAULT '{}';