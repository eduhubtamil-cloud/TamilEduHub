const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let hydrationErrors = false;
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().includes('Hydration')) {
      hydrationErrors = true;
    }
  });

  // 1. Fresh browser
  await page.goto('http://localhost:3000');
  const title = await page.title();
  
  // 2. Check default lang is EN
  const defaultHtmlLang = await page.evaluate(() => document.documentElement.lang);
  console.log(`Default Lang: ${defaultHtmlLang}`);

  // 3. Switch to Tamil
  await page.click('button:has-text("EN")');
  await page.click('button:has-text("தமிழ்")');
  
  // Wait for network/navigation
  await page.waitForLoadState('networkidle');
  
  const tamilHtmlLang = await page.evaluate(() => document.documentElement.lang);
  console.log(`Switched Lang: ${tamilHtmlLang}`);
  
  console.log(`Hydration Errors: ${hydrationErrors}`);

  await browser.close();
})();
