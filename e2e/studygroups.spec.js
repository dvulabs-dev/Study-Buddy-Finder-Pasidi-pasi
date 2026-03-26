const { test, expect } = require('@playwright/test');
const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = require('./testUser.config');

// Helper to perform login via the UI using the shared test user
async function loginViaUI(page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  
  await page.getByLabel('Email Address').fill(TEST_USER_EMAIL);
  await page.getByLabel('Password').fill(TEST_USER_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for dashboard sidebar to appear instead of just checking URL
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible({ timeout: 20000 });
}

// Happy-path flow: create a new study group via the wizard

test('user can create a new study group', async ({ page }) => {
  test.skip(
    TEST_USER_EMAIL === 'CHANGE_ME@example.com',
    'Set TEST_USER_EMAIL and TEST_USER_PASSWORD in e2e/testUser.config.js to run this test.'
  );

  await loginViaUI(page);

   // Use a unique suffix each run to avoid name and schedule conflicts
  const unique = Date.now();
  const groupName = `Playwright Test Group ${unique}`;
  const floors = ['3','4','5','6','7','8','9','10','11','12','13','14'];
  const floor = floors[unique % floors.length];
  const labNumber = (unique % 6) + 1; // 1-6
  const lab = `F${floor}0${labNumber}`;

  // Open Study Groups tab from sidebar
  await page.getByRole('button', { name: 'Study Groups' }).click();

  // Open the create group modal
  const newGroupButton = page.getByRole('button', { name: 'New Group' });
  await expect(newGroupButton).toBeVisible({ timeout: 15000 });
  await newGroupButton.click();

  const modal = page.getByRole('dialog', { name: 'Create New Study Group' });
  await expect(modal).toBeVisible();

  // Step 1: Basic Info
  await modal.getByPlaceholder('e.g., Advanced Calculus Study Group').fill(groupName);
  await modal
    .getByPlaceholder('e.g., Mathematics, Physics, Computer Science')
    .fill('Playwright Testing Subject');
  await modal.locator('input[name="maxMembers"]').fill('5');

  await modal.getByRole('button', { name: 'Next' }).click();

  // Step 2: Hall & Image (minimal required fields)
  const selects = modal.locator('select');
  await selects.nth(0).selectOption('New Building');
  await selects.nth(1).selectOption(floor);
  await selects.nth(2).selectOption(lab);

  await modal.getByRole('button', { name: 'Next' }).click();

  // Step 3: Meeting Times - add a default valid time slot
  await modal.getByRole('button', { name: '+ Add Another Time Slot' }).click();

  await modal.getByRole('button', { name: 'Next' }).click();

  // Step 4: Summary - create the group
  await modal.getByRole('button', { name: 'Create Group' }).click();

  // Wait for success feedback or modal to close
  // Sometimes the modal stays but shows success, so check for either
  const successMsg = page.getByText(/study group created successfully/i);
  const groupCreated = page.getByText(groupName);
  
  // Wait for at least one indication of success
  await Promise.race([
    expect(modal).toBeHidden({ timeout: 10000 }),
    expect(successMsg).toBeVisible({ timeout: 10000 }),
  ]).catch(() => {});
  
  // Confirm group appears in the list
  await expect(groupCreated).toBeVisible({ timeout: 15000 });
});
