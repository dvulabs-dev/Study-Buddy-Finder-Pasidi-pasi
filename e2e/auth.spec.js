const { test, expect } = require('@playwright/test');
const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = require('./testUser.config');

// Helper to perform login via the UI
async function loginViaUI(page, { email, password }) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);

  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for dashboard sidebar to appear instead of just checking URL
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible({ timeout: 20000 });
}

// Happy path login test

test('user can log in and see dashboard', async ({ page }) => {
  // Skip if you have not configured test credentials yet
  test.skip(
    TEST_USER_EMAIL === 'CHANGE_ME@example.com',
    'Set TEST_USER_EMAIL and TEST_USER_PASSWORD in e2e/testUser.config.js to run this test.'
  );

  await loginViaUI(page, {
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  // Expect we are on dashboard or admin page
  await expect(page.url()).toMatch(/\/(dashboard|admin)$/);

  // Basic smoke assertion: dashboard sidebar is visible
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
});

// Invalid credentials test

test('shows error message for invalid credentials', async ({ page }) => {
  await page.goto('/login');

  // Use invalid email format to trigger client-side validation
  await page.getByLabel('Email Address').fill('not-an-email');
  await page.getByLabel('Password').fill('short');

  await page.getByRole('button', { name: 'Sign in' }).click();

  // Expect the validation error message to appear
  await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();
});
