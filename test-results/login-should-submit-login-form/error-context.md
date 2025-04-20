# Test info

- Name: should submit login form
- Location: C:\Users\stel2\Desktop\GitHub\EliasStrand-FED22-JavaScript-2\e2e\login.spec.js:3:5

# Error details

```
Error: Timed out 7000ms waiting for expect(locator).toBeVisible()

Locator: locator('#feed')
Expected: visible
Received: hidden
Call log:
  - expect.toBeVisible with timeout 7000ms
  - waiting for locator('#feed')
    11 × locator resolved to <section id="feed">…</section>
       - unexpected value "hidden"

    at C:\Users\stel2\Desktop\GitHub\EliasStrand-FED22-JavaScript-2\e2e\login.spec.js:14:39
```

# Page snapshot

```yaml
- main:
  - heading "Logg inn" [level=2]
  - textbox "E-post": test@example.com
  - textbox "Passord": hemmelig123
  - button "Logg inn"
  - button "Har du ikke en konto? Registrer deg"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('should submit login form', async ({ page }) => {
   4 |   await page.goto('http://localhost:5174/');
   5 |
   6 |   // Fyll inn login
   7 |   await page.fill('#login-email', 'test@example.com');
   8 |   await page.fill('#login-password', 'hemmelig123');
   9 |
  10 |   // Trykk på login-knappen
  11 |   await page.click('#login-form button[type="submit"]');
  12 |
  13 |   // Vent på at feed vises
> 14 |   await expect(page.locator('#feed')).toBeVisible({ timeout: 7000 });
     |                                       ^ Error: Timed out 7000ms waiting for expect(locator).toBeVisible()
  15 | });
  16 |
```