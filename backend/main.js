
/*Module Imports*/
const { app, BrowserWindow, ipcMain } = require('electron')
const { Menu, MenuItem } = require('electron')
const path = require('path')
const fs = require('fs')
const { dialog } = require('electron')

/*Reload process*/
require('electron-reload')(process.cwd(), {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron')
});

/*Globals*/
let mainWindow = null
let indexingArtifactsEnabled = false
const menu = new Menu()

/*Electorn Events*/
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() }) //Mac

/*App Menu*/
const debugMenu = new MenuItem({
    label: 'Debug',
    submenu: [{
        label: 'Refresh commands',
        accelerator: 'Alt+S',
        click: () => { mainWindow.webContents.send('nodify-reload-cmds-short', {}) }
    },
    {
        label: 'Save image',
        accelerator: 'Ctrl+S',
        click: () => { mainWindow.webContents.send('nodify-export-image', {}) }
    },
    {
        label: 'Toggle index artifacts',
        accelerator: 'Ctrl+D',
        click: () => { requestDebugArtifactsToggle() }
    },
    {
        label: 'Debug console',
        accelerator: 'Ctrl+Shift+I',
        click: () => { mainWindow.webContents.openDevTools() }
    }]
})

menu.append(debugMenu)
Menu.setApplicationMenu(menu)

/*IPC Events*/
ipcMain.on('nodify-reload-cmds', (evt, args) => {
    evt.returnValue = loadCommandFiles()
})

ipcMain.on('nodify-export-image', (evt, data) => {

    let saveExt = '.png'

    dialog.showSaveDialog({}).then((result) => {
        let path = result.filePath.replace(saveExt, '') + saveExt
        fs.writeFile(path, data.base64Data, 'base64', (err) => {
            console.log(err)
        });
    }).catch((err) => {
        console.log(err)
    });
})


/*Helper Funcs*/
function requestDebugArtifactsToggle() {
    indexingArtifactsEnabled = !indexingArtifactsEnabled
    mainWindow.webContents.send('nodify-indexing-artifacts-toggle', {})
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920, height: 1080,
        minWidth: 1280, minHeight: 720,
        // frame: false,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js'),
        }
    })
    mainWindow.loadFile('dist/index.html')
}

//THIS SHOULD TRIGGER AN ERROR IF NOT FOUND
function loadCommandFiles() {
    const directoryPath = path.join(__dirname, '../Commands');
    return fs.readdirSync(directoryPath).map(e => directoryPath + path.sep + e)
}