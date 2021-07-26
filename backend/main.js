const { app, BrowserWindow } = require('electron')
const path = require('path')

require('electron-reload')(process.cwd(), {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron')
});

function createWindow() {
    const window = new BrowserWindow({
        width: 1920, height: 1080,
        minWidth: 1280, minHeight: 720,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js')
        }
    })

    window.loadFile('dist/index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})