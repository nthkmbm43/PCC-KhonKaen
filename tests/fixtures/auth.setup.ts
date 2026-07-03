import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { resetDb } from '../seed/reset';
import { seedDb } from '../seed/seed';
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from './constants';

const authFile = path.join(__dirname, '../../playwright/.auth/admin.json');

setup('authenticate as admin', async ({ page }) => {
  // 1. Reset and Seed Database
  await resetDb();
  await seedDb();

  // 2. Ensure the .auth directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Go to the login page
  await page.goto('/admin/login');

  // Fill in credentials using accessible locators
  await page.getByLabel(/username|ชื่อผู้ใช้/i).fill(TEST_ADMIN_EMAIL);
  await page.getByLabel(/password|รหัสผ่าน/i).fill(TEST_ADMIN_PASSWORD);
  await page.getByRole('button', { name: /เข้าสู่ระบบ/i }).click();

  // Wait until the page redirects to the admin dashboard
  await page.waitForURL('/admin', { timeout: 10000 });
  
  // Verify successful login by checking for a known admin element
  await expect(page.getByTitle(/ออกจากระบบ/)).toBeVisible();

  // Save the authentication state to the authFile
  await page.context().storageState({ path: authFile });
});
