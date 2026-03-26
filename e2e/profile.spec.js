const { test, expect } = require('@playwright/test');
const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = require('./testUser.config');

async function loginViaUI(page) {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(TEST_USER_EMAIL);
  await page.getByLabel('Password').fill(TEST_USER_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/(dashboard|admin)$/, { timeout: 15000 });
}


test('profile tab opens and shows basic info', async ({ page }) => {
  test.skip(
    TEST_USER_EMAIL === 'CHANGE_ME@example.com',
    'Set TEST_USER_EMAIL and TEST_USER_PASSWORD in e2e/testUser.config.js to run this test.'
  );

  await loginViaUI(page);

  // Open Profile from sidebar
  await page.getByRole('button', { name: 'Profile' }).click();

  await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
  // Basic profile info should be visible (name text, not an input label)
  await expect(page.getByText(/Full Name/i)).toBeVisible();
});
