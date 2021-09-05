/*Internal Imports*/
import { SupportedValidators, SupportedConnOpts, SupportedNodeOpts } from "./StateSupport"

//NOTE: this all returns to CommandProcessor.js -> GraphManager.js -> stderr/stdout

/*Class that handles the manipulation of bounded graph state state*/
export class StateManager {
    _state_ = {}
    _actionsQueue_ = []
    _maxNodeId_ = -1
    _maxConnId_ = -1

    constructor() {
        this._state_ = {
            "nodes": {},
            "conns": {},
        }
    }

    //TODO: Indeed for now we expect all options to come as this [] and not as this [[]]
    //This might throw a problem in the future and it needs to be addressed

    /*Public funcs*/
    pushCreateNode(opts) {

        /* 1. Here we verify all its ok for opts */
        /* 2. Assign the 'to be created' node an unique ID */
        /* 3. Push it to the queue */
        this._validateUserProcessed('node', opts)

        /* AFTER ALL VERIFICATION,GIVE NODE AN UNIQUE ID FROM POOL */
        /* this option can be only assigned internally */
        const nId = this._getNextId('node')
        opts.node_id = nId

        /*Push to processing queue */
        this._actionsQueue_.push({ 'type': 'createNode', 'opts': opts })
    }

    pushUpdateNode(opts) {

        /* 1. Here we verify all its ok for opts */
        /* 2. CHECK if the node id we want to target exists */
        /* 3. Update all the new opt state to the node */

        let verif = this._validateUserProcessed('node', opts)

        if (verif.msg)
            throw verif

        let node = this._state_.nodes[opts['-id']]

        if (node === undefined) {
            throw {
                'msg': `Node Id: ${opts['-id']} has not been found!`
            }
        }

        /* Nodes have a node_id internally, discard the passed '-id' */
        /* In order to avoid duplication of same information */
        delete opts['-id']

        /*calculate what ACTUALLY changed and pass that to push + apply to normal node*/
        let diff = { '-node_id': node['-node_id'] }
        for (const [opt, arg] of Object.entries(opts)) {
            if (!node[opt])
                diff[opt] = arg
            else {
                if (node[opt] !== arg)
                    diff[opt] = arg
            }
            node[opt] = arg
        }

        this._actionsQueue_.push({ 'type': 'updateNode', 'opts': node, 'param': diff })
    }

    pushDeleteNode(node_id) {
        /* 1. Check to see it node exists */
        /* 2. Remove the node ID from state */

        let node = this._state_.nodes[node_id]

        if (node === undefined) {
            throw {
                'msg': `Can't delete non-existent node Id: ${node_id}`
            }
        }

        /* Find conns referenced by node and delete them */
        for (let i = 0; i < node['-conn_refs'].length; i++) {
            let connId = node['-conn_refs'][i]
            this.pushDeleteConn(connId) //TODO: not sure if here needs to be a try/catch,see later
        }

        this._actionsQueue_.push({ 'type': 'deleteNode', 'opts': node_id })
    }

    pushCreateConn(opts) {
        /* 1. Here we verify all its ok for opts */
        /* 2. Assert node src and dest exist */
        /* 3. Assign the 'to be created' node an unique ID */
        /* 4. Push it to the queue */

        let verif = this._validateUserProcessed('conn', opts)

        if (verif.hasError) return verif

        if (this._state_.nodes[opts['-id_src']] === undefined ? true : false)
            return {
                'hasError': true,
                'msg': `Node Id ${opts['-id_src']} doesn't exist`
            }

        if (this._state_.nodes[opts['-id_dest']] === undefined ? true : false)
            return {
                'hasError': true,
                'msg': `Node Id ${opts['-id_dest']} doesn't exist`
            }

        let cId = this._getNextId('conn')
        opts['-conn_id'] = cId

        /* Add conn reference to this connected nodes */
        if (!this._state_.nodes[opts['-id_src']]['-conn_refs'])
            this._state_.nodes[opts['-id_src']]['-conn_refs'] = []

        if (!this._state_.nodes[opts['-id_dest']]['-conn_refs'])
            this._state_.nodes[opts['-id_dest']]['-conn_refs'] = []


        //TODO: create adj list for nodes of conn
        this._state_.nodes[opts['-id_dest']]['-conn_refs'].push(cId)
        this._state_.nodes[opts['-id_src']]['-conn_refs'].push(cId)

        /* Push to processing queue */
        this._actionsQueue_.push({ 'type': 'createConn', 'opts': opts })

        return { 'hasError': false }

    }

    pushUpdateConn(opts) {

        /* 1. Here we verify all its ok for opts */
        /* 2. CHECK if the node id we want to target exists */
        /* 3. Update all the new opt state to the node */

        let verif = this._validateUserProcessed('conn', opts)

        if (verif.hasError) return verif

        let conn = this._state_.conns[opts['-id']]

        if (conn === undefined) {
            return {
                'hasError': true,
                'msg': `Conn Id: ${opts['-id']} has no been found!`
            }
        }

        /* Conns have a conn_id internally, discard the passed '-id' */
        /* In order to avoid duplication of same information */
        delete opts['-id']

        /* Apply opts*/
        for (const [opt, arg] of Object.entries(opts))
            conn[opt] = arg

        this._actionsQueue_.push({ 'type': 'updateConn', 'opts': conn })

        return { 'hasError': false }

    }

    pushDeleteConn(conn_id) {
        /* 1. See if its really an int*/
        /* 2. Check to see it conn exists*/
        /* 3. Remove the node ID from state*/

        let conn = this._state_.conns[conn_id]

        if (conn === undefined) {
            return {
                'hasError': true,
                'msg': `Can't delete non existent conn id: ${conn_id} .`
            }
        }

        this._actionsQueue_.push({ 'type': 'deleteConn', 'opts': conn_id })

        return { 'hasError': false }

    }

    executePushed() {
        for (const act of this._actionsQueue_) {
            switch (act.type) {
                case 'createNode':
                case 'updateNode':
                    this._state_.nodes[act.opts.node_id] = act.opts
                    break
                case 'deleteNode':
                    delete this._state_.nodes[act.opts]
                    break
                case 'createConn':
                case 'updateConn':
                    this._state_.conns[act.opts['-conn_id']] = act.opts
                    break
                case 'deleteConn':
                    delete this._state_.conns[act.opts]
                    break
            }
        }
        let qActs = this._actionsQueue_
        this._actionsQueue_ = []
        return { 'msg': qActs }
    }

    /* Utility */
    _validateUserProcessed(type, opts) {

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
        if (type === 'node') return ++this._maxNodeId_
        if (type === 'conn') return ++this._maxConnId_
        return 'undefined type'
    }

    /*Getters*/
    getState() { return this._state_ }

    getNodeData() { return { ...this._state_.nodes } }

    getConnsData() { return { ...this._state_.conns } }
}