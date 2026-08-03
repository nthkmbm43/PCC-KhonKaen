import { expect, test } from "@playwright/test";

test.describe("Homepage instant render", () => {
  test("shows critical content immediately without a fade delay", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const heading = page.locator("main h1").first();
    await expect(heading).toBeVisible();
    await expect(heading).toHaveCSS("opacity", "1");

    const logo = page.locator('header img[alt="PCC Post-Tension Logo"]');
    await expect(logo).toHaveAttribute("loading", "eager");

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
