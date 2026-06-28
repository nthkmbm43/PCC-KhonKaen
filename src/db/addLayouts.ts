import { sql } from '@vercel/postgres';

async function main() {
  try {
    console.log('Adding navbar_links and footer_data to site_settings table...');
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS navbar_links JSONB DEFAULT '[]'::jsonb;`;
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_data JSONB DEFAULT '{}'::jsonb;`;
    console.log('Successfully added layout columns.');
  } catch (err) {
    console.error('Error adding columns:', err);
  }
}

main();
