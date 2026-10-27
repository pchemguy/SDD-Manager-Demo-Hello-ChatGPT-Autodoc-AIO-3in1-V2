/** Execute real host code with only its native Electron boundary modeled. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const windows = [];
let entry, openHandler, permissionHandler, checkHandler, menuRemoved = false, quitCalled = false;
const app = new EventEmitter(); app.whenReady = async () => {}; app.quit = () => { quitCalled = true; }; app.exit = () => {};
class BrowserWindow extends EventEmitter {
  constructor(options) { super(); this.options = options; windows.push(this); this.webContents = new EventEmitter(); this.webContents.setWindowOpenHandler = fn => { openHandler = fn; }; }
  async loadFile(file) { entry = file; this.emit('ready-to-show'); }
  show() {}
}
const electron = { app, BrowserWindow, Menu: { setApplicationMenu(value) { menuRemoved = value === null; } }, session: { defaultSession: {
  setPermissionRequestHandler(fn) { permissionHandler = fn; }, setPermissionCheckHandler(fn) { checkHandler = fn; }
} } };
const directory = path.resolve('build/electron/app');
vm.runInNewContext(fs.readFileSync('src/electron/main.cjs', 'utf8'), { require: name => name === 'electron' ? electron : require(name), __dirname: directory, console, process });
await new Promise(setImmediate);
let navigationPrevented = false, permissionGranted = null, permissionCheck = null;
windows[0]?.webContents.emit('will-navigate', { preventDefault() { navigationPrevented = true; } }, 'https://example.invalid/');
permissionHandler?.({}, 'notifications', value => { permissionGranted = value; });
if (checkHandler) permissionCheck = checkHandler({}, 'geolocation', 'https://example.invalid/', {});
app.emit('window-all-closed');
let rendererVersion = null;
if (entry && fs.existsSync(path.join(path.dirname(entry), 'build-info.json'))) rendererVersion = JSON.parse(fs.readFileSync(path.join(path.dirname(entry), 'build-info.json'))).version;
console.log(JSON.stringify({ windowCount: windows.length, options: windows[0]?.options || {}, menuRemoved, navigationPrevented,
  newWindowAction: openHandler?.({ url: 'https://example.invalid/' })?.action || null, permissionGranted, permissionCheck, quitCalled,
  entryExists: Boolean(entry && fs.existsSync(entry)), localEntry: Boolean(entry && path.resolve(entry) === path.join(directory, 'browser/index.html')), rendererVersion }));
