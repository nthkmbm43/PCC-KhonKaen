import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  const res = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'`;
  console.log("COLUMNS:", res.rows);
}
check();
