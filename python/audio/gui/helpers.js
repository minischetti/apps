const fs = require('fs')
const path = require('path')
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.flac']

const helpers = {
    createDirectoryIfNotExists(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }
    },
    copyFiles(source, destination) {
        const files = fs.readdirSync(source)
        files.forEach(file => {
            fs.copyFileSync(path.resolve(path.join(source, file)), path.resolve(path.join(destination, file)))
        })
    },
    getAudioFiles(path) {
        return fs.readdirSync(path)
            .filter(file => {
                const ext = path.extname(file)
                return AUDIO_EXTENSIONS.includes(ext)
            })
    },
    getPath(path, ...paths) {
        if (paths.length === 0) {
            return path.resolve(path)
        }
        return path.resolve(join(path, ...paths))
    }
}

module.exports = helpers