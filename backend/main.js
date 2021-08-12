const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { Menu, MenuItem } = require('electron')


require('electron-reload')(process.cwd(), {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron')
});

let win = null

function createWindow() {
    win = new BrowserWindow({
        width: 1920, height: 1080,
        minWidth: 1280, minHeight: 720,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js')
        }
    })
    win.loadFile('dist/index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()

    })
    // win.webContents.on('did-finish-load', function () {
    //     win.webContents.send('e', { 'SAVED': 'File Saved' });
    // })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


const menu = new Menu()
menu.append(new MenuItem({
    label: 'Test',
    submenu: [{
        label: 'reload',
        accelerator: 'Alt+S',
        click: () => { console.log(win.webContents.send('nodify-reload-cmds-short', {})) }
    }, {
        label: 'inspect',
        accelerator: 'Ctrl+Shift+I',
        click: () => { win.webContents.openDevTools() }
    }]
}))

Menu.setApplicationMenu(menu)

ipcMain.on('nodify-reload-cmds', (evt, args) => {
    evt.returnValue = loadCommandFiles()
})

//THIS SHOULD TRIGGER AN ERROR IF NOT FOUND
function loadCommandFiles() {
    const directoryPath = path.join(__dirname, '../Commands');
    let files = fs.readdirSync(directoryPath)
    files = files.map(e => directoryPath + path.sep + e)
    return files
}