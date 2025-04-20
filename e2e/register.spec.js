import { test, expect } from '@playwright/test'

test('should fill in registration form', async ({ page }) => {
  await page.goto('http://localhost:5174/')

  // Vis registreringsskjemaet
  await page.click('#switch-to-register')

  await page.fill('#register-name', 'Testbruker')
  await page.fill('#register-email', 'test@example.com')
  await page.fill('#register-password', 'hemmelig123')

  await expect(page.locator('#register-name')).toHaveValue('Testbruker')
  await expect(page.locator('#register-email')).toHaveValue('test@example.com')
  await expect(page.locator('#register-password')).toHaveValue('hemmelig123')
})
