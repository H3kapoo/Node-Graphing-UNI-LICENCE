export class CanvasManager {
    canvasObject = undefined
    canvasCtx = undefined
    constructor(canvasID) {
        this.canvasObject = document.getElementById(canvasID)
        this.canvasCtx = this.canvasObject.getContext('2d')
        //verify if canvas exists
        this.setupCanvas()
    }

    setupCanvas() {
        //configs maybe read from a file at startup
        const canvasW = 1500
        const canvasH = 1500
        this.canvasObject.width = canvasW
        this.canvasObject.height = canvasH
    }
    //other configs

    getCanvasCtx() { return this.canvasCtx ? this.canvasCtx : null }
}