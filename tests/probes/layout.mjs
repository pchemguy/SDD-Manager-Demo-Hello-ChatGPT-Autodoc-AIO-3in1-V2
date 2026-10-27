/** Inspect real viewport geometry, native radio input, focus and CSS zoom. */
import { launch, finish, results } from './support.mjs';
import { serve } from './server.mjs';
import path from 'node:path';
const name = process.argv[2]; const site = await serve('build/browser');
const { browser, done } = await launch(name);
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  context.setDefaultTimeout(5000); const page = await context.newPage(); await page.goto(site.url);
  const geometry = () => page.evaluate(() => {
    const main = document.querySelector('.hello-main').getBoundingClientRect();
    const settings = document.querySelector('.hello-settings').getBoundingClientRect();
    return { center: main.x + main.width / 2, gap: settings.x - main.right,
      mainBottom: main.bottom, settingsTop: settings.y,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      font: parseFloat(getComputedStyle(document.querySelector('[data-hello-message]')).fontSize) };
  });
  const wide = await geometry(); await page.screenshot({ path: path.join(results, `app-${name}-wide.png`) });
  await page.locator('.hello-settings').evaluate(e => e.style.width = '180px');
  const resizedSettingsCenter = (await geometry()).center;
  await page.keyboard.press('Tab'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Space');
  const keyboardColor = await page.locator('input:checked').inputValue();
  const visibleFocus = await page.locator('input:focus').evaluate(e => getComputedStyle(e).outlineStyle !== 'none' && parseFloat(getComputedStyle(e).outlineWidth) > 0);
  await page.setViewportSize({ width: 768, height: 600 });
  await page.locator('.hello-settings').evaluate(e => e.style.width = '');
  const breakpointWide = await geometry();
  await page.setViewportSize({ width: 767, height: 600 });
  const breakpointNarrow = await geometry();
  await page.setViewportSize({ width: 320, height: 480 });
  await page.locator('.hello-settings').evaluate(e => e.style.width = '');
  const narrow = await geometry(); await page.screenshot({ path: path.join(results, `app-${name}-narrow.png`), fullPage: true });
  await page.setViewportSize({ width: 640, height: 480 });
  await page.evaluate(() => document.documentElement.style.zoom = '200%');
  const zoom = await geometry(); await page.screenshot({ path: path.join(results, `app-${name}-zoom.png`), fullPage: true });
  await page.evaluate(() => document.documentElement.style.zoom = '');
  await page.setViewportSize({ width: 1280, height: 160 });
  await page.getByRole('radio', { name: 'green', exact: true }).scrollIntoViewIfNeeded();
  const shortAccessible = await page.getByRole('radio', { name: 'green', exact: true }).isVisible();
  finish({ wide, resizedSettingsCenter, breakpointWide, breakpointNarrow, narrow, zoom, keyboardColor, visibleFocus, shortAccessible });
  await context.close();
} finally { await browser.close(); done(); await site.close(); }
