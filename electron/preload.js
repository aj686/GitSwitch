const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  clearCredentials: () => ipcRenderer.invoke('clear-git-credentials'),
  getPlatform: () => process.platform
});
