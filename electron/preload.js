const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hapaNodeSpace', {
  desktop: true,
  getContext: () => ipcRenderer.invoke('hapa:get-context'),
  getMusicLibrary: () => ipcRenderer.invoke('hapa:get-music-library'),
  getProviderCostSurvey: options => ipcRenderer.invoke('hapa:get-provider-cost-survey', options || {}),
  getShipAssets: () => ipcRenderer.invoke('hapa:get-ship-assets'),
  createFlowExplainer: payload => ipcRenderer.invoke('hapa:create-flow-explainer', payload),
  checkServices: () => ipcRenderer.invoke('hapa:check-services'),
  openPath: targetPath => ipcRenderer.invoke('hapa:open-path', targetPath),
  showPath: targetPath => ipcRenderer.invoke('hapa:show-path', targetPath),
});
