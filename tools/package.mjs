/** Assemble selected runtime archives plus truthful versioned release documents. */
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildBrowser } from './build.mjs';
const platform = process.argv[process.argv.indexOf('--platform') + 1];
if (!['browser', 'all'].includes(platform)) throw new Error('Unsupported package platform: ' + platform);
const { version } = JSON.parse(await fs.readFile('package.json', 'utf8'));
const directory = `dist/${version}`;
await buildBrowser();
const name = `hello-world-${version}-browser.zip`;
execFileSync('python', ['tools/archive.py', 'build/browser', `${directory}/${name}`, 'index.html', 'app.js', 'style.css', 'build-info.json', 'LICENSE'], { stdio: 'inherit' });
await fs.copyFile('docs/INSTALL.md', `${directory}/INSTALL.md`);
const record = JSON.parse(await fs.readFile('build/browser/build-info.json', 'utf8'));
const body = await fs.readFile('docs/VERIFICATION.md', 'utf8');
await fs.writeFile(`${directory}/VERIFICATION.md`, `# Verification record\n\nVersion: ${version}\n\nSource commit: ${record.sourceCommit}\n\nDevelopment build: ${record.developmentBuild}\n\nBuild host: ${process.platform} ${process.arch}; Node ${process.versions.node}.\n\n${body}`);
const checksums = [];
for (const file of [name, 'INSTALL.md', 'VERIFICATION.md'].sort()) {
  const digest = createHash('sha256').update(await fs.readFile(`${directory}/${file}`)).digest('hex');
  checksums.push(`${digest}  ${file}`);
}
await fs.writeFile(`${directory}/SHA256SUMS`, checksums.join('\n') + '\n');
console.log('Packaged candidate ' + directory);
