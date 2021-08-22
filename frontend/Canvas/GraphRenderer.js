export class GraphRenderer {
    ctx_ = undefined
    width_ = undefined
    height_ = undefined
    constructor(canvasDetails) {
        this.ctx_ = canvasDetails[0]
        this.width_ = canvasDetails[1]
        this.height_ = canvasDetails[2]
    }

    render(state) {
        this.ctx_.clearRect(0, 0, this.width_, this.height_);
        this._renderConns(state.conns)
        this._renderNodes(state.nodes)
    }

    _renderConns(state) { }

    _renderNodes(state) {

        for (const [_, nodeData] of Object.entries(state)) {
            let pos = nodeData['-pos']
            let radius = nodeData['-radius'] || 30
            this.ctx_.beginPath();
            this.ctx_.arc(pos[0], pos[1], radius, 0, 2 * Math.PI);
            this.ctx_.fill();
        }
    }
}