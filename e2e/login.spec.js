import { test, expect } from '@playwright/test'

test('should submit login form', async ({ page }) => {
  await page.goto('http://localhost:5174/')

  // Fyll inn login med ekte bruker
  await page.fill('#login-email', 'elistr51057@stud.noroff.no')
  await page.fill('#login-password', 'AlfaDelta2604')

  // Trykk på login-knappen
  await page.click('#login-form button[type="submit"]')

  // Vent på at feed vises
  await expect(page.locator('#feed')).toBeVisible({ timeout: 7000 })
})
