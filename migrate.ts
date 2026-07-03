import { db } from './src/db';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

async function runMigrate() {
  console.log('Running raw SQL to create/update tables...');
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "admins" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "password" text NOT NULL,
        "role" text DEFAULT 'admin',
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "admins_email_unique" UNIQUE("email")
      );
    `);
    console.log('Admins table ensured.');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "slug" text NOT NULL,
        "short_title" text NOT NULL,
        "title" text NOT NULL,
        "description" text,
        "content" jsonb DEFAULT '[]',
        "image" text,
        "category" text DEFAULT 'general',
        "is_featured" text DEFAULT 'false',
        "seo_title" text,
        "seo_description" text,
        "seo_keywords" text,
        "og_image" text,
        "status" text DEFAULT 'published',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "products_slug_unique" UNIQUE("slug")
      );
    `);
    console.log('Products table ensured.');

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'DEPLOY', 'UPLOAD');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE audit_resource AS ENUM ('product', 'page', 'user', 'setting', 'upload', 'richmenu', 'deploy');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text,
        "action" audit_action NOT NULL,
        "resource" audit_resource NOT NULL,
        "resource_id" text,
        "before_state" jsonb,
        "after_state" jsonb,
        "ip_address" text,
        "user_agent" text,
        "request_id" text,
        "created_at" timestamp with time zone DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS "audit_user_id_idx" ON "audit_logs" ("user_id");
      CREATE INDEX IF NOT EXISTS "audit_resource_idx" ON "audit_logs" ("resource");
      CREATE INDEX IF NOT EXISTS "audit_resource_id_idx" ON "audit_logs" ("resource_id");
      CREATE INDEX IF NOT EXISTS "audit_action_idx" ON "audit_logs" ("action");
      CREATE INDEX IF NOT EXISTS "audit_created_at_idx" ON "audit_logs" ("created_at");
    `);
    console.log('Audit logs table ensured.');

    // Add new columns to existing tables using DO blocks to avoid errors if they already exist
    await db.execute(sql`
      DO $$
      BEGIN
        BEGIN
          ALTER TABLE "pages" ADD COLUMN "seo_keywords" text;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
        BEGIN
          ALTER TABLE "pages" ADD COLUMN "og_image" text;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
        
        BEGIN
          ALTER TABLE "site_settings" ADD COLUMN "vercel_deploy_hook_url" text;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
        BEGIN
          ALTER TABLE "site_settings" ADD COLUMN "custom_head_code" text;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
        BEGIN
          ALTER TABLE "site_settings" ADD COLUMN "custom_body_code" text;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
        
        -- CMS Epic Features (Media, SEO, Workflow, Revisions)
        
        -- Enums
        BEGIN
          ALTER TYPE audit_action ADD VALUE 'SEARCH';
        EXCEPTION
          WHEN duplicate_object THEN null;
        END;
        BEGIN
          ALTER TYPE audit_action ADD VALUE 'ROLLBACK';
        EXCEPTION
          WHEN duplicate_object THEN null;
        END;
        BEGIN
          ALTER TYPE audit_action ADD VALUE 'GENERATE';
        EXCEPTION
          WHEN duplicate_object THEN null;
        END;
        BEGIN
          ALTER TYPE audit_resource ADD VALUE 'media';
        EXCEPTION
          WHEN duplicate_object THEN null;
        END;
        BEGIN
          ALTER TYPE audit_resource ADD VALUE 'seo';
        EXCEPTION
          WHEN duplicate_object THEN null;
        END;
        BEGIN
          ALTER TYPE audit_resource ADD VALUE 'revision';
        EXCEPTION
          WHEN duplicate_object THEN null;
        END;
        BEGIN
          CREATE TYPE "public"."workflow_state" AS ENUM('draft', 'review', 'published', 'archived');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END;
        BEGIN
          CREATE TYPE "public"."delete_status" AS ENUM('ACTIVE', 'PENDING_DELETE', 'DELETED', 'FAILED');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END;

      END $$;
    `);

    // Tables for CMS Epic
    await db.execute(sql`
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
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "revisions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "resource_type" text NOT NULL,
        "resource_id" uuid NOT NULL,
        "version" integer NOT NULL,
        "data" jsonb NOT NULL,
        "created_by" text,
        "created_at" timestamp with time zone DEFAULT now()
      );
    `);

    await db.execute(sql`
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
    `);
    
    // Columns for workflow
    await db.execute(sql`
      DO $$
      BEGIN
        BEGIN
          ALTER TABLE "pages" ADD COLUMN "workflow_state" "workflow_state" DEFAULT 'published';
        EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN
          ALTER TABLE "pages" ADD COLUMN "preview_token_hash" text;
        EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN
          ALTER TABLE "pages" ADD COLUMN "preview_expires_at" timestamp with time zone;
        EXCEPTION WHEN duplicate_column THEN NULL; END;
        
        BEGIN
          ALTER TABLE "products" ADD COLUMN "workflow_state" "workflow_state" DEFAULT 'published';
        EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN
          ALTER TABLE "products" ADD COLUMN "preview_token_hash" text;
        EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN
          ALTER TABLE "products" ADD COLUMN "preview_expires_at" timestamp with time zone;
        EXCEPTION WHEN duplicate_column THEN NULL; END;

        BEGIN
          ALTER TABLE "media_files" ADD COLUMN "delete_status" "delete_status" DEFAULT 'ACTIVE';
        EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN
          ALTER TABLE "media_files" ADD COLUMN "cleanup_attempts" integer DEFAULT 0;
        EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN
          ALTER TABLE "media_files" ADD COLUMN "last_cleanup_error" text;
        EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN
          ALTER TABLE "media_files" ADD COLUMN "last_cleanup_at" timestamp with time zone;
        EXCEPTION WHEN duplicate_column THEN NULL; END;
      END $$;
    `);

    console.log('Applying CMS Epic indexes...');
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "media_filename_idx" ON "media_files" USING btree ("filename");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "media_alt_idx" ON "media_files" USING btree ("alt");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "media_delete_status_idx" ON "media_files" USING btree ("delete_status");`);
    await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "unique_resource_version_idx" ON "revisions" USING btree ("resource_type", "resource_id", "version");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "seo_resource_idx" ON "seo_metadata" USING btree ("resource_type", "resource_id");`);
    
    // Convert seo_metadata.resource_type to enum and add UNIQUE index
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE seo_resource_type AS ENUM ('page', 'product');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await db.execute(sql`
      ALTER TABLE "seo_metadata" ALTER COLUMN "resource_type" TYPE seo_resource_type USING "resource_type"::text::seo_resource_type;
    `);

    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "seo_unique_resource_idx" ON "seo_metadata" USING btree ("resource_type", "resource_id");
    `);

    console.log('Applying Phase B index optimizations...');
    await db.execute(sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS "pages_created_at_idx" ON "pages" ("created_at" DESC);`);
    await db.execute(sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_status_created_at_idx" ON "products" ("status", "created_at" DESC);`);
    await db.execute(sql`CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_created_at_idx" ON "products" ("created_at" DESC);`);
    console.log('Database updated successfully.');
  } catch (error) {
    console.error('Failed to update database:', error);
  }
}

runMigrate();
