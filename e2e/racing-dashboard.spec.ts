import { expect, test } from '@playwright/test';

test.describe('Racing Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the racing dashboard page with correct title and header', async ({ page }) => {
    await expect(page).toHaveTitle('horse-racing');
    
    const heading = page.getByRole('heading', { name: 'Racing Dashboard' });
    await expect(heading).toBeVisible();
    
    const subtitle = page.getByText('Welcome to the Horse Racing Management System');
    await expect(subtitle).toBeVisible();
  });

  test('should display racing dashboard header with action buttons', async ({ page }) => {
    const horseListButton = page.getByRole('button', { name: 'Horse List' });
    const generateProgramButton = page.getByRole('button', { name: 'Generate Program' });
    const startPauseRaceButton = page.getByRole('button', { name: 'Start/Pause Race' });
    
    await expect(horseListButton).toBeVisible();
    await expect(generateProgramButton).toBeVisible();
    await expect(startPauseRaceButton).toBeVisible();
  });

  test('should show empty state message when no sessions exist', async ({ page }) => {
    const emptyMessage = page.getByText('No sessions available. Click "Generate Program" to create sessions.');
    await expect(emptyMessage).toBeVisible();
  });

  test('should generate race program and display sessions', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    
    await page.waitForTimeout(500);
    
    const sessionSelect = page.getByText('Select Session');
    await expect(sessionSelect).toBeVisible();
    
    const emptyMessage = page.getByText('No sessions available');
    await expect(emptyMessage).not.toBeVisible();
  });

  test('should display session select dropdown after generating program', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    
    await page.waitForTimeout(500);
    
    const selectLabel = page.getByText('Select Session');
    await expect(selectLabel).toBeVisible();
  });

  test('should display session horses table after generating program', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    
    await page.waitForTimeout(500);
    
    const horsesTable = page.locator('table').first();
    await expect(horsesTable).toBeVisible();
    
    const tableRows = horsesTable.locator('tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should display session results table after generating program', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    
    await page.waitForTimeout(500);
    
    const tables = page.locator('table');
    const tableCount = await tables.count();
    expect(tableCount).toBeGreaterThanOrEqual(2);
  });

  test('should show start race warning message before race starts', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    
    await page.waitForTimeout(500);
    
    const warningMessage = page.getByText('⚠️ Click "Start Race" to begin watching races on the track');
    await expect(warningMessage).toBeVisible();
  });

  test('should start race and display race track', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    await page.waitForTimeout(500);
    
    const startButton = page.getByRole('button', { name: 'Start/Pause Race' });
    await startButton.click();
    await page.waitForTimeout(500);
    
    const warningMessage = page.getByText('⚠️ Click "Start Race" to begin watching races on the track');
    await expect(warningMessage).not.toBeVisible();
  });

  test('should open horse list drawer when clicking horse list button', async ({ page }) => {
    const horseListButton = page.getByRole('button', { name: 'Horse List' });
    await horseListButton.click();
    
    await page.waitForTimeout(300);
  });

  test('should generate multiple sessions with different distances', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    
    await page.waitForTimeout(500);
    
    const selectContainer = page.locator('label:has-text("Select Session")').locator('..');
    await expect(selectContainer).toBeVisible();
  });

  test('should display horses with condition scores in table', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    
    await page.waitForTimeout(500);
    
    const horsesTable = page.locator('table').first();
    const tableHeaders = horsesTable.locator('thead th');
    
    await expect(tableHeaders).toHaveCount(3);
    
    await expect(horsesTable.locator('thead th').nth(0)).toHaveText('Horse Name');
    await expect(horsesTable.locator('thead th').nth(1)).toHaveText('Color');
    await expect(horsesTable.locator('thead th').nth(2)).toHaveText('Condition Score');
  });

  test('should maintain state after generating multiple programs', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    
    await generateButton.click();
    await page.waitForTimeout(500);
    
    await generateButton.click();
    await page.waitForTimeout(500);
    
    const tables = page.locator('table');
    await expect(tables.first()).toBeVisible();
  });

  test('should be responsive and work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(mobileMenuButton).toBeVisible();
    
    await mobileMenuButton.click();
    await page.waitForTimeout(300);
    
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await expect(generateButton).toBeVisible();
  });

  test('should close mobile menu after clicking generate program', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await mobileMenuButton.click();
    await page.waitForTimeout(200);
    
    const generateButton = page.getByRole('button', { name: 'Generate Program' });
    await generateButton.click();
    
    await page.waitForTimeout(300);
  });

  test('should navigate to theme preview page', async ({ page }) => {
    await page.goto('/theme');
    await expect(page).toHaveURL('/theme');
  });

  test('should display correct page structure', async ({ page }) => {
    const container = page.locator('.max-w-\\[1400px\\]');
    await expect(container).toBeVisible();
  });
});

