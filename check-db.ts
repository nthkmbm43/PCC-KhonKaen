import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log("TABLES:", res.rows);
}
check();
