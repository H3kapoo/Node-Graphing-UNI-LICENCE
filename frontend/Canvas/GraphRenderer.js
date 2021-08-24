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

    _renderConns(state) {
        for (const [_, connData] of Object.entries(state)) {

            let pos_src = connData['-pos_src']
            let pos_dest = connData['-pos_dest']
            // console.log(id_src, id_dest)
            //conn itself
            this.ctx_.lineWidth = 4 //hardcoded
            this.ctx_.beginPath();
            this.ctx_.moveTo(pos_src[0], pos_src[1])
            this.ctx_.lineTo(pos_dest[0], pos_dest[1])
            this.ctx_.stroke()
        }
    }

    _renderNodes(state) {

        for (const [_, nodeData] of Object.entries(state)) {
            let pos = nodeData['-pos']
            let radius = nodeData['-radius']
            let id = nodeData['-node_id']

            //node itself
            this.ctx_.beginPath()
            this.ctx_.arc(pos[0], pos[1], radius, 0, 2 * Math.PI)
            this.ctx_.lineWidth = 4 //hardcoded
            this.ctx_.strokeStyle = 'black'
            this.ctx_.stroke()

            //text over
            this.ctx_.font = '2em Courier New'
            // this.ctx_.fillStyle = "red";
            this.ctx_.textAlign = "center"
            this.ctx_.textBaseline = "middle"
            this.ctx_.lineWidth = 2 //hardcoded
            this.ctx_.fillText(id.toString(), pos[0], pos[1])
            this.ctx_.strokeText(id.toString(), pos[0], pos[1])
        }
    }
}