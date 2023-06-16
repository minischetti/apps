const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;

contextBridge.exposeInMainWorld('api', {
    // File
    selectFile: () => ipcRenderer.invoke('selectFile'),
    getOutputFolder: () => ipcRenderer.invoke('getOutputFolder'),
    getFiles: () => ipcRenderer.invoke('getFiles'),
    // Effects
    adjustPitch: (filePath, nSteps) => ipcRenderer.invoke('adjustPitch', filePath, nSteps),
    changeSpeed: (filePath, speed) => ipcRenderer.invoke('changeSpeed', filePath, speed),
    // Data
    getLyrics: (filePath) => ipcRenderer.invoke('getLyrics', filePath),

    // Separate
    separate: (filePath, mode) => ipcRenderer.invoke('separate', filePath, mode),

    // Voice
    changeVoice: (filePath, voice) => ipcRenderer.invoke('changeVoice', filePath, voice),
    getVoices: () => ipcRenderer.invoke('getVoices'),
})