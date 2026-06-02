const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow, ipcMain, shell, protocol, net } = require('electron');
const local = require('./hapa-local');

app.setName('Hapa Node Space');

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'hapa-asset',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

function registerAssetProtocol() {
  protocol.handle('hapa-asset', request => {
    const url = new URL(request.url);
    const targetPath = decodeURIComponent(url.pathname);
    const resolved = local.assertAllowedPath(targetPath);
    return net.fetch(pathToFileURL(resolved).href);
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1720,
    height: 1040,
    minWidth: 1180,
    minHeight: 760,
    title: 'Hapa Node Space',
    backgroundColor: '#020617',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 18, y: 18 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  window.loadFile(path.join(__dirname, '..', 'site', 'node-space.html'));
  return window;
}

app.whenReady().then(() => {
  registerAssetProtocol();
  ipcMain.handle('hapa:get-context', () => local.getContext());
  ipcMain.handle('hapa:get-music-library', () => local.getMusicLibrary());
  ipcMain.handle('hapa:get-provider-cost-survey', (_event, options) => local.getProviderCostSurvey(options || {}));
  ipcMain.handle('hapa:get-ship-assets', () => local.getShipAssets());
  ipcMain.handle('hapa:create-flow-explainer', (_event, payload) => local.createFlowExplainer(payload));
  ipcMain.handle('hapa:check-services', () => local.checkLocalServices());
  ipcMain.handle('hapa:open-path', async (_event, targetPath) => {
    local.assertAllowedPath(targetPath);
    return shell.openPath(targetPath);
  });
  ipcMain.handle('hapa:show-path', async (_event, targetPath) => {
    local.assertAllowedPath(targetPath);
    shell.showItemInFolder(targetPath);
    return { ok: true };
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
