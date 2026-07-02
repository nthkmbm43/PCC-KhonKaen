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
      END $$;
    `);
    console.log('Database updated successfully.');
  } catch (error) {
    console.error('Failed to update database:', error);
  }
}

runMigrate();
