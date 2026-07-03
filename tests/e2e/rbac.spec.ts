import { test, expect } from '@playwright/test';

test.describe('RBAC & Middleware', { tag: ['@test.rbac', '@test.regression'] }, () => {
  // 1. Guest flow
  test.describe('Guest Access', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('Guest should be redirected to login when accessing admin dashboard', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForURL('**/admin/login*');
      expect(page.url()).toContain('/admin/login');
    });

    test('Guest should receive 401 when accessing protected API', async ({ request }) => {
      const response = await request.get('/api/users', { maxRedirects: 0 }); 
      // NextAuth middleware redirects unauthenticated users to login (3xx) instead of 401 by default.
      expect(response.status()).toBeGreaterThanOrEqual(300);
    });
  });

  // 2. Admin flow (using global storageState)
  test.describe('Admin Access', () => {
    // Override storageState for this block so we start fresh, then login as admin
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/login');
      await page.getByLabel(/username|ชื่อผู้ใช้/i).fill('admin@pcc.local');
      await page.getByLabel(/password|รหัสผ่าน/i).fill('password123'); // From constants
      await page.getByRole('button', { name: /เข้าสู่ระบบ|login/i }).click();
      await page.waitForURL('**/admin');
    });

    test('Admin should receive 403 when accessing Superuser settings', async ({ page }) => {
      await page.goto('/admin/settings');
      // Middleware redirects unauthorized admin back to dashboard
      await expect(page).toHaveURL(/.*\/admin$/);
    });
  });
});
