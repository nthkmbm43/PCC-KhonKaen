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
              - generic [ref=e32]: จัดการเพจ
              - img [ref=e33]
            - link [ref=e35] [cursor=pointer]:
              - /url: /admin/products
              - img [ref=e37]
              - generic [ref=e41]: จัดการสินค้า
            - link [ref=e42] [cursor=pointer]:
              - /url: /admin/media
              - img [ref=e44]
              - generic [ref=e48]: Media Library
        - generic [ref=e49]:
          - paragraph [ref=e50]: การตลาด
          - generic [ref=e51]:
            - link [ref=e52] [cursor=pointer]:
              - /url: /admin/seo
              - img [ref=e54]
              - generic [ref=e58]: SEO
            - link [ref=e59] [cursor=pointer]:
              - /url: /admin/line-marketing
              - img [ref=e61]
              - generic [ref=e63]: LINE OA
        - generic [ref=e64]:
          - paragraph [ref=e65]: ระบบ
          - generic [ref=e66]:
            - link [ref=e67] [cursor=pointer]:
              - /url: /admin/settings
              - img [ref=e69]
              - generic [ref=e72]: ตั้งค่าเว็บไซต์
            - link [ref=e73] [cursor=pointer]:
              - /url: /admin/users
              - img [ref=e75]
              - generic [ref=e80]: ผู้ใช้งาน
      - generic [ref=e81]:
        - button [ref=e82]:
          - img
          - generic [ref=e83]: Publish & Deploy
        - link [ref=e84] [cursor=pointer]:
          - /url: /
          - img [ref=e85]
          - generic [ref=e89]: ดูหน้าเว็บไซต์
    - main [ref=e90]:
      - generic [ref=e91]:
        - generic [ref=e93]: PCC Post-Tension
        - generic [ref=e94]:
          - generic [ref=e95]:
            - paragraph [ref=e96]: E2E Superuser
            - paragraph [ref=e97]: Superuser
          - generic [ref=e98]: E
          - button [ref=e99]:
            - img
      - generic [ref=e102]:
        - generic [ref=e103]:
          - generic [ref=e104]:
            - heading [level=1] [ref=e105]: จัดการเพจ (Pages)
            - paragraph [ref=e106]: สร้าง แก้ไข เนื้อหาหน้าเว็บไซต์และจัดการ SEO
          - link [ref=e107] [cursor=pointer]:
            - /url: /admin/pages/new
            - button [ref=e108]:
              - img
              - text: สร้างเพจใหม่
        - generic [ref=e110]:
          - generic [ref=e111]:
            - img [ref=e112]
            - textbox [ref=e115]:
              - /placeholder: ค้นหาชื่อเพจ หรือ Slug...
          - generic [ref=e116]:
            - combobox [ref=e117]
            - img [ref=e118]
          - generic [ref=e120]:
            - combobox [ref=e121]
            - img [ref=e122]
          - button [ref=e124]: ค้นหา
        - table [ref=e127]:
          - rowgroup [ref=e128]:
            - row [ref=e129]:
              - columnheader [ref=e130]: ชื่อเพจ / URL
              - columnheader [ref=e131]: Template
              - columnheader [ref=e132]: SEO Health
              - columnheader [ref=e133]: Workflow
              - columnheader [ref=e134]: Published
              - columnheader [ref=e135]: Updated By
              - columnheader [ref=e136]: จัดการ
          - rowgroup [ref=e137]:
            - row [ref=e138]:
              - cell [ref=e139]:
                - generic [ref=e140]:
                  - generic [ref=e141]: E2E Page ceec8d64 Edited
                  - generic [ref=e142]: /e2e-page-ceec8d64
              - cell [ref=e143]: default
              - cell [ref=e144]:
                - generic [ref=e145]: 🔴 Missing SEO
              - cell [ref=e146]:
                - generic [ref=e147]: 🟢 Published
              - cell [ref=e148]: "-"
              - cell [ref=e149]:
                - generic [ref=e150]:
                  - generic [ref=e151]: —
                  - generic [ref=e152]: 4/7/2569
              - cell [ref=e153]:
                - generic [ref=e154]:
                  - link [ref=e155] [cursor=pointer]:
                    - /url: /e2e-page-ceec8d64
                    - button [ref=e156]:
                      - img
                  - link [ref=e157] [cursor=pointer]:
                    - /url: /admin/pages/2f693347-77e1-4216-ab19-a4078da0f7d3
                    - button [ref=e158]:
                      - img
                  - button [expanded] [ref=e159]:
                    - img
            - row [ref=e160]:
              - cell [ref=e161]:
                - generic [ref=e162]:
                  - generic [ref=e163]: Test SEO Sync
                  - generic [ref=e164]: /test-seo-sync-1783134996041
              - cell [ref=e165]: default
              - cell [ref=e166]:
                - generic [ref=e167]: 🟡 Missing OG Image +1
              - cell [ref=e168]:
                - generic [ref=e169]: 🟢 Published
              - cell [ref=e170]: "-"
              - cell [ref=e171]:
                - generic [ref=e172]:
                  - generic [ref=e173]: —
                  - generic [ref=e174]: 4/7/2569
              - cell [ref=e175]:
                - generic [ref=e176]:
                  - link [ref=e177] [cursor=pointer]:
                    - /url: /test-seo-sync-1783134996041
                    - button [ref=e178]:
                      - img
                  - link [ref=e179] [cursor=pointer]:
                    - /url: /admin/pages/f7e5049b-b4c5-4451-9556-b2d62e8d1163
                    - button [ref=e180]:
                      - img
                  - button [ref=e181]:
                    - img
            - row [ref=e182]:
              - cell [ref=e183]:
                - generic [ref=e184]:
                  - generic [ref=e185]: E2E Page a6141cc5 Edited
                  - generic [ref=e186]: /e2e-page-a6141cc5
              - cell [ref=e187]: default
              - cell [ref=e188]:
                - generic [ref=e189]: 🔴 Missing SEO
              - cell [ref=e190]:
                - generic [ref=e191]: 🟢 Published
              - cell [ref=e192]: "-"
              - cell [ref=e193]:
                - generic [ref=e194]:
                  - generic [ref=e195]: —
                  - generic [ref=e196]: 4/7/2569
              - cell [ref=e197]:
                - generic [ref=e198]:
                  - link [ref=e199] [cursor=pointer]:
                    - /url: /e2e-page-a6141cc5
                    - button [ref=e200]:
                      - img
                  - link [ref=e201] [cursor=pointer]:
                    - /url: /admin/pages/32983bca-bbc9-42ad-94f0-db63adf7c2f4
                    - button [ref=e202]:
                      - img
                  - button [ref=e203]:
                    - img
  - alert [ref=e204]: Admin Dashboard | PCC CMS
  - alertdialog "ยืนยันการลบเพจนี้?" [ref=e208]:
    - generic [ref=e209]:
      - generic [ref=e210]:
        - img [ref=e212]
        - heading "ยืนยันการลบเพจนี้?" [level=2] [ref=e216]
      - paragraph [ref=e217]:
        - paragraph [ref=e218]:
          - text: คุณกำลังจะลบเพจ
          - generic [ref=e219]: "\"E2E Page ceec8d64 Edited\""
          - text: แบบถาวร การกระทำนี้ ไม่สามารถกู้คืนได้
        - paragraph [ref=e220]: "เพื่อยืนยัน กรุณาพิมพ์ชื่อเพจด้านล่าง:"
        - generic [ref=e221]:
          - paragraph [ref=e222]: "ชื่อที่ต้องพิมพ์:"
          - paragraph [ref=e223]: E2E Page ceec8d64 Edited
        - textbox "พิมพ์ \"E2E Page ceec8d64 Edited\" เพื่อยืนยัน" [active] [ref=e224]: E2E Page ceec8d64 Edited
    - generic [ref=e225]:
      - button "ยกเลิก" [ref=e226]
      - button "ยืนยันลบถาวร" [ref=e227]
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