import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path, { join, resolve } from 'node:path';
import fs from 'fs';
import watcher from '@parcel/watcher';
const handlers = {
    async selectFile() {
        const { canceled, filePaths } = await dialog.showOpenDialog()
        if (canceled) {
            return
        } else {
            if (filePaths.length > 0) {
                const filePath = filePaths[0]
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                if (fileContent) {
                    return { filePath, fileContent }
                }
            }
        }
    },
    openFile(event, path) {
        const resolvedPath = resolve(path);
        const stats = fs.statSync(resolvedPath);
        if (stats.isFile()) {
            return fs.readFileSync(resolvedPath, 'utf-8', (err, data) => {
                if (err) {
                    console.error(err);
                    return false;
                } else {
                    return data;
                }
            });
        } else if (stats.isDirectory()) {
            return fs.readdirSync(resolvedPath, (err, data) => {
                if (err) {
                    console.error(err);
                    return false;
                } else {
                    return data;
                }
            });
        }
        return false;
    },
    newExplorerDirectory(event, path) {
        console.log('newExplorerDirectory', path);
        if (fs.existsSync(resolve(path))) {
            console.error('Folder already exists');
            return false;
        } else {
            fs.mkdirSync(resolve(path));
            console.log('Folder created');
            return true;
        }
    },
    getExplorerDirectory() {
        const root = resolve(__dirname, 'sandbox');
        return root;
    },
    getExplorerTree() {
        const root = resolve(__dirname, 'sandbox');
        const files = fs.readdirSync(root);
        const updateFile = (file) => {
            const stats = fs.statSync(file);
            return {
                name: path.basename(file),
                path: resolve(path.dirname(file), path.basename(file)),
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
                stats: stats,
                children: (() => {
                    if (stats.isDirectory()) {
                        return fs.readdirSync(file)
                            .map((child) => {
                                const child_path = join(file, child);
                                return updateFile(child_path);
                            })
                    } else {
                        return [];
                    }
                })(),
            }
        }
        return files
            .map((file) => {
                const file_path = join(root, file);
                const new_file = updateFile(file_path);
                return new_file;
            })
    },
}
const createWindow = async () => {
    const window = new BrowserWindow({
        webPreferences: {
            preload: join(__dirname, 'preload.js')
        },
    })

    const root = resolve(__dirname, 'sandbox');

    await watcher.subscribe(root, (err, events) => {
        window.webContents.send('explorer:tree::update');
        if (err) {
            console.log(err);
        } else {
            console.log(events);
        }
    });

    window.loadFile(
        join(__dirname, 'dist', 'index.html')
    )


    // window.webContents.openDevTools()
}

app.whenReady().then(() => {
    // Add listeners for each preload event
    ipcMain.handle('explorer:item::open', handlers.openFile)
    ipcMain.handle('dialog:selectFile', handlers.selectFile)
    ipcMain.handle('explorer:tree::get', handlers.getExplorerTree)
    ipcMain.handle('explorer:tree:directory::get', handlers.getExplorerDirectory)
    ipcMain.handle('explorer:tree:directory::new', handlers.newExplorerDirectory)
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})