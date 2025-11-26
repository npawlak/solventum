import { test, expect } from '@playwright/test';

test.describe('Multilingual UI', () => {
  const locales = ['en', 'de', 'fr'];

  for (const locale of locales) {
    test(`Home page renders correctly in ${locale}`, async ({ page }) => {
      await page.goto(`/home?lang=${locale}`);

      await expect(page.getByTestId('app-title')).toBeVisible();

      // Ensure that language toggle shows current locale
      await expect(page.getByTestId('language-selector')).toHaveValue(locale);

      // Check a key label has non-empty text
      await expect(page.getByTestId('create-case-button')).not.toHaveText('');
    });
  }
});