const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;

contextBridge.exposeInMainWorld('api', {
    selectFile: () => ipcRenderer.invoke('selectFile'),
    getOutputFolder: () => ipcRenderer.invoke('getOutputFolder'),
    adjustPitch: (filePath, nSteps) => ipcRenderer.invoke('adjustPitch', filePath, nSteps),
    changeSpeed: (filePath, speed) => ipcRenderer.invoke('changeSpeed', filePath, speed),
    getLyrics: (filePath) => ipcRenderer.invoke('getLyrics', filePath),
    separate: (filePath, mode) => ipcRenderer.invoke('separate', filePath, mode),
    changeVoice: (filePath, voice) => ipcRenderer.invoke('changeVoice', filePath, voice),
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