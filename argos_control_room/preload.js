const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('argosMeta', {
  electron: process.versions.electron,
  chrome: process.versions.chrome,
  platform: process.platform,
});
