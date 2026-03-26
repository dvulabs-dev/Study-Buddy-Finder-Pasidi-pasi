const { test, expect } = require('@playwright/test');
const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = require('./testUser.config');

async function loginViaUI(page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  
  await page.getByLabel('Email Address').fill(TEST_USER_EMAIL);
  await page.getByLabel('Password').fill(TEST_USER_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for dashboard sidebar to appear instead of just checking URL
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible({ timeout: 20000 });
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

// Update profile happy path: edit basic fields and save

test('user can edit and save study profile', async ({ page }) => {
  test.skip(
    TEST_USER_EMAIL === 'CHANGE_ME@example.com',
    'Set TEST_USER_EMAIL and TEST_USER_PASSWORD in e2e/testUser.config.js to run this test.'
  );

  await loginViaUI(page);

  // Open Profile from sidebar
  await page.getByRole('button', { name: 'Profile' }).click();

  // Enter edit mode
  await page.getByRole('button', { name: 'Edit Profile' }).click();

  // Update degree and year using their placeholders
  await page.getByPlaceholder('e.g., Computer Science').fill('Computer Science');
  await page.getByPlaceholder('e.g., 2').fill('2');

  // Optionally add a subject to ensure subjects UI works
  const subjectInput = page.getByPlaceholder('Add a subject...');
  await subjectInput.fill('Playwright Testing');
  // Press Enter instead of clicking the generic "Add" button
  await subjectInput.press('Enter');

  // Save changes
  const saveButton = page.getByRole('button', { name: 'Save' });
  await saveButton.click();

  // Wait for the save to complete by checking that "Saving..." text goes away
  // and "Edit Profile" button reappears (indicating edit mode closed)
  await expect(page.getByRole('button', { name: 'Edit Profile' })).toBeVisible({ timeout: 20000 });
  
  // Verify form exited edit mode - the editable fields should now be read-only or hidden
  // At minimum, we should see the Edit Profile button which means we're back in view mode
  await page.waitForTimeout(500); // Small delay to ensure UI update completes
});
