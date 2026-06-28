import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('Connecting to database and executing SQL migration directly...');
  
  try {
    const migrationSql = readFileSync(resolve(process.cwd(), 'drizzle/0000_square_red_skull.sql'), 'utf-8');
    
    // Split the migration into statements if needed, but Vercel Postgres handles multiple statements
    await sql.query(migrationSql);
    
    console.log('✅ Migration applied successfully! Database is ready.');
  } catch (err) {
    console.error('❌ Error executing migration:', err);
  }
}

main();
