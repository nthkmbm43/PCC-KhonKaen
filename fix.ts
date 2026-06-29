import { db } from './src/db';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fix() {
  try {
    console.log("Dropping old products table and recreating...");
    await db.execute(sql`DROP TABLE IF EXISTS products CASCADE`);
    await db.execute(sql`
      CREATE TABLE "products" (
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
    console.log("Products table recreated with correct schema.");
  } catch (error) {
    console.error(error);
  }
}
fix();
