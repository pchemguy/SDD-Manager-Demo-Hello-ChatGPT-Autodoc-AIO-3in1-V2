/** Build platform runtime assets with only explicit production entry points. */
import fs from 'node:fs/promises';
import { build } from 'esbuild';
const platform = process.argv[process.argv.indexOf('--platform') + 1];
if (platform !== 'browser') throw new Error('Unsupported build platform: ' + platform);
await fs.mkdir('build/browser', { recursive: true });
await fs.copyFile('src/browser/index.html', 'build/browser/index.html');
await build({ entryPoints: ['src/browser/main.js'], bundle: true, format: 'esm', outfile: 'build/browser/app.js', target: ['chrome116', 'firefox128'], sourcemap: false });
console.log('Built browser runtime.');
