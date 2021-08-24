//what is here should not be allowed for the user to thinker with

//NOTE: this all returns to CommandProcessor.js -> GraphManager.js -> stderr/stdout
import { SupportedValidators, SupportedConnOpts, SupportedNodeOpts } from "./StateSupport"

export class StateManager {
    state_ = {}
    actionsQueue_ = []
    maxNodeId_ = -1
    maxConnId_ = -1

    constructor() {
        this.state_ = {
            "nodes": {},
            "conns": {},
        }
    }

    //assure existance
    _assertNodeExists(id) {
        return this.state_.nodes[opts['-id']] === undefined ? false : true
    }

    //only retrieve a copy,not the acutal obj (js reference shit)
    getNodeData() {
        return { ...this.state_.nodes }
    }

    getConnsData() {
        return { ...this.state_.conns }
    }

    //Indeed for now we expect all options to come as this [] and not as this [[]]
    //This might throw a problem in the future and it needs to be addressed

    pushCreateNode(opts) {

        // 1. here we verify all its ok for opts
        // 2. we assign the 'to be created' node an unique ID
        // 3. we push it to the queue
        let verif = this._validateUserProcessed('node', opts)

        if (verif.hasError) return verif

        // AFTER ALL VERIFICATION,GIVE NODE AN UNIQUE ID FROM POOL
        // this option can be only assigned internally
        let nId = this._getNextId('node')
        opts['-node_id'] = nId

        //push to processing queue
        this.actionsQueue_.push({ 'type': 'createNode', 'opts': opts })

        return { 'hasError': false, 'msg': 'Created Node with ID: ' + nId }
    }

    pushUpdateNode(opts) {

        // 1. here we verify all its ok for opts
        // 2. we CHECK if the node id we want to target exists
        // 3. we update all the new opt state to the node

        let verif = this._validateUserProcessed('node', opts)

        if (verif.hasError) return verif

        let node = this.state_.nodes[opts['-id']]

        if (node === undefined) {
            return {
                'hasError': true,
                'msg': 'Node Id ' + opts['-id'] + ' has not been found'
            }
        }

        //nodes have a node_id internally, discard the passed '-id'
        //in order to avoid duplication of same information

        delete opts['-id']
        for (const [opt, arg] of Object.entries(opts))
            node[opt] = arg

        this.actionsQueue_.push({ 'type': 'updateNode', 'opts': node })

        return { 'hasError': false, 'msg': 'Updated Node with ID:' + node['-node_id'] }
    }

    pushDeleteNode(node_id) {
        // 1. see if its really an int // THIS SHOULD NOT BE CHECKED IN HERE BUT AT THE PARSING STAGE
        // 2. check to see it node exists
        // 3. remove the node ID from state
        //TODO 4: delete all connections assoc with this node_id

        let node = this.state_.nodes[node_id]

        if (node === undefined) {
            return {
                'hasError': true,
                'msg': "Can't delete non existent node id: " + node_id
            }
        }

        //find conns referenced by node and delete them
        for (let i = 0; i < node['-conn_refs'].length; i++) {
            let connId = node['-conn_refs'][i]
            let stateResult = this.pushDeleteConn(connId)
            if (stateResult.hasError) stateResult.msg
        }

        this.actionsQueue_.push({ 'type': 'deleteNode', 'opts': node_id })

        return { 'hasError': false, 'msg': 'Deleted Node with ID:' + node_id }
    }

    pushCreateConn(opts) {
        // 1. here we verify all its ok for opts
        // 2. assert node src and dest exist
        // 3. we assign the 'to be created' node an unique ID
        // 4. we push it to the queue
        let verif = this._validateUserProcessed('conn', opts)

        if (verif.hasError) return verif

        if (this.state_.nodes[opts['-id_src']] === undefined ? true : false)
            return {
                'hasError': true,
                'msg': `Node Id ${opts['-id_src']} doesn't exist`
            }

        if (this.state_.nodes[opts['-id_dest']] === undefined ? true : false)
            return {
                'hasError': true,
                'msg': `Node Id ${opts['-id_dest']} doesn't exist`
            }

        let cId = this._getNextId('conn')
        opts['-conn_id'] = cId
        opts['-pos_src'] = this.state_.nodes[opts['-id_src']]['-pos']
        opts['-pos_dest'] = this.state_.nodes[opts['-id_dest']]['-pos']

        //add conn reference to this connected nodes
        if (!this.state_.nodes[opts['-id_src']]['-conn_refs'])
            this.state_.nodes[opts['-id_src']]['-conn_refs'] = []

        if (!this.state_.nodes[opts['-id_dest']]['-conn_refs'])
            this.state_.nodes[opts['-id_dest']]['-conn_refs'] = []

        this.state_.nodes[opts['-id_dest']]['-conn_refs'].push(cId)
        this.state_.nodes[opts['-id_src']]['-conn_refs'].push(cId)

        //push to processing queue
        this.actionsQueue_.push({ 'type': 'createConn', 'opts': opts })

        return { 'hasError': false, 'msg': 'Created Conn with ID: ' + cId }
    }

    pushDeleteConn(conn_id) {
        // 1. see if its really an int // THIS SHOULD NOT BE CHECKED IN HERE BUT AT THE PARSING STAGE
        // 2. check to see it conn exists
        // 3. remove the node ID from state

        let conn = this.state_.conns[conn_id]

        if (conn === undefined) {
            return {
                'hasError': true,
                'msg': "Can't delete non existent conn id: " + conn_id
            }
        }

        this.actionsQueue_.push({ 'type': 'deleteConn', 'opts': conn_id })

        return { 'hasError': false, 'msg': 'Deleted Conn with ID:' + conn_id }
    }


    //this actually applies the states in the queue to the state_
    //called last
    //returns the queue of pushes done, can be used by the user in the logic
    executePushed() {
        for (const act of this.actionsQueue_) {
            switch (act.type) {
                case 'createNode':
                case 'updateNode':
                    this.state_.nodes[act.opts['-node_id']] = act.opts
                    break
                case 'deleteNode':
                    delete this.state_.nodes[act.opts]
                    break
                case 'createConn':
                    this.state_.conns[act.opts['-conn_id']] = act.opts
                    break
                case 'updateConn':
                case 'deleteConn':
                    delete this.state_.conns[act.opts]
                    break
                case 'other':
                    break
                //TBD
            }
        }

        let qActs = this.actionsQueue_
        this.actionsQueue_ = []
        return { 'msg': qActs }
    }

    getState() { return this.state_ }

    /* Utility */
    //those will act as the only available options internally
    //the user could define a custom option that ultimately uses
    //the internally defined ones
    _validateUserProcessed(type, opts) {

        delete opts['cmdName']

        //delete KEEP_UNCHANGED marked opts, those opts wont affect the graph info
        for (const [opt, arg] of Object.entries(opts)) {
            if (arg === "KEEP_UNCHANGED")
                delete opts[opt]
        }

        for (const [opt, arg] of Object.entries(opts)) {

            if (type === 'node') {
                let optSupported = SupportedNodeOpts[opt] ? SupportedNodeOpts[opt].active : false

                if (!optSupported) {
                    return {
                        'hasError': true,
                        'msg': "Option '" + opt + "' is not supported on nodes. Check supported node operations first."
                    }
                }

                let argType = SupportedNodeOpts[opt].type
                let typeViolation = !SupportedValidators[argType](arg)

                if (typeViolation) {
                    return {
                        'hasError': true,
                        'msg': "Option '" + opt + "' is not of expected type or out of bounds assignment\
                         error.Check command logic definition for errors."
                    }
                }
            }
            if (type === 'conn') {
                let optSupported = SupportedConnOpts[opt] ? SupportedConnOpts[opt].active : false

                if (!optSupported) {
                    return {
                        'hasError': true,
                        'msg': "Option '" + opt + "' is not supported on conns. Check supported conns operations first."
                    }
                }

                let argType = SupportedConnOpts[opt].type
                let typeViolation = !SupportedValidators[argType](arg)

                if (typeViolation) {
                    return {
                        'hasError': true,
                        'msg': "Option '" + opt + "' is not of expected type or out of bounds assignment\
                         error.Check command logic definition for errors."
                    }
                }
            }
        }
        return { 'hasError': false }
    }

    _getNextId(type) {
        if (type === 'node') return ++this.maxNodeId_
        if (type === 'conn') return ++this.maxConnId_
        return 'undefined type'
    }

    _dumpStateToFile() { }
    _loadStateFromFile() { }
}