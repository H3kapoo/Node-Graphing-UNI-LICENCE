const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
        // whitelist channels
        return ipcRenderer.sendSync(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, func);
    }
}
);