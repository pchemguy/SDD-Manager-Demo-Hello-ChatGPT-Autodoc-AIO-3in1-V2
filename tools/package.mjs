/** Assemble deployable runtime archives, never broad repository snapshots. */
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { buildBrowser } from './build.mjs';
const platform = process.argv[process.argv.indexOf('--platform') + 1];
if (platform !== 'browser') throw new Error('Unsupported package platform: ' + platform);
const { version } = JSON.parse(await fs.readFile('package.json', 'utf8'));
await buildBrowser();
const output = `dist/${version}/hello-world-${version}-browser.zip`;
execFileSync('python', ['tools/archive.py', 'build/browser', output, 'index.html', 'app.js', 'style.css', 'build-info.json', 'LICENSE'], { stdio: 'inherit' });
console.log('Packaged ' + output);
