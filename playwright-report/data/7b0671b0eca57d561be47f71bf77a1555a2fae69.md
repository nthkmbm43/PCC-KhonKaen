# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fixtures\auth.setup.ts >> authenticate as admin
- Location: tests\fixtures\auth.setup.ts:10:6

# Error details

```
Error: Failed query: insert into "admins" ("id", "name", "email", "password", "role", "created_at") values (default, $1, $2, $3, $4, default), (default, $5, $6, $7, $8, default)
params: E2E Superuser,admin@example.com,$2b$10$c3wnw6zywlmaNbLPK8qvAOaHL.flQ6yCZRPmufeoEZAVDDyL7vOry,superuser,E2E Admin,admin@pcc.local,$2b$10$c3wnw6zywlmaNbLPK8qvAOaHL.flQ6yCZRPmufeoEZAVDDyL7vOry,admin
```

# Test source

```ts
  1  | import { db } from '@/db';
  2  | import { admins, siteSettings } from '@/db/schema';
  3  | import bcrypt from 'bcryptjs';
  4  | import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from '../fixtures/constants';
  5  | 
  6  | export async function seedDb() {
  7  |   console.log('Seeding test database...');
  8  |   
  9  |   // Seed admin
  10 |   const hashedPassword = await bcrypt.hash(TEST_ADMIN_PASSWORD, 10);
> 11 |   await db.insert(admins).values([
     |   ^ Error: Failed query: insert into "admins" ("id", "name", "email", "password", "role", "created_at") values (default, $1, $2, $3, $4, default), (default, $5, $6, $7, $8, default)
  12 |     {
  13 |       name: 'E2E Superuser',
  14 |       email: TEST_ADMIN_EMAIL, // Keep this as the default global auth user
  15 |       password: hashedPassword,
  16 |       role: 'superuser',
  17 |     },
  18 |     {
  19 |       name: 'E2E Admin',
  20 |       email: 'admin@pcc.local',
  21 |       password: hashedPassword,
  22 |       role: 'admin',
  23 |     }
  24 |   ]);
  25 | 
  26 |   // Seed default site settings
  27 |   await db.insert(siteSettings).values({
  28 |     logoUrl: '/logo.png',
  29 |     mainPhone: '080-000-0000',
  30 |   });
  31 | 
  32 |   console.log('Seeding complete.');
  33 | }
  34 | 
```