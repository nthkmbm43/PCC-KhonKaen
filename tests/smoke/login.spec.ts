import { test, expect } from '@playwright/test';
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from '../fixtures/constants';

test.describe.skip('Login Smoke Test', { tag: ['@test.smoke', '@test.auth'] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Guest should be able to login with valid credentials via UI', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Using Accessibility locators as requested by PA
    await page.getByLabel(/username|ชื่อผู้ใช้/i).fill(TEST_ADMIN_EMAIL);
    await page.getByLabel(/password|รหัสผ่าน/i).fill(TEST_ADMIN_PASSWORD);
    await page.getByRole('button', { name: /เข้าสู่ระบบ|login/i }).click();

    await page.waitForURL('**/admin*');
    
    // Expect logout button to be visible
    await expect(page.getByRole('button', { name: /ออกจากระบบ|logout/i }).first()).toBeVisible();
  });
});
