import { test, expect } from '@playwright/test';

test.describe.serial('Settings Management', { tag: ['@test.regression'] }, () => {
  test('Should be able to update site settings', async ({ page }) => {
    await page.goto('/admin/settings');
    
    // Check if the page loaded using accessible roles
    await expect(page.getByRole('heading', { name: /ตั้งค่าเว็บไซต์|Settings/i, exact: true })).toBeVisible();

    const testPhone = `080-${Date.now().toString().slice(-7)}`;
    
    // Unlock for editing
    await page.getByRole('button', { name: /ปลดล็อค|Unlock/i }).click();
    
    const phoneInput = page.getByLabel('เบอร์โทรศัพท์หลัก');
    await phoneInput.fill(testPhone);
    
    await page.getByRole('button', { name: /บันทึกการตั้งค่า|Save/i }).click();

    // Confirm dialog
    await page.getByRole('button', { name: /ยืนยันการบันทึก|Confirm/i }).click();

    // Wait for success toast or indicator
    await expect(page.getByText('บันทึกการตั้งค่าเรียบร้อยแล้ว!')).toBeVisible();

    // Reload the page and verify the value persisted
    await page.reload();
    
    await expect(page.getByLabel('เบอร์โทรศัพท์หลัก')).toHaveValue(testPhone);
  });
});
