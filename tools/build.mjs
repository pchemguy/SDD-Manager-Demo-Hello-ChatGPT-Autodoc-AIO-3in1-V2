/** Build explicit runtime entries; generated directories contain no source tree. */
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
export async function buildBrowser() {
  await fs.rm('build/browser', { recursive: true, force: true });
  await fs.mkdir('build/browser', { recursive: true });
  await fs.copyFile('src/browser/index.html', 'build/browser/index.html');
  await fs.copyFile('src/ui/app.css', 'build/browser/style.css');
  await fs.copyFile('LICENSE', 'build/browser/LICENSE');
  await build({ entryPoints: ['src/browser/main.js'], bundle: true, format: 'esm', outfile: 'build/browser/app.js', target: ['chrome116', 'firefox128'], sourcemap: false });
  const { version } = JSON.parse(await fs.readFile('package.json', 'utf8'));
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const developmentBuild = Boolean(execFileSync('git', ['status', '--porcelain=v1'], { encoding: 'utf8' }).trim());
  await fs.writeFile('build/browser/build-info.json', JSON.stringify({ version, sourceCommit, developmentBuild }, null, 2) + '\n');
  console.log('Built browser runtime.');
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const platform = process.argv[process.argv.indexOf('--platform') + 1];
  if (platform !== 'browser') throw new Error('Unsupported build platform: ' + platform);
  await buildBrowser();
}
