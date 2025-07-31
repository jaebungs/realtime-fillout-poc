import { test, expect } from '@playwright/test';

test('3 users concurrently add ShortAnswerInput', async ({ browser }) => {
  const urls = ['user1', 'user2', 'user3'];
  const pages = await Promise.all(
    urls.map(() => browser.newContext().then(ctx => ctx.newPage()))
  );

  // Open all pages to the same app
  await Promise.all(
    pages.map(page => page.goto('http://localhost:3000/'))
  );

  // Wait for WebSocket connection to be ready (can be replaced with event listener)
  await pages[0].waitForTimeout(500);

  // Simulate each user clicking "Add Short Answer"
  await Promise.all(
    pages.map(page =>
      page.getByTestId('add-short-answer').click()
    )
  );

  // Wait briefly for WebSocket sync to propagate
  await pages[0].waitForTimeout(1000);

  // Verify each user sees 3 form components
  for (const page of pages) {
    const count = await page.getByTestId('short-answer-component').count();
    expect(count).toBe(3);
  }
});
