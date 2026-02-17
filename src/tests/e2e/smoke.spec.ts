import { test, expect } from '@playwright/test';

test.describe('StudentOS E2E Smoke Tests', () => {
  test('app loads and shows dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/StudentOS/);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('navigate to study page', async ({ page }) => {
    await page.goto('/study');
    await expect(page.locator('text=Study Timer')).toBeVisible();
  });

  test('navigate to assignments page and see empty state', async ({ page }) => {
    await page.goto('/assignments');
    await expect(page.locator('text=Assignments & Exams')).toBeVisible();
  });

  test('navigate to settings page', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Privacy')).toBeVisible();
  });

  test('navigate between pages using bottom nav', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Click Study nav
    await page.locator('nav a:has-text("Study")').click();
    await expect(page.locator('text=Study Timer')).toBeVisible();

    // Click Tasks nav
    await page.locator('nav a:has-text("Tasks")').click();
    await expect(page.locator('text=Assignments & Exams')).toBeVisible();
  });
});
