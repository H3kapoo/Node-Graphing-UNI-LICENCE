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

        //push to queue
        this.actionsQueue_.push({ 'type': 'updateNode', 'opts': node })

        return { 'hasError': false, 'msg': 'Updated Node with ID:' + node['-node_id'] }
    }

    pushDeleteNode(node_id) {
        // 1. see if its really an int // THIS SHOULD NOT BE CHECKED IN HERE BUT AT THE PARSING STAGE
        // 2. check to see it node exists
        // 3. remove the node ID from state
        // if (isNaN(node_id) && isNaN(parseInt(node_id)))
        //     return {
        //         'hasError': true,
        //         'msg': 'node id ' + node_id + ' should be INT but its not'
        //     }

        let node = this.state_.nodes[node_id]

        if (node === undefined) {
            return {
                'hasError': true,
                'msg': "Can't delete non existent node id: " + node_id
            }
        }

        this.actionsQueue_.push({ 'type': 'deleteNode', 'opts': node_id })

        return { 'hasError': false, 'msg': 'delete push added to queue' }

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
                case 'updateConn':
                case 'deleteConn':
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
            if (arg === "KEEP_UNCHANGED") {
                delete opts[opt]
                console.log('deleted ', opt, ' from validation')
            }
        }

        for (const [opt, arg] of Object.entries(opts)) {

            if (type === 'node') {
                let optNotSupported = !SupportedNodeOpts[opt].active

                if (optNotSupported) {
                    return {
                        'hasError': true,
                        'msg': "Option '" + opt + "' is not supported on nodes, check supported node operations first"
                    }
                }

                let argType = SupportedNodeOpts[opt].type
                let typeViolation = !SupportedValidators[argType](arg)

                if (typeViolation) {
                    return {
                        'hasError': true,
                        'msg': "Option '" + opt + "' is not of expected type or out of bounds assignment\
                         error, check command logic definition"
                    }
                }

            }
            if (type === 'conn') { }
        }
        return { 'hasError': false, 'msg': 'Validation Success' }

    }

    _precheck(opts) {
        // VERIFICATION
        // we dont need the cmd name anymore
        delete opts['cmdName']

        //verify is opts are valid internal ones
        //AND THAT ARGS HAVE THE INTENDED TYPE
        for (const [opt, arg] of Object.entries(opts)) {
            //CHECK OPT SUPPORT FOR 'NODE'
            if (!this._isOptSupported('node', opt))
                return {
                    'hasError': true,
                    'msg': "Option '" + opt + "' is not supported on nodes, check supported node operations first"
                }
            //CHECK IF ARG OF VALID TYPE
            if (!this._isOfValidType(opt, arg))
                return {
                    'hasError': true,
                    'msg': "Option '" + opt + "' is not of expected type or _va error, check command logic definitions"
                }
        }
        return { 'hasError': false, 'msg': 'push added to queue' }
    }
    _isOptSupported(type, opt) {
        //this should be extracted somewhere in a file along with validType
        const supportedNode = {
            "-radius": true,
            "-pos": true,
            "-color": true,
            "-node_id": true,
            "-type": true,
            "-id": true,
            "-others": false,
        }
        const supportedConn = {
            "-color": true,
            "-others": false,
        }

        if (type == 'node')
            return supportedNode[opt] ? supportedNode[opt] : false
        if (type == 'conn')
            return supportedConn[opt] ? supportedConn[opt] : false

        return "fatal error support opt"
    }
    _isOfValidType(opt, arg) {
        const opts = {
            "-radius": 'integer',
            "-type": 'string',
            "-pos": 'intPairVec',
            "-color": 'string',
            "-id": 'integer'
        }

        const validators = {
            string(a) {
                return (typeof a === 'string')
            },
            integer(a) {
                return !isNaN(a) && !isNaN(parseInt(a))
            },
            intPairVec(a) {
                if (a.length !== 2) return false

                return !isNaN(a[0]) && !isNaN(parseInt(a[0])) &&
                    !isNaN(a[1]) && !isNaN(parseInt(a[1]))
            }
        }
        return validators[opts[opt]](arg)
    }

    _getNextId(type) {
        if (type === 'node') return ++this.maxNodeId_
        if (type === 'conn') return ++this.maxConnId_
        return 'undefined type'
    }

    _dumpStateToFile() { }
    _loadStateFromFile() { }
}