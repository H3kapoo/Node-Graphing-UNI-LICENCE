/*Class responsible with managing the export of canvas drawing as an image*/
export class CanvasExporter {

    _canvasObject_ = undefined

    constructor(canvasObject) {
        this._canvasObject_ = canvasObject
        window.api.receive('nodify-export-image', (evt, args) => this.export(evt))
    }

    export(evt) {
        let base64Data = this._canvasObject_.toDataURL('image/png').replace(/^data:image\/png;base64,/, "")
        evt.sender.send('nodify-export-image', { base64Data })
    }
}
