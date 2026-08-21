import { test, expect } from '@playwright/test';

test('product listing exposes product detail navigation when products exist', async ({ page }) => {
  await page.goto('/products');

  const productLinks = page.locator('a[href^="/products/"]');
  const count = await productLinks.count();

  if (count === 0) {
    await expect(page.getByText('محصولی پیدا نشد')).toBeVisible();
    return;
  }

  const firstProductLink = productLinks.first();
  const href = await firstProductLink.getAttribute('href');
  expect(href).toMatch(/^\/products\/[^/]+$/);

  await firstProductLink.click();
  await expect(page).toHaveURL(/\/products\/[^/]+$/);
  await expect(page.locator('body')).toBeVisible();
});

test('product listing search preserves the search query in the URL', async ({ page }) => {
  await page.goto('/products');

  const searchInput = page.locator('input[name="search"]').first();
  await searchInput.fill('کفش');
  await searchInput.press('Enter');

  await expect(page).toHaveURL(/\/products\?[^#]*search=/);
});
