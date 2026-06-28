import { sql } from '@vercel/postgres';

async function main() {
  try {
    console.log('Adding logo_url to site_settings table...');
    await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;`;
    console.log('Successfully added logo_url column.');
  } catch (err) {
    console.error('Error adding column:', err);
  }
}

main();
