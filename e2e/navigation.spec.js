import { test, expect } from '@playwright/test'

test('should navigate to first venue', async ({ page }) => {
  await page.goto('http://localhost:5174/')
  await page.fill('#login-email', 'elistr51057@stud.noroff.no')
  await page.fill('#login-password', 'AlfaDelta2604')
  await page.click('#login-form button[type="submit"]')

  // Vent på venues
  await page.waitForSelector('.venue') // Tilpass selector hvis nødvendig

  // Klikk første venue
  await page.click('.venue:first-child')

  // Sjekk at Venue Details vises
  await expect(page.locator('h2')).toContainText('Venue details') // juster tekst etter appen
})
