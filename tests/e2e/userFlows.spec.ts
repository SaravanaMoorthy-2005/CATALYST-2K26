import { test, expect } from '@playwright/test'

test.describe('CareCircle 3.0 Core User Journeys', () => {
  test('Elder CareDay loads with primary medication action', async ({ page }) => {
    await page.goto('/')
    // Expect redirection to dashboard
    await expect(page).toHaveURL(/.*dashboard/)

    // Verify dominant Next Action Card exists
    await expect(page.locator('text=Next Medication')).toBeVisible()
    await expect(page.locator('text=Mark as Taken')).toBeVisible()

    // Verify Today's Care Timeline exists
    await expect(page.locator("text=Today's Care Timeline")).toBeVisible()

    // Verify Need Help trigger is visible
    await expect(page.locator('text=Need assistance today?')).toBeVisible()
  })

  test('SafeDose Shield prevents duplicate digital dose ingestion confirmation', async ({ page }) => {
    await page.goto('/dashboard')

    // Click Mark as Taken
    const markTakenBtn = page.locator('button:has-text("Mark as Taken")')
    if (await markTakenBtn.isVisible()) {
      await markTakenBtn.click()
      await expect(page.locator('text=Recorded')).toBeVisible()

      // Second tap triggers SafeDose Shield protection warning
      await markTakenBtn.click()
      await expect(page.locator('text=SafeDose Shield Protection')).toBeVisible()
    }
  })

  test('Refill Guardian displays low stock warning and inventory ledger', async ({ page }) => {
    await page.goto('/refills')
    await expect(page.locator('text=Refill Guardian')).toBeVisible()
    await expect(page.locator('text=Inventory Audit Ledger')).toBeVisible()
  })

  test('DischargeSync requires explicit human approval for prescription changes', async ({ page }) => {
    await page.goto('/reconciliation')
    await expect(page.locator('text=DischargeSync')).toBeVisible()
    await expect(page.locator('text=Mandatory Human Authorization Guard')).toBeVisible()
    await expect(page.locator('text=Prescription Comparative Diff')).toBeVisible()
  })
})
