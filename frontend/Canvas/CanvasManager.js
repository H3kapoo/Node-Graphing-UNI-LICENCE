export class CanvasManager {
    canvasObject_ = undefined
    canvasCtx_ = undefined
    constructor(canvasID) {
        this.canvasObject_ = document.getElementById(canvasID)
        this.canvasCtx_ = this.canvasObject_.getContext('2d')
        //verify if canvas exists
        this.setupCanvas()
    }

    setupCanvas() {
        //configs maybe read from a file at startup
        const canvasW = 1500
        const canvasH = 1500
        this.canvasObject_.width = canvasW
        this.canvasObject_.height = canvasH
    }

    //other configs

    getCanvasDetails() {
        return [this.canvasCtx_ ? this.canvasCtx_ : null, this.canvasObject_.width, this.canvasObject_.height]
    }
}