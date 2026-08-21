import { test, expect } from '@playwright/test';

test('storefront loads successfully', async ({ page }) => {
  const response = await page.goto('/');

  expect(response).not.toBeNull();
  expect(response.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator('body')).toBeVisible();
});

test('product discovery page is reachable', async ({ page }) => {
  const response = await page.goto('/products');

  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(500);
  await expect(page.locator('body')).toBeVisible();
});
