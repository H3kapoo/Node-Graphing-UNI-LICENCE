import * as utils from './RendererUtils'

/*Class that handles the rendering of canvas elements*/
export class GraphRenderer {
    ctx_ = undefined
    _width_ = undefined
    _height_ = undefined

    _indexingFlag_ = false

    constructor(canvasDetails) {
        this.ctx_ = canvasDetails.getContext('2d')
        this._width_ = canvasDetails.width
        this._height_ = canvasDetails.height
    }

    /*Public funcs*/
    render(state, indexingFlag) {
        this.ctx_.fillStyle = 'white'
        this.ctx_.rect(0, 0, this._width_, this._height_);
        this.ctx_.fill();

        if (indexingFlag)
            this._renderGrid()

        // this._renderConns(state)
        this._renderNodes(state)

        if (indexingFlag)
            this._indexingPass(state)
    }

    _renderGrid(spacing = 100) {
        for (let x = spacing; x < this._width_; x += spacing)
            for (let y = spacing; y < this._height_; y += spacing) {
                let text = x.toString() + ',' + y.toString()
                utils.debugText(this.ctx_, [x, y], text)
            }

        for (let y = 0; y < this._height_; y += spacing)
            utils.debugLine(this.ctx_, [0, y], [this._width_, y])

        for (let x = 0; x < this._width_; x += spacing)
            utils.debugLine(this.ctx_, [x, 0], [x, this._height_])
    }

    /*Private funcs*/
    _renderConns(state) {
        for (const [_, connData] of Object.entries(state.conns)) {
            let srcPos = utils.getNodeData(state.nodes[connData['-id_src']], '-pos')
            let destPos = utils.getNodeData(state.nodes[connData['-id_dest']], '-pos')
            let srcRad = utils.getNodeData(state.nodes[connData['-id_src']], '-radius')
            let destRad = utils.getNodeData(state.nodes[connData['-id_dest']], '-radius')
            let color = utils.getConnData(connData, '-color')
            let directed = utils.getConnData(connData, '-directed')
            let elev = utils.getConnData(connData, '-elev')

            let res = utils.getBezierPointsWithCpElevationAndRadius(srcPos, destPos, srcRad, destRad, elev)

            /* Draw with arrow */
            if (directed) {
                let arrowPoints = utils.getArrowPoints(res.lineEnd, res.cpPos)
                this.ctx_.beginPath()
                this.ctx_.fillStyle = 'black'
                this.ctx_.lineWidth = 4 //hardcoded
                this.ctx_.beginPath();
                this.ctx_.moveTo(arrowPoints.p1[0], arrowPoints.p1[1])
                this.ctx_.lineTo(arrowPoints.p2[0], arrowPoints.p2[1])
                this.ctx_.lineTo(arrowPoints.p3[0], arrowPoints.p3[1])
                this.ctx_.fill()
            }

            /* Curve */
            this.ctx_.beginPath()
            this.ctx_.strokeStyle = color
            this.ctx_.lineWidth = 4 //hardcoded
            this.ctx_.beginPath()
            this.ctx_.moveTo(res.lineStart[0], res.lineStart[1])
            this.ctx_.quadraticCurveTo(res.cpPos[0], res.cpPos[1], res.lineEnd[0], res.lineEnd[1])
            this.ctx_.stroke()
        }
    }

    _renderNodes(state) {

        for (const [_, nodeData] of Object.entries(state.nodes)) {
            let pos = utils.getNodeData(nodeData, 'pos')
            let id = utils.getNodeData(nodeData, 'node_id')
            let radius = utils.getNodeData(nodeData, 'radius')

            //node itself
            this.ctx_.beginPath()
            this.ctx_.arc(pos[0], pos[1], radius, 0, 2 * Math.PI)
            this.ctx_.lineWidth = 4 //hardcoded
            this.ctx_.strokeStyle = 'black'
            this.ctx_.stroke()

            /*indexing artifacts*/
            if (this._indexingFlag_) {

                this.ctx_.font = '2em Courier New'
                this.ctx_.textAlign = "center"
                this.ctx_.textBaseline = "middle"
                this.ctx_.lineWidth = 2 //hardcoded
                this.ctx_.fillText(id.toString(), pos[0], pos[1] - 1.5 * radius)
                this.ctx_.strokeText(id.toString(), pos[0], pos[1] - 1.5 * radius)
            }
        }
    }

    _indexingPass(state) {
        /*For conns*/
        for (const [_, connData] of Object.entries(state.conns)) {
            let connId = utils.getConnData(connData, '-conn_id')
            let srcPos = utils.getNodeData(state.nodes[connData['-id_src']], '-pos')
            let destPos = utils.getNodeData(state.nodes[connData['-id_dest']], '-pos')
            let srcRad = utils.getNodeData(state.nodes[connData['-id_src']], '-radius')
            let destRad = utils.getNodeData(state.nodes[connData['-id_dest']], '-radius')
            let elev = utils.getConnData(connData, '-elev')

            let res = utils.getBezierPointsWithCpElevationAndRadius(srcPos, destPos, srcRad, destRad, elev)
            /*index artifacts*/
            let elevBias = 25
            let elevBiasPassed = elev >= 0 ? elevBias : -elevBias
            let indexingPos = utils.getConnIndexingPointWithElev(res.lineStart, res.cpPos, res.lineEnd, elevBiasPassed)
            this.ctx_.font = '2em Courier New'
            this.ctx_.textAlign = "center"
            this.ctx_.textBaseline = "middle"
            this.ctx_.lineWidth = 2 //hardcoded
            this.ctx_.fillText(connId.toString(), indexingPos[0], indexingPos[1])
            this.ctx_.strokeText(connId.toString(), indexingPos[0], indexingPos[1])
        }

        /*For nodes*/
        for (const [_, nodeData] of Object.entries(state.nodes)) {
            let pos = utils.getNodeData(nodeData, 'pos')
            let id = utils.getNodeData(nodeData, 'node_id')
            let radius = utils.getNodeData(nodeData, 'radius')

            /*indexing artifacts*/
            let elevBias = 25
            let upPoint = [pos[0], pos[1] - radius - elevBias]
            this.ctx_.font = '2em Courier New'
            this.ctx_.textAlign = "center"
            this.ctx_.textBaseline = "middle"
            this.ctx_.lineWidth = 2 //hardcoded
            this.ctx_.fillText(id.toString(), upPoint[0], upPoint[1])
            this.ctx_.strokeText(id.toString(), upPoint[0], upPoint[1])
        }
    }
}