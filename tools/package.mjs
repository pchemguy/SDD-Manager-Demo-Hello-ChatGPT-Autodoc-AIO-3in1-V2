/** Assemble selected runtime archives plus truthful versioned release documents. */
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { packager } from '@electron/packager';
import { buildBrowser, buildElectronInput } from './build.mjs';
const platform = process.argv[process.argv.indexOf('--platform') + 1];
if (!['browser', 'electron', 'all'].includes(platform)) throw new Error('Unsupported package platform: ' + platform);
const { version } = JSON.parse(await fs.readFile('package.json', 'utf8'));
const directory = `dist/${version}`;
await fs.rm(directory, { recursive: true, force: true });
await fs.mkdir(directory, { recursive: true });
const names = [];
if (platform === 'browser' || platform === 'all') {
  await buildBrowser();
  const name = `hello-world-${version}-browser.zip`;
  execFileSync('python', ['tools/archive.py', 'build/browser', `${directory}/${name}`, 'index.html', 'app.js', 'style.css', 'build-info.json', 'LICENSE'], { stdio: 'inherit' });
  names.push(name);
}
if (platform === 'electron' || platform === 'all') {
  await buildElectronInput();
  await fs.mkdir('.tools/packager-temp', { recursive: true });
  const { version: electronVersion } = JSON.parse(await fs.readFile('node_modules/electron/package.json', 'utf8'));
  const [runtime] = await packager({
    dir: path.resolve('build/electron/app'), out: path.resolve('build/electron/runtime'),
    name: 'HelloWorld', executableName: 'HelloWorld', platform: 'win32', arch: 'x64',
    electronVersion, overwrite: true, asar: false, prune: false,
    download: { cacheRoot: path.resolve('.tools/cache/electron') },
    tmpdir: path.resolve('.tools/packager-temp')
  });
  const name = `hello-world-${version}-win32-x64.zip`;
  execFileSync('python', ['tools/archive.py', runtime, `${directory}/${name}`], { stdio: 'inherit' });
  names.push(name);
}
await fs.copyFile('docs/INSTALL.md', `${directory}/INSTALL.md`);
const record = JSON.parse(await fs.readFile('build/browser/build-info.json', 'utf8'));
const body = await fs.readFile('docs/VERIFICATION.md', 'utf8');
await fs.writeFile(`${directory}/VERIFICATION.md`, `# Verification record\n\nVersion: ${version}\n\nSource commit: ${record.sourceCommit}\n\nDevelopment build: ${record.developmentBuild}\n\nBuild host: ${process.platform} ${process.arch}; Node ${process.versions.node}.\n\n${body}`);
const checksums = [];
for (const file of [...names, 'INSTALL.md', 'VERIFICATION.md'].sort()) {
  const digest = createHash('sha256').update(await fs.readFile(`${directory}/${file}`)).digest('hex');
  checksums.push(`${digest}  ${file}`);
}
await fs.writeFile(`${directory}/SHA256SUMS`, checksums.join('\n') + '\n');
console.log('Packaged candidate ' + directory);
