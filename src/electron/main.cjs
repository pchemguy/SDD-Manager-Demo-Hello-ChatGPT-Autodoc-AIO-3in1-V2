/** Own a single local renderer window without exposing Node or an IPC bridge. */
const { app, BrowserWindow, Menu, session } = require('electron');
const path = require('node:path');
let mainWindow = null;
async function createWindow() {
  const window = mainWindow = new BrowserWindow({
    title: 'Hello World', width: 960, height: 600, minWidth: 320, minHeight: 200,
    show: false, backgroundColor: '#f4f6f9',
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true },
  });
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.webContents.on('will-attach-webview', event => event.preventDefault());
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.once('ready-to-show', () => window.show());
  window.on('closed', () => { mainWindow = null; });
  await window.loadFile(path.join(__dirname, 'browser', 'index.html'));
}
app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  await createWindow();
}).catch(error => { console.error('Hello World could not start:', error.message); app.exit(1); });
app.on('window-all-closed', () => app.quit());
