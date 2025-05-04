import dotenv from 'dotenv';
dotenv.config();

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VITE_BASE_URL;
const REG_NAME = process.env.TEST_REG_NAME;
const REG_EMAIL = process.env.TEST_REG_EMAIL;
const REG_PASSWORD = process.env.TEST_REG_PASSWORD;

test('should fill in registration form', async ({ page }) => {
  await page.goto(BASE_URL);

  // Vis registreringsskjemaet
  await page.click('#switch-to-register');

  await page.fill('#register-name', REG_NAME);
  await page.fill('#register-email', REG_EMAIL);
  await page.fill('#register-password', REG_PASSWORD);

  await expect(page.locator('#register-name')).toHaveValue(REG_NAME);
  await expect(page.locator('#register-email')).toHaveValue(REG_EMAIL);
  await expect(page.locator('#register-password')).toHaveValue(REG_PASSWORD);
});
