import { db } from '@/db';
import { admins, siteSettings } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from '../fixtures/constants';

export async function seedDb() {
  console.log('Seeding test database...');
  
  // Seed admin
  const hashedPassword = await bcrypt.hash(TEST_ADMIN_PASSWORD, 10);
  await db.insert(admins).values([
    {
      name: 'E2E Superuser',
      email: TEST_ADMIN_EMAIL, // Keep this as the default global auth user
      password: hashedPassword,
      role: 'superuser',
    },
    {
      name: 'E2E Admin',
      email: 'admin@pcc.local',
      password: hashedPassword,
      role: 'admin',
    }
  ]);

  // Seed default site settings
  await db.insert(siteSettings).values({
    logoUrl: '/logo.png',
    mainPhone: '080-000-0000',
  });

  console.log('Seeding complete.');
}
