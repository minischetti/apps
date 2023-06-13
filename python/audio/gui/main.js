'use strict'

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const url = require('url')
const { join } = require('path')
const superagent = require('superagent');
const { parseFile } = require('music-metadata');

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
        const filePath = path.resolve(filePaths[0])
        console.log(filePath)
        const metadata = await parseFile(filePath)
        // const fileContent = await superagent.get(filePath).responseType('blob')
        // get absolute path
        return { filePath, metadata }

        // console.log(filePath)
        // await superagent.get('http://127.0.0.1:8000/api/')
        //   .then(res => {
        //     console.log(res)
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
        // try {
        //   // set response type to blob
        //   const result = await superagent.post('http://127.0.0.1:8000/api/open/').send({ fileContent });
        // } catch (err) {
        //   console.error(err);
        // }
      }
    }
  },
  async adjustPitch(event, filePath, nSteps) {
    try {
      console.log("filePath", filePath)
      console.log("nSteps", nSteps)
      // set response type to blob
      const result = await superagent.post('http://127.0.0.1:8000/api/pitch/').send(
        { filePath, nSteps }
      ).responseType('buffer')

      const buffer = Buffer.from(result.body).toString('base64')
      return buffer

    } catch (err) {
      console.error(err);
    }
  },
  async changeSpeed(event, filePath, speed) {
    try {
      console.log("filePath", filePath)
      console.log("speed", speed)
      // set response type to blob
      const result = await superagent.post('http://127.0.0.1:8000/api/speed/').send(
        { filePath, speed }
      )
      console.log(result)
    } catch (err) {
      console.error(err);
    }
  },
  async getLyrics(event, filePath) {
    try {
      console.log("filePath", filePath)
      // set response type to blob
      const result = await superagent.post('http://127.0.0.1:8000/api/lyrics/').send(
        { filePath }
      )
      console.log(result)
      return result
    } catch (err) {
      console.error(err);
    }
  },
  async separate(event, filePath, mode) {
    try {
      console.log("filePath", filePath)
      console.log("mode", mode)
      // set response type to blob
      const result = await superagent.post('http://127.0.0.1:8000/api/separate/').send(
        { filePath, mode }
      )
      console.log(result)
      return result
    } catch (err) {
      console.error(err);
    }
  },
}

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if(process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
    dev = true
  }

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      webSecurity: false,
      transparent: true,
      frame: false,
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