import { db } from './src/db';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

async function runMigrate() {
  console.log('Running raw SQL to create users table...');
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "password" text NOT NULL,
        "role" text DEFAULT 'admin',
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `);
    console.log('Users table created successfully.');
  } catch (error) {
    console.error('Failed to create users table:', error);
  }
}

runMigrate();
