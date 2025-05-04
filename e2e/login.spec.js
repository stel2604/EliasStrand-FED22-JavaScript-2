import dotenv from 'dotenv';
dotenv.config();

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VITE_BASE_URL;
const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

test('should submit login form', async ({ page }) => {
  await page.goto(BASE_URL);

  // Fyll inn login med ekte bruker
  await page.fill('#login-email', EMAIL);
  await page.fill('#login-password', PASSWORD);

  // Trykk på login-knappen
  await page.click('#login-form button[type="submit"]');

  // Vent på at feed vises
  await expect(page.locator('#feed')).toBeVisible({ timeout: 7000 });
});
