const { Menu, app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const url = require('url')
const { join } = require('path')
const superagent = require('superagent');
const fs = require('fs')
const { Blob } = require('buffer')
const { parseFile, selectCover } = require('music-metadata')
const { spawn } = require('child_process')

const handlers = {
  async trainVoice(voice) {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (canceled) {
        return
      } else {
        if (filePaths.length > 0) {
          const samplesPath = path.resolve(filePaths[0])
          const result = await superagent.post('http://127.0.0.1:8000/api/train').send({
            voice,
            samplesPath
          })
          return result
        }
      }
    } catch (err) {
      console.error(err);
    }
  },

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
        const file = {
          name: path.basename(filePath),
          path: filePath,
        }
        await superagent.post('http://127.0.0.1:8000/api/library/').send({
          name: file.name,
          path: file.path,
        })
        return file
      }
    }
  },
  async openFile(event, filePath) {
    try {
      const metadata = await parseFile(filePath)
      const file = {
        name: path.basename(filePath),
        path: path.resolve(filePath),
        file: fs.readFileSync(filePath),
        metadata: {
          ...metadata,
          cover: selectCover(metadata.common.picture),
        }
      }
      return file
    } catch (err) {
      console.error(err);
    }
  },
  async setLibraryPath(event) {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(
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

      const filesWithPaths = audioFiles.map(file => {
        return {
          name: file,
          path: path.resolve(join(folderPath, file))
        }
      })

      const filesWithMetadata = await Promise.all(filesWithPaths.map(async file => {
        const metadata = await parseFile(file.path)
        return {
          ...file,
          metadata: {
            ...metadata,
            cover: selectCover(metadata.common.picture),
          }
        }
      }))

      return { folderPath, files: filesWithMetadata }
    } catch (err) {
      console.error(err);
    }
  },
  async getLibrary() {
    try {
      const result = await superagent.get('http://127.0.0.1:8000/api/library/').send()
      const library = result.body
      const files = library.map(file => {
        return {
          name: os.path.basename(file.path),
          path: file.path,
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
  async isolate(event, filePath, mode) {
    try {
      console.log("filePath", filePath)
      console.log("mode", mode)
      // set response type to blob
      const result = await superagent.post('http://127.0.0.1:8000/api/isolate/').send(
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
      // Get the models folder
      const modelsPath = path.resolve('../models')
      // For each file in the models folder
      const models = fs.readdirSync(modelsPath)
      // Check if the voice is in the models folder
      if (!models.includes(voice)) {
        console.error("Voice not found")
        return
      }
      // Get the files in the voice folder
      const voicePath = path.resolve(join(modelsPath, voice))
      console.log(voicePath)
      const files = fs.readdirSync(voicePath)
      console.log(files)
      // Get the model config file ending in .json

      const model_config = files.filter(file => path.extname(file) === '.json')[0]
      console.log(model_config)
      const model_data = files.filter(file => path.extname(file) === '.pth')[0]
      console.log(model_data)

      spawn(
        "svc", ["infer", "--no-auto-predict-f0", "--f0-method", "crepe", "--db-thresh", "-50", "-m", model_data, "-c", model_config, "-o", + voice + ".wav", filePath]
      )

    } catch (err) {
      console.error(err);
    }
  },
  async getVoices() {
    try {
      // Get the voices from the models folder
      const voicesPath = path.resolve('../models')
      const voices = fs.readdirSync(voicesPath)
      return voices
    } catch (err) {
      console.error(err);
    }
  },
}

module.exports = handlers