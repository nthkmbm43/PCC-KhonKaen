# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\pages.spec.ts >> Pages Management >> Pages CRUD Lifecycle: Create, Edit, Delete
- Location: tests\e2e\pages.spec.ts:5:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /ยืนยันการลบถาวร/i })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - link [ref=e5] [cursor=pointer]:
        - /url: /admin
        - img [ref=e8]
        - generic [ref=e9]:
          - paragraph [ref=e10]: PCC Admin
          - paragraph [ref=e11]: ⚡ Superuser
      - navigation [ref=e12]:
        - link [ref=e14] [cursor=pointer]:
          - /url: /admin
          - img [ref=e15]
          - generic [ref=e20]: Dashboard
        - generic [ref=e21]:
          - paragraph [ref=e22]: เว็บไซต์
          - generic [ref=e23]:
            - link [ref=e24] [cursor=pointer]:
              - /url: /admin/pages
              - img [ref=e26]
              - generic [ref=e29]: จัดการเพจ
              - img [ref=e30]
            - link [ref=e32] [cursor=pointer]:
              - /url: /admin/products
              - img [ref=e34]
              - generic [ref=e37]: จัดการสินค้า
            - link [ref=e38] [cursor=pointer]:
              - /url: /admin/media
              - img [ref=e40]
              - generic [ref=e44]: Media Library
        - generic [ref=e45]:
          - paragraph [ref=e46]: การตลาด
          - generic [ref=e47]:
            - link [ref=e48] [cursor=pointer]:
              - /url: /admin/seo
              - img [ref=e50]
              - generic [ref=e54]: SEO
            - link [ref=e55] [cursor=pointer]:
              - /url: /admin/line-marketing
              - img [ref=e57]
              - generic [ref=e59]: LINE OA
        - generic [ref=e60]:
          - paragraph [ref=e61]: ระบบ
          - generic [ref=e62]:
            - link [ref=e63] [cursor=pointer]:
              - /url: /admin/settings
              - img [ref=e65]
              - generic [ref=e68]: ตั้งค่าเว็บไซต์
            - link [ref=e69] [cursor=pointer]:
              - /url: /admin/users
              - img [ref=e71]
              - generic [ref=e76]: ผู้ใช้งาน
      - generic [ref=e77]:
        - button [ref=e78]:
          - img
          - generic [ref=e79]: Publish & Deploy
        - link [ref=e80] [cursor=pointer]:
          - /url: /
          - img [ref=e81]
          - generic [ref=e85]: ดูหน้าเว็บไซต์
    - main [ref=e86]:
      - generic [ref=e87]:
        - generic [ref=e89]: PCC Post-Tension
        - generic [ref=e90]:
          - generic [ref=e91]:
            - paragraph [ref=e92]: E2E Superuser
            - paragraph [ref=e93]: Superuser
          - generic [ref=e94]: E
          - button [ref=e95]:
            - img
      - generic [ref=e98]:
        - generic [ref=e99]:
          - generic [ref=e100]:
            - heading [level=1] [ref=e101]: จัดการเพจ (Pages)
            - paragraph [ref=e102]: สร้าง แก้ไข เนื้อหาหน้าเว็บไซต์และจัดการ SEO
          - link [ref=e103] [cursor=pointer]:
            - /url: /admin/pages/new
            - button [ref=e104]:
              - img
              - text: สร้างเพจใหม่
        - generic [ref=e106]:
          - generic [ref=e107]:
            - img [ref=e108]
            - textbox [ref=e111]:
              - /placeholder: ค้นหาชื่อเพจ หรือ Slug...
          - generic [ref=e112]:
            - combobox [ref=e113]
            - img [ref=e114]
          - generic [ref=e116]:
            - combobox [ref=e117]
            - img [ref=e118]
          - button [ref=e120]: ค้นหา
        - table [ref=e123]:
          - rowgroup [ref=e124]:
            - row [ref=e125]:
              - columnheader [ref=e126]: ชื่อเพจ / URL
              - columnheader [ref=e127]: Template
              - columnheader [ref=e128]: SEO Health
              - columnheader [ref=e129]: Workflow
              - columnheader [ref=e130]: Published
              - columnheader [ref=e131]: Updated By
              - columnheader [ref=e132]: จัดการ
          - rowgroup [ref=e133]:
            - row [ref=e134]:
              - cell [ref=e135]:
                - generic [ref=e136]:
                  - generic [ref=e137]: E2E Page a6141cc5 Edited
                  - generic [ref=e138]: /e2e-page-a6141cc5
              - cell [ref=e139]: default
              - cell [ref=e140]:
                - generic [ref=e141]: 🔴 Missing SEO
              - cell [ref=e142]:
                - generic [ref=e143]: 🟢 Published
              - cell [ref=e144]: "-"
              - cell [ref=e145]:
                - generic [ref=e146]:
                  - generic [ref=e147]: —
                  - generic [ref=e148]: 4/7/2569
              - cell [ref=e149]:
                - generic [ref=e150]:
                  - link [ref=e151] [cursor=pointer]:
                    - /url: /e2e-page-a6141cc5
                    - button [ref=e152]:
                      - img
                  - link [ref=e153] [cursor=pointer]:
                    - /url: /admin/pages/32983bca-bbc9-42ad-94f0-db63adf7c2f4
                    - button [ref=e154]:
                      - img
                  - button [expanded] [ref=e155]:
                    - img
  - alert [ref=e156]: Admin Dashboard | PCC CMS
  - alertdialog "ยืนยันการลบเพจนี้?" [ref=e160]:
    - generic [ref=e161]:
      - generic [ref=e162]:
        - img [ref=e164]
        - heading "ยืนยันการลบเพจนี้?" [level=2] [ref=e166]
      - paragraph [ref=e167]:
        - paragraph [ref=e168]:
          - text: คุณกำลังจะลบเพจ
          - generic [ref=e169]: "\"E2E Page a6141cc5 Edited\""
          - text: แบบถาวร การกระทำนี้ ไม่สามารถกู้คืนได้
        - paragraph [ref=e170]: "เพื่อยืนยัน กรุณาพิมพ์ชื่อเพจด้านล่าง:"
        - generic [ref=e171]:
          - paragraph [ref=e172]: "ชื่อที่ต้องพิมพ์:"
          - paragraph [ref=e173]: E2E Page a6141cc5 Edited
        - textbox "พิมพ์ \"E2E Page a6141cc5 Edited\" เพื่อยืนยัน" [active] [ref=e174]: E2E Page a6141cc5 Edited
    - generic [ref=e175]:
      - button "ยกเลิก" [ref=e176]
      - button "ยืนยันลบถาวร" [ref=e177]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Pages Management', { tag: ['@test.regression'] }, () => {
  4  |   
  5  |   test('Pages CRUD Lifecycle: Create, Edit, Delete', async ({ page }) => {
  6  |     const uniqueId = crypto.randomUUID().slice(0, 8);
  7  |     const testSlug = `e2e-page-${uniqueId}`;
  8  |     const testTitle = `E2E Page ${uniqueId}`;
  9  |     
  10 |     // 1. CREATE
  11 |     await page.goto('/admin/pages/new');
  12 |     
  13 |     // Click Unlock button (wait for it to appear)
  14 |     await page.getByRole('button', { name: /ปลดล็อค/i }).click();
  15 | 
  16 |     // Fix: We added id and htmlFor, so getByLabel('Title', { exact: true }) now works perfectly.
  17 |     await page.getByLabel('Title', { exact: true }).fill(testTitle);
  18 |     await page.getByLabel('Slug').fill(testSlug);
  19 | 
  20 |     await page.getByRole('button', { name: /บันทึก/i }).click();
  21 | 
  22 |     // Confirm dialog
  23 |     await page.getByRole('button', { name: /ยืนยัน/i }).click();
  24 | 
  25 |     await page.waitForURL('**/admin/pages*');
  26 |     await expect(page.getByRole('table')).toContainText(testTitle);
  27 | 
  28 |     // 2. EDIT
  29 |     const row = page.getByRole('row', { name: testTitle });
  30 |     await row.getByRole('link', { name: /แก้ไข|edit/i }).click();
  31 |     
  32 |     await expect(page).toHaveURL(/.*\/admin\/pages\/.+/);
  33 |     
  34 |     const editTitle = `${testTitle} Edited`;
  35 |     
  36 |     // Unconditionally wait for unlock
  37 |     await page.getByRole('button', { name: /ปลดล็อค/i }).click();
  38 | 
  39 |     await page.getByLabel('Title', { exact: true }).fill(editTitle);
  40 |     await page.getByRole('button', { name: /บันทึก/i }).click();
  41 | 
  42 |     await page.getByRole('button', { name: /ยืนยัน/i }).click();
  43 | 
  44 |     await page.waitForURL('**/admin/pages*');
  45 |     await expect(page.getByRole('table')).toContainText(editTitle);
  46 | 
  47 |     // 3. DELETE (Cleanup)
  48 |     const editedRow = page.getByRole('row', { name: editTitle });
  49 |     // Click the Trash button which opens AlertDialog
  50 |     await editedRow.getByRole('button', { name: /ลบ|delete|ลบเพจนี้/i }).click();
  51 | 
  52 |     // Type the title to confirm
  53 |     await page.getByPlaceholder(/พิมพ์/i).fill(editTitle);
  54 | 
  55 |     // Click confirm in the AlertDialog
> 56 |     await page.getByRole('button', { name: /ยืนยันการลบถาวร/i }).click();
     |                                                                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  57 | 
  58 |     // Wait for the deletion to process
  59 |     await expect(page.getByText(`ลบเพจ "${editTitle}" สำเร็จแล้ว`)).toBeVisible();
  60 | 
  61 |     await expect(page.getByRole('table')).not.toContainText(testSlug);
  62 |   });
  63 | });
  64 | 
  65 | 
```