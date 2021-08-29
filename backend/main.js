/*Module Imports*/
const { app, BrowserWindow, ipcMain } = require('electron')
const { Menu, MenuItem } = require('electron')
const path = require('path')
const fs = require('fs')

/*Reload process*/
require('electron-reload')(process.cwd(), {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron')
});

/*Globals*/
let mainWindow = null
const menu = new Menu()

/*Electorn Events*/
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() }) //Mac

/*App Menu*/
menu.append(new MenuItem({
    label: 'Test',
    submenu: [{
        label: 'reload',
        accelerator: 'Alt+S',
        click: () => { console.log(mainWindow.webContents.send('nodify-reload-cmds-short', {})) }
    }, {
        label: 'inspect',
        accelerator: 'Ctrl+Shift+I',
        click: () => { mainWindow.webContents.openDevTools() }
    }]
}))

Menu.setApplicationMenu(menu)

/*IPC Events*/
ipcMain.on('nodify-reload-cmds', (evt, args) => {
    evt.returnValue = loadCommandFiles()
})

/*Helper Funcs*/
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920, height: 1080,
        minWidth: 1280, minHeight: 720,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js')
        }
    })
    mainWindow.loadFile('dist/index.html')
}

//THIS SHOULD TRIGGER AN ERROR IF NOT FOUND
function loadCommandFiles() {
    const directoryPath = path.join(__dirname, '../Commands');
    return fs.readdirSync(directoryPath).map(e => directoryPath + path.sep + e)
}