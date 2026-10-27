/** Exercise two fresh contexts, input, screenshot rendering and normal cleanup. */
import { launch, finish, results } from './support.mjs';
import path from 'node:path';
const name = process.argv[2];
const { browser, done } = await launch(name);
const cycles = [];
let color;
try {
  for (let i = 0; i < 2; i++) {
    const context = await browser.newContext({ viewport: { width: 640, height: 360 } });
    context.setDefaultTimeout(5000);
    const page = await context.newPage();
    await page.setContent('<h1 style="color:red">Rendering fixture</h1><button>Change</button><output>ready</output><script>document.querySelector("button").onclick=()=>document.querySelector("output").textContent="changed"</script>');
    await page.getByRole('button', { name: 'Change' }).click();
    cycles.push(await page.locator('output').textContent());
    color = await page.locator('h1').evaluate(e => getComputedStyle(e).color);
    await page.screenshot({ path: path.join(results, `environment-${name}-${i}.png`) });
    await context.close();
  }
  finish({ browser: name, version: browser.version(), cycles, color });
} finally { await browser.close(); done(); }
