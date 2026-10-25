import { expect, test } from '@playwright/test';

test('shows only one add button when empty, then counts, resets, removes and saves', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button')).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveText('');
  await page.getByRole('button', { name: 'Add counter', exact: true }).click();
  await expect(page.getByLabel('Counter name')).toBeFocused();
  await page.getByLabel('Counter name').fill('Coffee');
  await page.getByRole('button', { name: 'Create counter' }).click();
  const card = page.getByRole('article', { name: 'Coffee counter' });
  const count = card.getByRole('button', { name: 'Increase Coffee' });
  await expect(count).toHaveText('0');
  await count.click();
  await count.click();
  await expect(count).toHaveText('2');
  await page.reload();
  await expect(count).toHaveText('2');
  await card.getByRole('button', { name: 'Reset Coffee' }).click();
  await expect(count).toHaveText('0');
  await page.reload();
  await expect(count).toHaveText('0');
  await card.getByRole('button', { name: 'Remove Coffee' }).click();
  await expect(card).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('keeps existing counters and resets only the selected one without overflow', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('items', 'Water;Stay hydrated;8|^%Books;Reading;3'));
  await page.goto('/');
  const water = page.getByRole('article', { name: 'Water counter' });
  const books = page.getByRole('article', { name: 'Books counter' });
  await expect(page.getByRole('article')).toHaveCount(2);
  await expect(water.getByRole('button', { name: 'Increase Water' })).toHaveText('8');
  await water.getByRole('button', { name: 'Reset Water' }).click();
  await expect(water.getByRole('button', { name: 'Increase Water' })).toHaveText('0');
  await expect(books.getByRole('button', { name: 'Increase Books' })).toHaveText('3');
  await water.getByRole('button', { name: 'Remove Water' }).click();
  await page.reload();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(books).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('cancels adding with Escape and retains keyboard focus', async ({ page }) => {
  await page.goto('/');
  const add = page.getByRole('button', { name: 'Add counter', exact: true });
  await add.click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(add).toBeFocused();
  await expect(page.getByRole('article')).toHaveCount(0);
});

test('protects invalid saved data', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('counter.workspace.v1', '{"invalid":true}'));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('could not be read');
  await expect(page.getByRole('button', { name: 'Add counter', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('counter.workspace.v1'))).toBe('{"invalid":true}');
});

test('reports a failed save without pretending the counter was created', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Storage is full.', 'QuotaExceededError'); };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Add counter', exact: true }).click();
  await page.getByLabel('Counter name').fill('Unsaved');
  await page.getByRole('button', { name: 'Create counter' }).click();
  await expect(page.getByRole('alert')).toContainText('Storage is full.');
  await expect(page.getByRole('article')).toHaveCount(0);
  await expect(page.getByRole('dialog')).toBeVisible();
});
