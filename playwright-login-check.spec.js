const { test } = require('playwright/test');

test.use({
  channel: 'chrome',
  headless: true,
});

test('capture login failure details', async ({ page }) => {
  const consoleLogs = [];
  const pageErrors = [];
  const failedRequests = [];
  const loginResponses = [];

  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', (error) => {
    pageErrors.push(String(error));
  });

  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? 'unknown'}`);
  });

  page.on('response', async (response) => {
    if (!response.url().includes('/api/auth/login')) {
      return;
    }

    let body = '';
    try {
      body = await response.text();
    } catch {
      body = '<unable to read body>';
    }

    loginResponses.push(`${response.status()} ${response.url()} :: ${body}`);
  });

  await page.goto('http://127.0.0.1:5174/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="email"]').fill('admin@spi.com');
  await page.locator('input[type="password"]').fill('admin123');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForTimeout(4000);

  const errorText = await page.locator('p.text-sm.text-red-600').allInnerTexts().catch(() => []);
  const currentUrl = page.url();
  const localStorageState = await page.evaluate(() => ({
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user'),
  }));

  console.log('CURRENT_URL=', currentUrl);
  console.log('ERROR_TEXT=', JSON.stringify(errorText));
  console.log('LOCAL_STORAGE=', JSON.stringify(localStorageState));
  console.log('LOGIN_RESPONSES=', JSON.stringify(loginResponses, null, 2));
  console.log('FAILED_REQUESTS=', JSON.stringify(failedRequests, null, 2));
  console.log('PAGE_ERRORS=', JSON.stringify(pageErrors, null, 2));
  console.log('CONSOLE_LOGS=', JSON.stringify(consoleLogs, null, 2));

  await page.screenshot({ path: 'playwright-login-check.png', fullPage: true });
});



