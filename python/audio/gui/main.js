'use strict'

// Import parts of electron to use
const { Menu, app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const url = require('url')
const { join } = require('path')




// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window
const handlers = require('./handlers')(window)
let files = []


// Keep a reference for dev mode
let dev = false

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true
}

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      webSecurity: false,
    },
    autoHideMenuBar: true,
    backgroundColor: '#001',
    show: false,
    vibrancy: 'dark',
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#001',
      symbolColor: '#fff',
    },
  })

  // Create the splash window.
  var splash = new BrowserWindow({
    width: 500,
    height: 300,
    // transparent: true,
    backgroundColor: '#001',
    frame: false,
    alwaysOnTop: true,
    resizable: false,
  });

  let indexPath

  // Determine the correct index.html file based on dev vs prod
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  splash.loadFile(path.join(__dirname, 'src', 'splash.html'),)
  window.loadURL(indexPath)

  window.once('ready-to-show', () => {
    window.show()
    splash.destroy()
  })

  // Emitted when the window is closed.
  window.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // Register ipcMain handlers
  for (const [event, handler] of Object.entries(handlers)) {
    ipcMain.handle(event, handler)
  }

  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
