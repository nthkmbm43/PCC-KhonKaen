import { config } from 'dotenv';
import { db } from './src/db/index';
import { siteSettings } from './src/db/schema';

config({ path: '.env.local' });

async function main() {
  const res = await db.select().from(siteSettings).limit(1);
  console.log("DB customHeadCode:", res[0]?.customHeadCode);
  process.exit(0);
}
main().catch(console.error);
