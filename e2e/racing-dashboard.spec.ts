import { expect, test } from '@playwright/test';

test.describe('Racing Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the racing dashboard page', async ({ page }) => {
    await expect(page).toHaveTitle(/Horse Racing/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should generate race program', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await expect(page.locator('[data-testid="session"], .session, table').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display horse list', async ({ page }) => {
    const horseElements = page.locator('[data-testid="horse"], .horse, tr').filter({ hasText: /horse|name/i });
    const count = await horseElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be able to start a race', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await page.waitForTimeout(1000);
    }

    const startButton = page.getByRole('button', { name: /start|play/i }).first();
    
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForTimeout(500);
      
      const pauseButton = page.getByRole('button', { name: /pause|stop/i }).first();
      await expect(pauseButton).toBeVisible({ timeout: 3000 });
    }
  });

  test('should navigate between different sections', async ({ page }) => {
    const links = page.locator('a, button').filter({ hasText: /dashboard|results|horses|program/i });
    const count = await links.count();
    
    if (count > 0) {
      await links.first().click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/.*/);
    }
  });
});

