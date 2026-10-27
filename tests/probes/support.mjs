/** Launch only the pinned runner's managed browser in the owned environment. */
import { chromium, firefox } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
export const root = process.cwd();
export const results = path.join(root, '.test-results');
fs.mkdirSync(results, { recursive: true });
export async function launch(name) {
  const options = { headless: true, timeout: 10000 };
  if (name === 'firefox' && process.env.HELLO_FIREFOX_SANDBOX_OVERRIDE === '1') {
    options.env = { ...process.env, MOZ_DISABLE_CONTENT_SANDBOX: '1' };
  }
  const browser = await (name === 'firefox' ? firefox : chromium).launch(options);
  const deadline = setTimeout(() => {
    browser.close().finally(() => process.exit(124));
    setTimeout(() => process.exit(124), 3000).unref();
  }, 70000);
  deadline.unref();
  return { browser, done: () => clearTimeout(deadline) };
}
export function finish(value) { console.log(JSON.stringify(value)); }
