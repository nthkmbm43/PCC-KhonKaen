import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function resetDb() {
  console.log('Resetting test database...');
  // WARNING: Only use this in the test environment!
  if (!process.env.POSTGRES_URL || !process.env.POSTGRES_URL.includes('test') && !process.env.POSTGRES_URL.includes('neondb')) {
      console.warn('Database URL does not look like a test DB. Proceed with caution!');
  }

  // Clear tables that we touch in E2E tests
  await db.execute(sql`TRUNCATE TABLE products CASCADE;`);
  await db.execute(sql`TRUNCATE TABLE pages CASCADE;`);
  await db.execute(sql`TRUNCATE TABLE site_settings CASCADE;`);
  await db.execute(sql`TRUNCATE TABLE audit_logs CASCADE;`);
  
  // We do NOT truncate admins if we want to keep the test admin, 
  // but it's cleaner to truncate and re-seed it
  await db.execute(sql`TRUNCATE TABLE admins CASCADE;`);
  
  console.log('Database reset complete.');
}
