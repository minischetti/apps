const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;

contextBridge.exposeInMainWorld('api', {
    // File
    selectFile: () => ipcRenderer.invoke('selectFile'),
    getOutputFolder: () => ipcRenderer.invoke('getOutputFolder'),
    getLibrary: () => ipcRenderer.invoke('getLibrary'),
    cleanLibrary: () => ipcRenderer.invoke('cleanLibrary'),
    // Effects
    adjustPitch: (filePath, nSteps) => ipcRenderer.invoke('adjustPitch', filePath, nSteps),
    changeSpeed: (filePath, speed) => ipcRenderer.invoke('changeSpeed', filePath, speed),
    // Data
    getLyrics: (filePath) => ipcRenderer.invoke('getLyrics', filePath),

    // Separate
    isolate: (filePath, mode) => ipcRenderer.invoke('isolate', filePath, mode),

    // Voice
    changeVoice: (filePath, voice) => ipcRenderer.invoke('changeVoice', filePath, voice),
    getVoices: () => ipcRenderer.invoke('getVoices'),
    open_context_menu: () => ipcRenderer.invoke('open_context_menu'),
    openFile: (filePath) => ipcRenderer.invoke('openFile', filePath),
})