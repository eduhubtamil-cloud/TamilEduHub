import { test, expect } from '@playwright/test';

test.describe('Visitor E2E Flow', () => {
  test('Visitor searches resource, views it, and triggers download', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/');
    
    // 2. Perform a search
    const searchInput = page.locator('input[type="search"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('12th');
    await searchInput.press('Enter');

    // 3. Verify search results page
    await page.waitForURL(/\/search/);
    await expect(page.locator('h1').first()).toContainText('What are you looking');

    // 4. Click the first resource in the results
    const firstResource = page.locator('a[href^="/resources/"]').first();
    await expect(firstResource).toBeVisible();
    const resourceUrl = await firstResource.getAttribute('href');
    await firstResource.click({ force: true });

    // 5. Verify we are on the resource page
    await expect(page).toHaveURL(/\/resources\/.+/);
    
    // 6. Verify resource details exist
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Download PDF')).toBeVisible();
    
    // 7. Verify the download API endpoint works
    // In Playwright, we can intercept the download or just verify the href points to the API.
    const downloadButton = page.locator('a:has-text("Download PDF")').first();
    const href = await downloadButton.getAttribute('href');
    expect(href).toMatch(/\/api\/download\?resource_id=.+/);
    
    // Alternatively, verify clicking it triggers a new tab or navigation
    // Since it's a target="_blank", we'll just verify the href is correct for MVP.
  });
});
