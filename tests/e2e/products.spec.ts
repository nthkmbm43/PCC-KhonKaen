import { test, expect } from '@playwright/test';

test.describe('Products Management', { tag: ['@test.regression'] }, () => {
  
  test('Products CRUD Lifecycle: Create, Edit, Delete', async ({ page }) => {
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const testSlug = `e2e-product-${uniqueId}`;
    const testTitle = `E2E Product ${uniqueId}`;
    
    // 1. CREATE
    await page.goto('/admin/products/new');
    
    await page.getByLabel('ชื่อสินค้าเต็ม (Full Title)').fill(testTitle);
    await page.getByLabel('ชื่อย่อ (Short Title) - แสดงใน Navbar').fill('Test Short');
    await page.getByLabel('URL Slug').fill(testSlug);
    
    // Select category
    await page.getByLabel('หมวดหมู่ (Category)').selectOption('general');

    await page.getByRole('button', { name: /บันทึก/i }).click();

    await page.waitForURL('**/admin/products*');
    await expect(page.getByRole('table')).toContainText(testTitle);

    // 2. EDIT
    const row = page.getByRole('row', { name: testTitle });
    await row.getByRole('link', { name: /แก้ไข|edit/i }).click();
    
    await expect(page).toHaveURL(/.*\/admin\/products\/.+/);
    
    const editTitle = `${testTitle} Edited`;
    await page.getByLabel('ชื่อสินค้าเต็ม (Full Title)').fill(editTitle);
    await page.getByRole('button', { name: /บันทึก/i }).click();

    await page.waitForURL('**/admin/products*');
    await expect(page.getByRole('table')).toContainText(editTitle);

    // 3. DELETE (Cleanup)
    const editedRow = page.getByRole('row', { name: editTitle });
    await editedRow.getByRole('button', { name: /ลบ|delete/i }).click();

    // Click confirm in the AlertDialog
    await page.getByRole('button', { name: /ยืนยันการลบ/i }).click();

    // Wait for the deletion to process
    await expect(page.getByText('ลบสินค้าเรียบร้อยแล้ว')).toBeVisible();

    // Verify it's no longer in the list
    await expect(page.getByRole('table')).not.toContainText(testSlug);
  });
});

