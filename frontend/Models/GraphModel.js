export class GraphModel {

    #maxNodeId = 0
    #maxConnId = 0
    #modelData = {}

    constructor() {
        this.#modelData = {
            'nodes': {},
            'conns': {}
        }
    }

    commitNodeOperation(id, node) {
        this.#modelData.nodes[id] = node
    }

    commitConnOperation(id, conn) {
        this.#modelData.conns[id] = conn
    }

    getCurrentState() {
        return this.#modelData
    }

    getNextNodeId() { return this.#maxNodeId++ }

    getNextConnId() { return this.#maxConnId++ }
}