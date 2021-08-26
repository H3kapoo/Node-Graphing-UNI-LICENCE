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
        console.log('text');
        this.ctx_.clearRect(0, 0, this.width_, this.height_);
        this._renderConns(state)
        this._renderNodes(state)
    }

    _renderConns(state) {
        for (const [_, connData] of Object.entries(state.conns)) {

            let pos_src = state.nodes[connData['-id_src']]['-pos']
            let pos_dest = state.nodes[connData['-id_dest']]['-pos']
            let node_src_radius = state.nodes[connData['-id_src']]['-radius'] || this._nodeDefaults['-radius']
            let node_dest_radius = state.nodes[connData['-id_dest']]['-radius'] || this._nodeDefaults['-radius']
            let color = connData['-color'] || this._nodeDefaults['-color']

            //calculate edge line start/end points
            let diff = this._sub(pos_dest, pos_src)
            let dir = this._norm(diff)
            let line_start = [pos_src[0] + dir[0] * node_src_radius, pos_src[1] + dir[1] * node_src_radius]
            let line_end = [pos_dest[0] - dir[0] * node_dest_radius, pos_dest[1] - dir[1] * node_dest_radius]

            //bezier stuff
            let cp_elev = 0
            let pos_cp = this._middle(line_start, line_end)
            let forward = [0, 0, 1]
            let dir_3d = [dir[0], dir[1], 0]

            let perp = this._cross(dir_3d, forward)
            perp = this._scalarMult3d(perp, cp_elev)
            perp = [perp[0] + pos_cp[0], perp[1] + pos_cp[1]]

            //cp
            this.ctx_.beginPath()
            this.ctx_.arc(perp[0], perp[1], 5, 0, 2 * Math.PI)
            this.ctx_.lineWidth = 4 //hardcoded
            this.ctx_.strokeStyle = 'black'
            this.ctx_.stroke()

            //the curve
            this.ctx_.strokeStyle = color
            this.ctx_.lineWidth = 4 //hardcoded
            this.ctx_.beginPath();
            this.ctx_.moveTo(line_start[0], line_start[1]);
            this.ctx_.quadraticCurveTo(perp[0], perp[1], line_end[0], line_end[1]);
            this.ctx_.stroke();

        }
    }

    _renderNodes(state) {

        for (const [_, nodeData] of Object.entries(state.nodes)) {
            let pos = nodeData['-pos']
            let id = nodeData['-node_id']
            let radius = nodeData['-radius'] || this._nodeDefaults['-radius']
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

    /*Math utils*/
    _scalarMult2d(vec, scale) {
        return [vec[0] * scale, vec[1] * scale]
    }

    _scalarMult3d(vec, scale) {
        return [vec[0] * scale, vec[1] * scale, vec[2] * scale]
    }

    _cross(vec, vec2) {
        return [vec[1] * vec2[2] - vec[2] * vec2[1], vec[2] * vec2[0] - vec[0] * vec2[2], vec[0] * vec2[1] - vec[1] * vec2[0]]
    }

    _middle(vec, vec2) {
        return [(vec[0] + vec2[0]) / 2, (vec[1] + vec2[1]) / 2]
    }

    _mag(vec) {
        return Math.sqrt(vec[0] ** 2 + vec[1] ** 2)
    }

    _norm(vec) {
        return [vec[0] / this._mag(vec), vec[1] / this._mag(vec)]
    }

    _sub(vec, vec2) {
        return [vec[0] - vec2[0], vec[1] - vec2[1]]
    }

    _nodeDefaults = {
        '-color': 'black',
        '-radius': 30
    }

    _connDefaults = {
        '-color': 'black'
    }
}