import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('AI Case Recommendation – Smoke @smoke', () => {
  test('Clinician can view and override AI recommendation', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('clinician_de', 'Password123!');
    await login.assertLoggedIn();

    await page.getByTestId('nav-cases').click();
    await page.getByRole('row', { name: /Case-12345/ }).click();

    // Check AI recommendation is visible
    const aiPanel = page.getByTestId('ai-recommendation-panel');
    await expect(aiPanel).toBeVisible();
    await expect(aiPanel.getByTestId('ai-risk-level')).toHaveText(/high|medium|low/i);

    // Clinician overrides recommendation
    await page.getByTestId('override-button').click();
    await page.getByTestId('override-reason').fill('Clinical judgement differs from AI');
    await page.getByTestId('override-confirm').click();

    // Verify override recorded
    await expect(page.getByTestId('override-badge')).toHaveText(/Overridden by clinician/i);
    await expect(page.getByTestId('audit-entry-latest')).toContainText('Overridden by clinician');
  });
});