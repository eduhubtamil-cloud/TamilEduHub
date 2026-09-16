import { test, expect } from '@playwright/test';

// Use a unique suffix to avoid collisions if tests are run multiple times
const testUserEmail = `testuser_${Date.now()}@example.com`;
const testPassword = 'Password123!';

test.describe('Authenticated User E2E Flow', () => {
  test('User registers, logs in, bookmarks a resource, and views it in dashboard', async ({ page }) => {
    
    // 1. Register a new user
    await page.goto('/account/register');
    await page.fill('input[name="fullName"]', 'Playwright Tester');
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to profile
    await page.waitForURL(/\/account\/profile/);

    // 2. Go to resources page and click the first resource
    await page.goto('/resources');
    const firstResource = page.locator('a[href^="/resources/"]').first();
    await expect(firstResource).toBeVisible();
    await firstResource.click({ force: true });

    // 3. Bookmark the resource
    // The bookmark button should have a specific text or title
    const bookmarkButton = page.locator('button[title="Add Bookmark"], button[title="Remove Bookmark"]').first();
    if (await bookmarkButton.count() > 0) {
      await bookmarkButton.click();
      // Wait for the button state to change to "Saved" or similar (if applicable)
      await page.waitForTimeout(1000); // Wait for server action
    }

    // 4. View bookmark in dashboard
    await page.goto('/account/bookmarks');
    await expect(page.locator('h1')).toContainText('My Bookmarks');
    
    // Ensure there is at least one bookmarked item
    const bookmarkedItems = page.locator('.grid > div'); // Adjust selector based on actual card grid
    await expect(bookmarkedItems.first()).toBeVisible();
  });
});
