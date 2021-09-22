import * as utils from './RendererUtils'

/*Class that handles the rendering of canvas elements*/
export class Renderer {

    #ctx = undefined
    #width = undefined
    #height = undefined

    #indexingFlag = true

    constructor(canvasDetails) {
        this.#ctx = canvasDetails.getContext('2d')
        this.#width = canvasDetails.width
        this.#height = canvasDetails.height

        this.#ctx.fillStyle = 'white'
        this.#ctx.rect(0, 0, this.#width, this.#height);
        this.#ctx.fill();
        this.#renderGrid()
    }

    /*Public funcs*/
    render(modelState, indexing) {
        if (indexing)
            this.#indexingFlag = !this.#indexingFlag

        this.#ctx.fillStyle = 'white'
        this.#ctx.rect(0, 0, this.#width, this.#height);
        this.#ctx.fill();
        console.log('[GR] Rendering..')

        if (this.#indexingFlag)
            this.#renderGrid()
        // console.log(modelState.nodes.getCurrentState())

        // this.#renderConns(state)
        this.#renderNodes(modelState)
        // if (indexingFlag)
        //     this._indexingPass(state)

    }

    #renderGrid(spacing = 100) {
        for (let x = spacing; x < this.#width; x += spacing)
            for (let y = spacing; y < this.#height; y += spacing) {
                let text = x.toString() + ',' + y.toString()
                utils.debugText(this.#ctx, [x, y], text)
            }

        for (let y = 0; y < this.#height; y += spacing)
            utils.debugLine(this.#ctx, [0, y], [this.#width, y])

        for (let x = 0; x < this.#width; x += spacing)
            utils.debugLine(this.#ctx, [x, 0], [x, this.#height])
    }

    /*Private funcs*/
    #renderConns(state) {
        for (const [_, connData] of Object.entries(state.conns)) {
            let srcPos = utils.getNodeData(state.nodes[connData.id_src], 'pos')
            let destPos = utils.getNodeData(state.nodes[connData.id_dest], 'pos')
            let srcRad = utils.getNodeData(state.nodes[connData.id_src], 'radius')
            let destRad = utils.getNodeData(state.nodes[connData.id_dest], 'radius')
            let color = utils.getConnData(connData, 'color')
            let directed = utils.getConnData(connData, 'directed')
            let elev = utils.getConnData(connData, 'elev')

            let res = utils.getBezierPointsWithCpElevationAndRadius(srcPos, destPos, srcRad, destRad, elev)

            /* Draw with arrow */
            if (directed) {
                let arrowPoints = utils.getArrowPoints(res.lineEnd, res.cpPos)
                this.#ctx.beginPath()
                this.#ctx.fillStyle = 'black'
                this.#ctx.lineWidth = 4 //hardcoded
                this.#ctx.beginPath();
                this.#ctx.moveTo(arrowPoints.p1[0], arrowPoints.p1[1])
                this.#ctx.lineTo(arrowPoints.p2[0], arrowPoints.p2[1])
                this.#ctx.lineTo(arrowPoints.p3[0], arrowPoints.p3[1])
                this.#ctx.fill()
            }

            /* Curve */
            this.#ctx.beginPath()
            this.#ctx.strokeStyle = color
            this.#ctx.lineWidth = 4 //hardcoded
            this.#ctx.beginPath()
            this.#ctx.moveTo(res.lineStart[0], res.lineStart[1])
            this.#ctx.quadraticCurveTo(res.cpPos[0], res.cpPos[1], res.lineEnd[0], res.lineEnd[1])
            this.#ctx.stroke()
        }
    }

    #renderNodes(state) {

        for (const [_, nodeObj] of Object.entries(state.nodes)) {
            const nodeData = nodeObj.getCurrentState()
            let pos = utils.getNodeData(nodeData, 'pos')
            let id = utils.getNodeData(nodeData, 'nodeId')
            let radius = utils.getNodeData(nodeData, 'radius')

            //draw node itself
            this.#ctx.beginPath()
            this.#ctx.arc(pos[0], pos[1], radius, 0, 2 * Math.PI)
            this.#ctx.lineWidth = 4 //hardcoded
            this.#ctx.strokeStyle = 'black'
            this.#ctx.stroke()

            /*indexing artifacts*/
            if (this.#indexingFlag) {

                this.#ctx.font = '2em Courier New'
                this.#ctx.textAlign = "center"
                this.#ctx.textBaseline = "middle"
                this.#ctx.lineWidth = 2 //hardcoded
                this.#ctx.fillText(id.toString(), pos[0], pos[1] - 1.5 * radius)
                this.#ctx.strokeText(id.toString(), pos[0], pos[1] - 1.5 * radius)
            }
        }
    }

    _indexingPass(state) {
        /*For conns*/
        for (const [_, connData] of Object.entries(state.conns)) {
            let connId = utils.getConnData(connData, 'conn_id')
            let srcPos = utils.getNodeData(state.nodes[connData.id_src], 'pos')
            let destPos = utils.getNodeData(state.nodes[connData.id_dest], 'pos')
            let srcRad = utils.getNodeData(state.nodes[connData.id_src], 'radius')
            let destRad = utils.getNodeData(state.nodes[connData.id_dest], 'radius')
            let elev = utils.getConnData(connData, 'elev')

            let res = utils.getBezierPointsWithCpElevationAndRadius(srcPos, destPos, srcRad, destRad, elev)
            /*index artifacts*/
            let elevBias = 25
            let elevBiasPassed = elev >= 0 ? elevBias : -elevBias
            let indexingPos = utils.getConnIndexingPointWithElev(res.lineStart, res.cpPos, res.lineEnd, elevBiasPassed)
            this.#ctx.font = '2em Courier New'
            this.#ctx.textAlign = "center"
            this.#ctx.textBaseline = "middle"
            this.#ctx.lineWidth = 2 //hardcoded
            this.#ctx.fillText(connId.toString(), indexingPos[0], indexingPos[1])
            this.#ctx.strokeText(connId.toString(), indexingPos[0], indexingPos[1])
        }

        /*For nodes*/
        for (const [_, nodeData] of Object.entries(state.nodes)) {
            let pos = utils.getNodeData(nodeData, 'pos')
            let id = utils.getNodeData(nodeData, 'node_id')
            let radius = utils.getNodeData(nodeData, 'radius')

            /*indexing artifacts*/
            let elevBias = 25
            let upPoint = [pos[0], pos[1] - radius - elevBias]
            this.#ctx.font = '2em Courier New'
            this.#ctx.textAlign = "center"
            this.#ctx.textBaseline = "middle"
            this.#ctx.lineWidth = 2 //hardcoded
            this.#ctx.fillText(id.toString(), upPoint[0], upPoint[1])
            this.#ctx.strokeText(id.toString(), upPoint[0], upPoint[1])
        }
    }
}