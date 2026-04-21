import { test, expect } from '@playwright/test';

test.describe('Signup to Studio Flow', () => {
  test('Complete onboarding journey using Swarm seed credentials', async ({ page }) => {
    // 1. Navigate to the login page to establish initial routing state
    const testEmail = `swarm-starter-${Date.now()}@phoo.ai`;
    const testPassword = 'test1234SecurePassword';

    await page.goto('/auth/login');

    // Wait until React mounts the window injection
    await page.waitForFunction(() => (window as any).__E2E_SIGN_IN__ !== undefined);

    // 2. Fire the backend test provider backdoor
    await page.evaluate(async ({ email, password }) => {
       await (window as any).__E2E_SIGN_IN__('password', {
         email,
         password,
         flow: 'signIn'
       });
    }, { email: testEmail, password: testPassword });

    // 3. Let Convex spin, auth, run the Swarm Seeder mutation recursively, and redirect
    await page.waitForURL(/\/(onboarding|studio)/, { timeout: 15000 }).catch(() => {
        // We will catch and assert exactly what failed below
    });

    const isStudio = page.url().includes('/studio');
    const isOnboarding = page.url().includes('/onboarding');
    
    expect(isStudio || isOnboarding).toBeTruthy();
  });
});
