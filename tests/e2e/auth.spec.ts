import { test, expect } from '@playwright/test';
import { TEST_ADMIN_EMAIL } from '../fixtures/constants';

test.describe('Authentication Edge Cases', { tag: ['@test.regression', '@test.auth'] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Guest should see error with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Accessibility locators
    await page.getByLabel(/username|ชื่อผู้ใช้/i).fill(TEST_ADMIN_EMAIL);
    await page.getByLabel(/password|รหัสผ่าน/i).fill('wrongpassword');
    await page.getByRole('button', { name: /เข้าสู่ระบบ|login/i }).click();

    // Expect an error toast or message
    await expect(page.getByText(/Username หรือ Password ไม่ถูกต้อง/i)).toBeVisible();
  });
});
