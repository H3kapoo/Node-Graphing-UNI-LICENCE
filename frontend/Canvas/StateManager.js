//what is here should not be allowed for the user to thinker with

//NOTE: this all returns to CommandProcessor.js -> GraphManager.js -> stderr/stdout
export class StateManager {
    state_ = {}
    actionsQueue_ = []
    maxNodeId_ = -1
    maxConnId_ = -1

    constructor() {
        this.state_ = {
            "nodes": [],
            "conns": [],
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
        delete opts['cmdName']

        //verify is opts are valid internal ones
        //AND THAT ARGS HAVE THE INTENDED TYPE
        for (const [opt, arg] of Object.entries(opts)) {
            if (!this._isOptSupported('node', opt))
                return {
                    'hasError': true,
                    'msg': "Option '" + opt + "' is not supported on nodes or variable type fed is wrong"
                }
        }

        //AFTER ALL VERIFICATION,GIVE NODE AN UNIQUE ID FROM POOL
        //this option can be only assigned internally
        opts['-node_id'] = this._getNextId('node')

        this.actionsQueue_.push({ 'type': 'createNode', opts })
        return { 'hasError': false, 'msg': 'push added to queue' }
    }

    //this actually applies the states in the queue to the state_
    //called last
    executePushed() {

        for (const act of this.actionsQueue_) {
            switch (act.type) {
                case 'createNode':
                    this.state_.nodes.push(act.opts)
            }
        }

        return { 'msg': this.actionsQueue_ }
    }
    //NOTE:
    //when creating nodes,some opts specified by the user might not be
    //supported, throw error for those at creation
    //this creates one node at the time
    _createNode(opts) {
        //fill with defaults
        //should be some helper func
        // fillDefaults('node',the_node)
        //some dummy defaults for now
        let node = {
            "-radius": 10,
            "-color": "#ff0000",
        }

        //'opts' comes as a map of opts and its args
        //{"type" : "round"} etc
        for (const [opt, arg] of opts.entries()) {
            console.log(opt, arg)
        }
        //assign the id only at the end,after all has been passed
        //also push to state
        node['-id'] = this._getNextId('node')
    }

    updateNode() { }
    deleteNode() { }
    createConn() { }
    updateConn() { }
    deleteCon() { }

    /* Utility */
    //those will act as the only available options internally
    //the user could define a custom option that uses the internally defined ones
    _isOptSupported(type, opt) {
        //this should be extracted somewhere in a file
        const supportedNode = {
            "-radius": true,
            "-pos": true,
            "-color": true,
            "-others": false,
            "-node_id": false
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

    _getNextId(type) {
        if (type === 'node') return ++this.maxNodeId_
        if (type === 'conn') return ++this.maxConnId_
        return 'undefined type'
    }
    _dumpToFile() { }
}