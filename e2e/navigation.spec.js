import dotenv from 'dotenv';
dotenv.config();

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VITE_BASE_URL;
const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

test('should navigate to first venue', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.fill('#login-email', EMAIL);
  await page.fill('#login-password', PASSWORD);
  await page.click('#login-form button[type="submit"]');

  // Vent på at venue-kortene vises
  await page.waitForSelector('.post-card');

  // Klikk på første venue
  await page.click('.post-card:first-child');

  // Sjekk at detaljer vises
  await expect(
    page.locator('h2').filter({ hasText: 'Innholdsfeed' })
  ).toBeVisible({ timeout: 10000 });
});
