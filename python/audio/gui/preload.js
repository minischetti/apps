const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;

contextBridge.exposeInMainWorld('api', {
    selectFile: () => ipcRenderer.invoke('selectFile'),
    adjustPitch: (filePath, nSteps) => ipcRenderer.invoke('adjustPitch', filePath, nSteps),
    changeSpeed: (filePath, speed) => ipcRenderer.invoke('changeSpeed', filePath, speed),
    explorer: {
        item: {
            open: (path) => ipcRenderer.invoke('explorer:item::open', path),
        },
        directory: {
            get: (content) => ipcRenderer.invoke('explorer:tree:directory::get', content),
            new: (path) => ipcRenderer.invoke('explorer:tree:directory::new', path),
        },
        tree: {
            get: (content) => ipcRenderer.invoke('explorer:tree::get', content),
            onUpdateListener: (callback) => ipcRenderer.on('explorer:tree::update', callback),
        }
    },
})