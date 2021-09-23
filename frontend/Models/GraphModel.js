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

    commitNodeCreation(id, node) {
        this.#modelData.nodes[id] = node
    }

    commitNodeUpdate(id, opts) {
        const state = this.#modelData.nodes[id].getCurrentState()
        console.log({ ...this.#modelData.nodes[id].getCurrentState() })

        for (const [opt, arg] of Object.entries(opts))
            state[opt] = arg

        this.#modelData.nodes[id].setCurrentState(state)

    }

    commitNodeDelete(id) {
        delete this.#modelData.nodes[id]
    }

    commitConnOperation(id, conn) {
        this.#modelData.conns[id] = conn
    }

    assertNodeExistence(id) { return this.#modelData.nodes[id] }

    getCurrentState() { return this.#modelData }

    getNextNodeId() { return this.#maxNodeId++ }

    getNextConnId() { return this.#maxConnId++ }
}