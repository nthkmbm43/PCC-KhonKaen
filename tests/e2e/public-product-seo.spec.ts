import { expect, test } from '@playwright/test';

test.describe('Public product SEO and lead journey', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('precast wall page answers search intent and preselects the lead type', async ({ page }) => {
    await page.goto('/products/precast-wall-khon-kaen');

    await expect(page).toHaveTitle(/ผนัง Precast ขอนแก่น/);
    await expect(page.locator('h1')).toContainText('ผนัง Precast ขอนแก่น');
    await expect(page.getByRole('heading', { name: 'เหมาะกับงานแบบไหน' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ราคาขึ้นอยู่กับอะไร' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ข้อมูลที่ควรเตรียมก่อนขอประเมิน' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /ขอประเมินงานผนัง Precast/ })).toBeVisible();
    await expect(page.locator('#contact-project')).toHaveValue('ผนัง Precast (ผนังคอนกรีตสำเร็จรูป)');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://pcc-khon-kaen.vercel.app/products/precast-wall-khon-kaen',
    );

    const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(structuredData.some((value) => value.includes('"@type":"Service"'))).toBeTruthy();
  });

  test('related portfolio links stay inside this website', async ({ page }) => {
    await page.goto('/products/precast-fence-khon-kaen');

    await expect(page.getByRole('heading', { name: 'ดูลักษณะงานก่อนส่งข้อมูลประเมิน' })).toBeVisible();
    const links = await page.locator('a[href*="/portfolio/reference-project-"]').evaluateAll((items) =>
      items.map((item) => (item as HTMLAnchorElement).href),
    );
    const currentOrigin = new URL(page.url()).origin;
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((href) => new URL(href).origin === currentOrigin)).toBeTruthy();
  });

  test('mobile product page has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/products/precast-wall-khon-kaen');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasHorizontalOverflow).toBeFalsy();
    await expect(page.locator('#contact-project')).toBeVisible();
  });
});
