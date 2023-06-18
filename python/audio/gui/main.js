'use strict'

// Import parts of electron to use
const { Menu, app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const url = require('url')
const { join } = require('path')
const superagent = require('superagent');
const { parseFile, selectCover } = require('music-metadata');
const fs = require('fs')



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window

let files = []


// Keep a reference for dev mode
let dev = false

const handlers = {
  async open_context_menu(event, filePath) {
    const menu = Menu.buildFromTemplate([
      {
        label: 'Remove from library',
        click: async () => await handlers.removeFile(event, filePath)
      },
    ])
    menu.popup()
    return true
  },
  async removeFile(event, filePath) {
    try {
      const result = await superagent.post('http://127.0.0.1:8000/api/library/remove').send({
        path: filePath
      })
      return result
    } catch (err) {
      console.error(err);
    }
  },

  async getOutputFolder() {
    const { canceled, filePaths } = await dialog.showOpenDialog(
      window,
      {
        properties: ['openDirectory']
      }
    )
    if (canceled) {
      return
    } else {
      if (filePaths.length > 0) {
      const folderPath = path.resolve(filePaths[0])
        const folderContent = fs.readdirSync(folderPath)
        const folderContentWithPaths = folderContent.map(file => {
          return {
            name: file,
            path: path.resolve(join(folderPath, file))
          }
        })

        // Show only audio files
        return { folderPath, folderContent: folderContentWithPaths }
      }
    }
  },
  async selectFile() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
      return
    } else {
      if (filePaths.length > 0) {
        const filePath = path.resolve(filePaths[0])
        console.log(filePath)
        const metadata = await parseFile(filePath)
        const cover = selectCover(metadata.common.picture)
        metadata.img = cover
        const file = {
          name: path.basename(filePath),
          path: filePath,
          metadata
        }
        await superagent.post('http://127.0.0.1:8000/api/library/').send({
          name: file.name,
          path: file.path,
        })
        return file

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
  async openFile(event, filePath) {
    try {
      console.log(filePath)
      const metadata = await parseFile(filePath)
      const cover = selectCover(metadata.common.picture)
      metadata.img = cover
      const file = {
        name: path.basename(filePath),
        path: filePath,
        metadata
      }
      return file
    } catch (err) {
      console.error(err);
    }
  },
  async setLibraryPath(event) {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(window,
        {
          properties: ['openDirectory']
        })
      if (canceled) return
      const folderPath = path.resolve(filePaths[0])
      // const result = await superagent.post('http://127.0.0.1:8000/api/library/set')
      //   .send({ path })
      // get the files in the path
      const files = fs.readdirSync(folderPath)
      // filter out non-audio files
      const audioFiles = files.filter(file => {
        const ext = path.extname(file)
        return ['.mp3', '.wav', '.flac', '.ogg'].includes(ext)
      })

      // get metadata for each file
      const metadata = await Promise.all(audioFiles.map(async file => {
        const filePath = path.resolve(join(folderPath, file))
        const metadata = await parseFile(filePath)
        const cover = selectCover(metadata.common.picture)
        metadata.img = cover
        return metadata
      }))
      // create an array of objects with file name, path and metadata
      const filesWithMetadata = audioFiles.map((file, index) => {
        return {
          name: file,
          path: path.resolve(join(folderPath, file)),
          metadata: metadata[index]
        }
      })
      // send the files to the server
      return filesWithMetadata
    } catch (err) {
      console.error(err);
    }
  },
  async getLibrary() {
    try {
      const result = await superagent.get('http://127.0.0.1:8000/api/library/').send()
      const library = result.body
      const metadata = await Promise.all(library.map(async file => {
        const metadata = await parseFile(file.path)
        const cover = selectCover(metadata.common.picture)
        metadata.img = cover
        return metadata
      }))
      const files = library.map((file, index) => {
        return {
          ...file,
          metadata: metadata[index]
        }
      })
      return files
    } catch (err) {
      console.error(err);
    }
  },
  async cleanLibrary() {
    try {
      const result = await superagent.post('http://127.0.0.1:8000/api/library/clean').send()
      return result.message
    } catch (err) {
      console.error(err);
    }
  },
  async adjustPitch(event, filePath, nSteps) {
    try {
      console.log("filePath", filePath)
      console.log("nSteps", nSteps)
      // set response type to blob
      const result = await superagent.post('http://127.0.0.1:8000/api/pitch/').send(
        { filePath, nSteps }
      )

      return path.resolve(result.body)

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
      return result.body.words
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
      return result.body
    } catch (err) {
      console.error(err);
    }
  },
  async changeVoice(event, filePath, voice) {
    try {
      console.log("filePath", filePath)
      console.log("voice", voice)
      // set response type to blob
      const result = await superagent.post('http://127.0.0.1:8000/api/voice/').send(
        { filePath, voice }
      )
      console.log(result)
      return result.body
    } catch (err) {
      console.error(err);
    }
  },
  async getVoices(event) {
    try {
      const result = await superagent.get('http://127.0.0.1:8000/api/voices/').send()
      return result.body
    } catch (err) {
      console.error(err);
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
      preload: join(__dirname, 'preload.js'),
      webSecurity: false,
    },
    // frame: false,
    // // transparent: true,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#001',
    //   symbolColor: '#fff',
    // },
    autoHideMenuBar: true,
    backgroundColor: '#001',
    show: false,
    vibrancy: 'dark',
  })

  var splash = new BrowserWindow({
    width: 500,
    height: 300,
    // transparent: true,
    backgroundColor: '#001',
    frame: false,
    alwaysOnTop: true,
    resizable: false,
  });
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

  splash.loadFile(path.join(__dirname, 'dist', 'splash.html'),)
  window.loadURL(indexPath)

  window.once('ready-to-show', () => {
    window.show()
    splash.destroy()
  })

  // setTimeout(() => {
  //   splash.destroy()
  //   window.show()
  // }, 2000);


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