import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { GET as seedProducts } from './src/app/api/seed-products/route';
import { GET as seedPages } from './src/app/api/seed-pages/route';

async function main() {
  console.log('Seeding products...');
  const res1 = await seedProducts();
  console.log(await res1.json());
  
  console.log('Seeding pages...');
  const res2 = await seedPages();
  console.log(await res2.json());
}

main().catch(console.error);
