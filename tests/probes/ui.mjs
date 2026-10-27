/** Inspect the built UI and independent live browser documents. */
import { launch, finish } from './support.mjs';
import { serve } from './server.mjs';
const site = await serve(process.env.HELLO_BROWSER_ROOT || 'build/browser');
const { browser, done } = await launch(process.argv[2]);
try {
  const context = await browser.newContext();
  context.setDefaultTimeout(5000);
  const page = await context.newPage();
  await page.goto(site.url);
  const message = page.locator('[data-hello-message]');
  const count = await message.count();
  if (!count) { finish({ messageCount: 0 }); }
  else {
    const initial = { checked: await page.locator('input:checked').inputValue(), color: await message.evaluate(e => getComputedStyle(e).color) };
    const labels = await page.locator('label').allTextContents();
    const transitions = [];
    for (const color of ['blue', 'green', 'red']) {
      await page.getByRole('radio', { name: color, exact: true }).check();
      transitions.push(await message.evaluate(e => getComputedStyle(e).color));
    }
    await page.getByRole('radio', { name: 'green', exact: true }).check();
    const freshPage = await context.newPage(); await freshPage.goto(site.url);
    const fresh = await freshPage.locator('input:checked').inputValue();
    const snapshot = async () => ({
      checked: [await page.locator('input:checked').inputValue(), await freshPage.locator('input:checked').inputValue()],
      colors: [await message.evaluate(e => getComputedStyle(e).color), await freshPage.locator('[data-hello-message]').evaluate(e => getComputedStyle(e).color)]
    });
    const independence = [await snapshot()];
    await freshPage.getByRole('radio', { name: 'blue', exact: true }).check(); independence.push(await snapshot());
    await page.getByRole('radio', { name: 'red', exact: true }).check(); independence.push(await snapshot());
    const checkedCount = await page.locator('input:checked').count();
    const disposedChildren = await page.evaluate(async () => {
      const { mountApplication } = await import('/app.js');
      const root = document.createElement('div');
      const view = mountApplication(root); view.dispose(); return root.childElementCount;
    });
    await page.reload();
    finish({ messageCount: count, text: await message.textContent(), labels, initial, transitions, checkedCount, fresh, independence, disposedChildren, reloaded: await page.locator('input:checked').inputValue() });
    await context.close();
  }
} finally { await browser.close(); done(); await site.close(); }
