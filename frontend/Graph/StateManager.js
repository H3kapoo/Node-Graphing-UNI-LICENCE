/*Internal Imports*/
import { SupportedValidators, SupportedConnOpts, SupportedNodeOpts } from "./StateSupport"
import { NodeObj } from "../Objects/NodeObj"
import { ConnObj } from "../Objects/ConnObj"

/*Class that handles the manipulation of bounded graph state state*/
export class StateManager {
    #state = {}
    #actionsQueue = []
    #maxNodeId = -1
    #maxConnId = -1

    #animationManagerRef = undefined

    constructor() {
        this.#state = {
            "nodes": {},
            "conns": {},
        }
    }

    /*Public funcs*/

    async pushCreateNode(opts) {
        // this._validateUserProcessed('node', opts)

        const nId = this._getNextId('node')
        opts.node_id = nId
        /*Experimental animation stuff*/

        this.#state.nodes[nId] = new NodeObj({ ...opts })

        await this.#animationManagerRef.pushAndWaitAnimIfNeeded(this.#state.nodes[nId])

        return { 'type': 'createNode', 'paramsNow': this.#state.nodes[nId].getCurrentState(), 'paramsBefore': opts }
    }

    pushCreateNode2(opts) {

        /* 1. Here we verify all its ok for opts */
        /* 2. Assign the 'to be created' node an unique ID */
        /* 3. Push it to the queue */

        // this._validateUserProcessed('node', opts)

        /* AFTER ALL VERIFICATION,GIVE NODE AN UNIQUE ID FROM POOL */
        /* this option can be only assigned internally */
        const nId = this._getNextId('node')
        opts.node_id = nId

        /*Push to processing queue */
        this.#actionsQueue.push({ 'type': 'createNode', 'opts': opts, 'param': opts })

        /*Experimental animation data*/
        // opts.anim = {
        //     'shouldWait': false,
        //     'duration': 10000, //travel duration in ms
        //     'pos': [500, 500] //pos target
        // }


        const durationCache = opts.anim.duration
        /*Experimental*/
        opts.notifyUp = (e) => this.notify(e)

        this.#state.nodes[nId] = new NodeObj(opts)

        // if (opts.anim) {
        //     //notify GR to change mode to loop
        //     //notify AM that a new animation has been pooled

        //     // await this.#state.nodes[nId].playAnim(() => this.notify)
        //     // this.notify({ 'animDne': true })
        //     this.notify({ 'hasAnimation': true })
        //     console.log(durationCache)
        //     await this.timeoutPromiseResolve(durationCache)
        // }

        this.notify({ 'mode': 'once' })


        /*Notify renderer and anim observer something happened*/
    }

    pushUpdateNode(opts) {

        /* 1. Here we verify all its ok for opts */
        /* 2. CHECK if the node id we want to target exists */
        /* 3. Update all the new opt state to the node */

        if (opts.id === undefined)
            throw {
                'stage': '[Process]',
                'msg': `No Node Id provided for pushUpdate !`
            }

        this._validateUserProcessed('node', opts)

        let node = this.#state.nodes[opts.id]

        if (node === undefined) {
            throw {
                'stage': '[Process]',
                'msg': `Node Id: ${opts.id} has not been found!`
            }
        }

        /* Nodes have a node_id internally, discard the passed '-id' */
        /* In order to avoid duplication of same information */
        delete opts.id

        /* Calculate what ACTUALLY changed and pass that to push + apply to normal node*/
        let diff = { 'node_id': node.node_id }
        for (const [opt, arg] of Object.entries(opts)) {
            if (!node[opt])
                diff[opt] = arg
            else {
                if (node[opt] !== arg)
                    diff[opt] = arg
            }
            node[opt] = arg
        }

        this.#actionsQueue.push({ 'type': 'updateNode', 'opts': node, 'param': diff })

        this.#state.nodes[node.node_id] = node

    }

    pushDeleteNode(node_id) {
        /* 1. Check to see it node exists */
        /* 2. Remove the node ID from state */

        let node = this.#state.nodes[node_id]

        if (node === undefined) {
            throw {
                'stage': '[Process]',
                'msg': `Can't delete non-existent node Id: ${node_id}`
            }
        }

        /* Find conns referenced by node and delete them */
        if (node.conn_refs) {
            for (let i = 0; i < node.conn_refs.length; i++) {
                let connId = node.conn_refs[i]
                this.pushDeleteConn(connId)
            }
        }
        this.#actionsQueue.push({ 'type': 'deleteNode', 'opts': node_id, 'param': { node_id } })
    }

    pushCreateConn(opts) {
        /* 1. Here we verify all its ok for opts */
        /* 2. Assert node src and dest exist */
        /* 3. Assign the 'to be created' node an unique ID */
        /* 4. Push it to the queue */

        this._validateUserProcessed('conn', opts)

        if (this.#state.nodes[opts.id_src] === undefined)
            throw {
                'stage': '[Process]',
                'msg': `Node Id ${opts.id_src} doesn't exist`
            }

        if (this.#state.nodes[opts.id_dest] === undefined)
            throw {
                'stage': '[Process]',
                'msg': `Node Id ${opts.id_dest} doesn't exist`
            }

        let cId = this._getNextId('conn')
        opts.conn_id = cId

        /* Add conn reference to this connected nodes */
        if (!this.#state.nodes[opts.id_src].conn_refs)
            this.#state.nodes[opts.id_src].conn_refs = []

        if (!this.#state.nodes[opts.id_dest].conn_refs)
            this.#state.nodes[opts.id_dest].conn_refs = []


        //TODO: create adj list for nodes of conn
        this.#state.nodes[opts.id_src].conn_refs.push(cId)
        this.#state.nodes[opts.id_dest].conn_refs.push(cId)

        /* Push to processing queue */
        this.#actionsQueue.push({ 'type': 'createConn', 'opts': opts, 'param': opts })
    }

    pushUpdateConn(opts) {

        /* 1. Here we verify all its ok for opts */
        /* 2. CHECK if the node id we want to target exists */
        /* 3. Update all the new opt state to the node */

        this._validateUserProcessed('conn', opts)

        let conn = this.#state.conns[opts.id]

        if (conn === undefined) {
            throw {
                'stage': '[Process]',
                'msg': `Conn Id: ${opts.id} has no been found!`
            }
        }

        /* Conns have a conn_id internally, discard the passed '-id' */
        /* In order to avoid duplication of same information */
        delete opts.id

        /* Apply opts*/
        /* Calculate what ACTUALLY changed and pass that to push + apply to normal node*/
        let diff = { 'conn_id': conn.conn_id }
        for (const [opt, arg] of Object.entries(opts)) {
            if (!conn[opt])
                diff[opt] = arg
            else {
                if (conn[opt] !== arg)
                    diff[opt] = arg
            }
            conn[opt] = arg
        }

        this.#actionsQueue.push({ 'type': 'updateConn', 'opts': conn, 'param': diff })

        return { 'hasError': false }

    }

    pushDeleteConn(conn_id) {
        /* 1. See if its really an int*/
        /* 2. Check to see it conn exists*/
        /* 3. Remove the node ID from state*/
        /* 4. Remove ConnId from node refs*/

        let conn = this.#state.conns[conn_id]

        if (conn === undefined) {
            throw {
                'stage': '[Process]',
                'msg': `Can't delete non existent conn id: ${conn_id} .`
            }
        }

        let opts = {}

        opts.id_src = conn.id_src
        opts.id_dest = conn.id_dest
        opts.conn_id = conn_id
        opts.validRefs_src = this._removeRefIdOnce(this.#state.nodes[conn.id_src].conn_refs, conn_id)
        opts.validRefs_dest = this._removeRefIdOnce(this.#state.nodes[conn.id_dest].conn_refs, conn_id)

        this.#actionsQueue.push({ 'type': 'deleteConn', opts, 'param': { conn_id } })
    }

    getPushedLogs() {
        // for (const act of this.#actionsQueue) {
        //     switch (act.type) {
        //         case 'createNode':
        //         case 'updateNode':
        //             this.#state.nodes[act.opts.node_id] = act.opts
        //             break
        //         case 'deleteNode':
        //             delete this.#state.nodes[act.opts]
        //             break
        //         case 'createConn':
        //         case 'updateConn':
        //             this.#state.conns[act.opts.conn_id] = act.opts
        //             break
        //         case 'deleteConn':
        //             delete this.#state.conns[act.opts.conn_id]
        //             this.#state.nodes[act.opts.id_src].conn_refs = act.opts.validRefs_src   //update valid refs after deletion
        //             this.#state.nodes[act.opts.id_dest].conn_refs = act.opts.validRefs_dest
        //             break
        //     }
        // }

        let qActs = this.#actionsQueue
        this.#actionsQueue = []
        return { 'msg': qActs }
    }

    clearActionsQueue() { this.#actionsQueue = [] }

    /* Utility */
    _validateUserProcessed(type, opts) {

        /*If for some reason the user passed empty obj*/
        if (!Object.entries(opts).length)
            throw {
                'stage': '[Process]',
                'msg': `Passed data payload is empty!`
            }

        delete opts['cmdName']

        for (const [opt, arg] of Object.entries(opts)) {
            if (arg === undefined)
                delete opts[opt]
        }

        for (const [opt, arg] of Object.entries(opts)) {
            if (type === 'node') {
                let optSupported = SupportedNodeOpts[opt] ? SupportedNodeOpts[opt].active : false

                if (!optSupported) {
                    throw {
                        'stage': '[Process]',
                        'msg': `Option: '${opt}' is not supported on nodes. Check supported node options first!`
                    }
                }

                let argType = SupportedNodeOpts[opt].type
                let typeViolation = !SupportedValidators[argType](arg)

                if (typeViolation) {
                    throw {
                        'stage': '[Process]',
                        'msg': `Option: '${opt}' is not of expected type or out of bounds assignment error.\
                                error.Check command logic definition for errors!`
                    }
                }
            }
            if (type === 'conn') {
                let optSupported = SupportedConnOpts[opt] ? SupportedConnOpts[opt].active : false

                if (!optSupported) {
                    throw {
                        'stage': '[Process]',
                        'msg': `Option: '${opt}' is not supported on conns. Check supported conns operations first!`
                    }
                }

                let argType = SupportedConnOpts[opt].type
                let typeViolation = !SupportedValidators[argType](arg)

                if (typeViolation) {
                    throw {
                        'stage': '[Process]',
                        'msg': `Option: '${opt}' is not of expected type or out of bounds assignment error.\
                                error.Check command logic definition for errors!`
                    }
                }
            }
        }
    }

    _getNextId(type) {
        if (type === 'node') return ++this.#maxNodeId
        if (type === 'conn') return ++this.#maxConnId
        return 'undefined type'
    }

    _removeRefIdOnce(arr, value) {
        let arr2 = [...arr]
        let index = arr2.indexOf(value);
        if (index > -1) {
            arr2.splice(index, 1);
        }
        return arr2;
    }

    /*Setters*/
    setAnimationManagerRef(animationManagerRef) {
        this.#animationManagerRef = animationManagerRef
    }

    /*Getters*/

    getActionsQueue() { return this.#actionsQueue }

    getState() { return this.#state }

    getNodeData() { return { ...this.#state.nodes } }

    getConnsData() { return { ...this.#state.conns } }

}