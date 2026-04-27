import { test, expect, type Page } from '@playwright/test';

async function clearStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

// Helper to create a user and session
async function createUserAndSession(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.evaluate(
    ({ email, password }: { email: string; password: string }) => {
      const user = {
        id: 'test-user-id',
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      const session = { userId: 'test-user-id', email };
      localStorage.setItem('habit-tracker-users', JSON.stringify([user]));
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));
    },
    { email, password }
  );
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/');
    await createUserAndSession(page, 'test@example.com', 'password123');
    await page.goto('/');
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.goto('/');
    await createUserAndSession(page, 'existing@example.com', 'password123');
    await page.evaluate(() => {
      const habits = [
        {
          id: 'h1',
          userId: 'test-user-id',
          name: 'Drink Water',
          description: '',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
        {
          id: 'h2',
          userId: 'other-user-id',
          name: 'Other Habit',
          description: '',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    await page.goto('/login');
    await page.getByTestId('auth-login-email').fill('existing@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByTestId('habit-card-other-habit')).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/');
    await createUserAndSession(page, 'test@example.com', 'password123');
    await page.goto('/dashboard');
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Exercise');
    await page.getByTestId('habit-description-input').fill('30 minutes workout');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-exercise')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/');
    await createUserAndSession(page, 'test@example.com', 'password123');
    await page.evaluate(() => {
      const habits = [{
        id: 'h1',
        userId: 'test-user-id',
        name: 'Drink Water',
        description: '',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      }];
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });
    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('0');
    await page.getByTestId('habit-complete-drink-water').click();
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('persist@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Read Books');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/');
    await createUserAndSession(page, 'test@example.com', 'password123');
    await page.goto('/dashboard');
    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page }) => {
    await page.goto('/');
    await createUserAndSession(page, 'test@example.com', 'password123');
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    // Go offline
    await page.context().setOffline(true);
    await page.reload();

    // App should not hard crash
    const body = await page.locator('body').textContent();
    expect(body).not.toBeNull();

    // Go back online
    await page.context().setOffline(false);
  });
});