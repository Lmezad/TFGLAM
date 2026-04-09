const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saludo: () => "Hola desde Electron (preload)"
});
