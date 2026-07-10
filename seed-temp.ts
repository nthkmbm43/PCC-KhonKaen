import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { GET as seedProducts } from './src/app/api/seed-products/route';
import { GET as seedPages } from './src/app/api/seed-pages/route';

function seedRequest(path: string) {
  return new Request(`http://localhost${path}`, {
    headers: process.env.SEED_SECRET
      ? { authorization: `Bearer ${process.env.SEED_SECRET}` }
      : {},
  });
}

async function main() {
  console.log('Seeding products...');
  const res1 = await seedProducts(seedRequest('/api/seed-products'));
  console.log(await res1.json());
  
  console.log('Seeding pages...');
  const res2 = await seedPages(seedRequest('/api/seed-pages'));
  console.log(await res2.json());
}

main().catch(console.error);
