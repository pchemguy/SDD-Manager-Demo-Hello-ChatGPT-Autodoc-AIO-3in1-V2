/** Run extracted production files at a nested static-host path. */
import { serve } from './server.mjs';
import { launch, finish } from './support.mjs';
const site = await serve('.test-results/extracted-browser');
const { browser, done } = await launch(process.argv[2]);
try {
  const context = await browser.newContext(); context.setDefaultTimeout(5000);
  const page = await context.newPage(); const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto(site.url + '/nested/app/index.html');
  const message = page.locator('[data-hello-message]');
  const text = await message.textContent(); const initial = await message.evaluate(e => getComputedStyle(e).color);
  await page.getByRole('radio', { name: 'blue', exact: true }).check();
  const changed = await message.evaluate(e => getComputedStyle(e).color);
  finish({ text, initial, changed, failures }); await context.close();
} finally { await browser.close(); done(); await site.close(); }
