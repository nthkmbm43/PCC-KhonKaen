CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" jsonb DEFAULT '[]',
	"seo_title" text,
	"seo_description" text,
	"status" text DEFAULT 'published',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"main_phone" text,
	"line_url" text,
	"google_maps_url" text,
	"facebook_url" text,
	"updated_at" timestamp DEFAULT now()
);
