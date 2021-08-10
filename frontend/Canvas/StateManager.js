//what is here should not be allowed for the user to thinker with

//NOTE: this all returns to CommandProcessor.js -> GraphManager.js -> stderr/stdout
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
    //THIS ACTS LIKE A VALIDATION STAGE ONLY THAT BUILDS
    //SOME REQUIREMENTS FOR THE 'MERGE' 
    //NEEDS FURTHER WORK
    //validation happens here for the opts
    //throws any errors that might happen
    //if valid push to queue the action
    //check that all objecs are not 2D vecs but 1D ones TO THIS IN LATER STAGE
    pushCreateNode(opts) {

        // 1. here we verify all its ok for opts
        // 2. we assign the 'to be created' node an unique ID
        // 3. we push it to the queue
        let verif = this._precheck(opts)

        if (verif.hasError) return verif

        // AFTER ALL VERIFICATION,GIVE NODE AN UNIQUE ID FROM POOL
        // this option can be only assigned internally

        opts['-node_id'] = this._getNextId('node')

        //push to processing queue
        this.actionsQueue_.push({ 'type': 'createNode', 'opts': opts })

        return { 'hasError': false, 'msg': 'create push added to queue' }
    }

    pushUpdateNode(opts) {

        // 1. here we verify all its ok for opts
        // 2. we CHECK if the node id we want to target exists
        // 3. we update all the new opt state to the node

        let verif = this._precheck(opts)

        if (verif.hasError) return verif

        let node = this.state_.nodes[opts['-id']]

        if (node === undefined) {
            return {
                'hasError': true,
                'msg': 'node id ' + opts['-id'] + ' has not been found'
            }
        }

        delete opts['-id']
        for (const [opt, arg] of Object.entries(opts))
            node[opt] = arg

        //push to queue
        this.actionsQueue_.push({ 'type': 'updateNode', 'opts': node })

        return { 'hasError': false, 'msg': 'update push added to queue' }
    }

    pushDeleteNode(node_id) {
        // 1. see if its really an int
        // 2. check to see it node exists
        // 3. remove the node ID from state
        console.log(typeof node_id)
        if (isNaN(node_id) && isNaN(parseInt(node_id)))
            return {
                'hasError': true,
                'msg': 'node id ' + node_id + ' should be INT but its not'
            }

        let node = this.state_.nodes[node_id]

        if (node === undefined) {
            return {
                'hasError': true,
                'msg': "can't delete non existent node id " + node_id
            }
        }

        this.actionsQueue_.push({ 'type': 'deleteNode', 'opts': node_id })

        return { 'hasError': false, 'msg': 'delete push added to queue' }

    }

    //this actually applies the states in the queue to the state_
    //called last
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
        let q = this.actionsQueue_
        this.actionsQueue_ = []
        //this should only return the actions done THIS pass
        console.log('State after cmd ', this.state_.nodes)

        return { 'msg': q }
    }

    /* Utility */
    //those will act as the only available options internally
    //the user could define a custom option that ultimately uses
    //the internally defined ones
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

    _getNextId(type) {
        if (type === 'node') return ++this.maxNodeId_
        if (type === 'conn') return ++this.maxConnId_
        return 'undefined type'
    }
    _dumpStateToFile() { }
    _loadStateFromFile() { }
}