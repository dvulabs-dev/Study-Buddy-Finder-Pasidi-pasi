const { test, expect } = require('@playwright/test');
const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = require('./testUser.config');

// Helper: ensure logged-out state by clearing storage
async function clearAuthState(page) {
  await page.goto('/');
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  });
}

// Helper: login via UI with provided credentials
async function loginViaUI(page, { email, password }) {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/(dashboard|admin)$/, { timeout: 15000 });
}

// Unauthenticated users should be redirected from /dashboard to /login

test('unauthenticated user is redirected from /dashboard to /login', async ({ page }) => {
  await clearAuthState(page);

  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
});

// Authenticated user can access /dashboard

test('authenticated user can access /dashboard', async ({ page }) => {
  test.skip(
    TEST_USER_EMAIL === 'CHANGE_ME@example.com',
    'Set TEST_USER_EMAIL and TEST_USER_PASSWORD in e2e/testUser.config.js to run this test.'
  );

  await clearAuthState(page);
  await loginViaUI(page, { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });

  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/dashboard$/);
});
