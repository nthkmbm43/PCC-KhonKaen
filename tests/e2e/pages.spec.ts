import { test, expect } from '@playwright/test';

test.describe('Pages Management', { tag: ['@test.regression'] }, () => {
  
  test('Pages CRUD Lifecycle: Create, Edit, Delete', async ({ page }) => {
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const testSlug = `e2e-page-${uniqueId}`;
    const testTitle = `E2E Page ${uniqueId}`;
    
    // 1. CREATE
    await page.goto('/admin/pages/new');
    
    // Click Unlock button (wait for it to appear)
    await page.getByRole('button', { name: /ปลดล็อค/i }).click();

    // Fix: We added id and htmlFor, so getByLabel('Title', { exact: true }) now works perfectly.
    await page.getByLabel('Title', { exact: true }).fill(testTitle);
    await page.getByLabel('Slug').fill(testSlug);

    await page.getByRole('button', { name: /บันทึก/i }).click();

    // Confirm dialog
    await page.getByRole('button', { name: /ยืนยัน/i }).click();

    await page.waitForURL('**/admin/pages*');
    await expect(page.getByRole('table')).toContainText(testTitle);

    // 2. EDIT
    const row = page.getByRole('row', { name: testTitle });
    await row.getByRole('link', { name: /แก้ไข|edit/i }).click();
    
    await expect(page).toHaveURL(/.*\/admin\/pages\/.+/);
    
    const editTitle = `${testTitle} Edited`;
    
    // Unconditionally wait for unlock
    await page.getByRole('button', { name: /ปลดล็อค/i }).click();

    await page.getByLabel('Title', { exact: true }).fill(editTitle);
    await page.getByRole('button', { name: /บันทึก/i }).click();

    await page.getByRole('button', { name: /ยืนยัน/i }).click();

    await page.waitForURL('**/admin/pages*');
    await expect(page.getByRole('table')).toContainText(editTitle);

    // 3. DELETE (Cleanup)
    const editedRow = page.getByRole('row', { name: editTitle });
    // Click the Trash button which opens AlertDialog
    await editedRow.getByRole('button', { name: /ลบ|delete|ลบเพจนี้/i }).click();

    // Type the title to confirm
    await page.getByPlaceholder(/พิมพ์/i).fill(editTitle);

    // Click confirm in the AlertDialog
    await page.getByRole('button', { name: /ยืนยันการลบถาวร/i }).click();

    // Wait for the deletion to process
    await expect(page.getByText(`ลบเพจ "${editTitle}" สำเร็จแล้ว`)).toBeVisible();

    await expect(page.getByRole('table')).not.toContainText(testSlug);
  });
});

