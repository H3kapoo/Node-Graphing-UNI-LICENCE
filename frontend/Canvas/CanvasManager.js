/*Class that handles properties of the canvas*/
export class CanvasManager {
    _canvasObject_ = undefined
    _canvasCtx_ = undefined
    constructor(canvasID) {
        this._canvasObject_ = document.getElementById(canvasID)
        this._canvasCtx_ = this._canvasObject_.getContext('2d')
        this._setupCanvas()
    }

    /*Private funcs*/
    _setupCanvas() {
        //TODO: configs maybe read from a file at startup
        const canvasW = 1500
        const canvasH = 1500
        this._canvasObject_.width = canvasW
        this._canvasObject_.height = canvasH
    }

    /*Getters*/
    getCanvasDetails() {
        return [this._canvasCtx_ ? this._canvasCtx_ : null, this._canvasObject_.width, this._canvasObject_.height]
    }
}