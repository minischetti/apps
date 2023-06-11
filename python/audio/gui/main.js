'use strict'

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')
const { join } = require('path')
const superagent = require('superagent');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window

// Keep a reference for dev mode
let dev = false

const handlers = {
  async selectFile() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
      return
    } else {
      if (filePaths.length > 0) {
        const filePath = filePaths[0]
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        console.log(filePath)
        // await superagent.get('http://127.0.0.1:8000/api/')
        //   .then(res => {
        //     console.log(res)
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
        // How should I send a large file to the server?
        // https://stackoverflow.com/questions/51879671/how-should-i-send-a-large-file-to-the-server
        await superagent.post('http://127.0.0.1:8000/api/transcribe/')
          .send({ filePath }).then(res => {
            console.log(res.body)
          }).catch(err => {
            console.log(err)
          })
      }
    }
  },
}

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
      preload: join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  let indexPath

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

  window.loadURL(indexPath)

  // Don't show until we are ready and loaded
  window.once('ready-to-show', () => {
    window.show()
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
  // Add listeners for each preload event
  // ipcMain.handle('explorer:item::open', handlers.openFile)
  ipcMain.handle('selectFile', handlers.selectFile)
  // ipcMain.handle('explorer:tree::get', handlers.getExplorerTree)
  // ipcMain.handle('explorer:tree:directory::get', handlers.getExplorerDirectory)
  // ipcMain.handle('explorer:tree:directory::new', handlers.newExplorerDirectory)

  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})