import { test, expect } from '@playwright/test'

test.describe('YourPost Webmail Authentication', () => {
  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Should show the public home page with login button
    await expect(page.locator('h1')).toHaveText('YourPost Webmail')
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // Fill in login form
    await page.fill('input[type="email"]', 'admin@yourpost.io')
    await page.fill('input[type="password"]', 'admin123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to inbox
    await page.waitForURL('**/inbox')
    
    // Should show webmail interface
    await expect(page.locator('h1')).toHaveText('YourPost Webmail')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // Fill in login form with wrong password
    await page.fill('input[type="email"]', 'admin@yourpost.io')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('.bg-red-50, .text-red-600')).toBeVisible({ timeout: 5000 })
  })

  test('should load folders after login', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // Login
    await page.fill('input[type="email"]', 'admin@yourpost.io')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/inbox')
    
    // Should show folders (INBOX should exist)
    await expect(page.locator('text=/INBOX/i')).toBeVisible({ timeout: 10000 })
  })
})
