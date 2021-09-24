import { Renderer } from "../Renderer/Renderer";
import { NodeObj } from "../Objects/NodeObj";
import { AnimationManager } from "../Animation/AnimationManager"
import { SupportedConnOpts, SupportedNodeOpts, SupportedValidators } from "../Executor/OptionsSupport";

export class ModelApplier {

    #CLILogger
    #graphModelRef
    #renderer
    #animator

    #queueLength = 0
    outputCb = undefined
    #applyResolve = undefined
    #outputQueue = []

    constructor(CLILogger, graphModelRef, canvasManagerRef) {
        this.#CLILogger = CLILogger
        this.#graphModelRef = graphModelRef
        this.#renderer = new Renderer(canvasManagerRef.getCanvas())
        this.#animator = new AnimationManager()

        /*Backend comms*/
        window.api.receive('nodify-indexing-artifacts-toggle', (evt, args) => {
            this.#renderer.render(this.#graphModelRef.getCurrentState(), 'indexing')
        })
    }

    async tryToApply(executorPushCmdQueue) {
        if (!executorPushCmdQueue) return

        this.#CLILogger.outputStd('[GraphInfo]', "Command executing..")
        this.#applyResolve = undefined
        this.#queueLength = executorPushCmdQueue.length
        this.#outputQueue = []

        const commandDonePromise = new Promise((resolve, reject) => { this.#applyResolve = resolve })

        try {
            for (const pushCmd of executorPushCmdQueue)
                switch (pushCmd.type) {
                    case 'CREATE_NODE': await this.applyCreateNode(pushCmd.data)
                        break
                    case 'UPDATE_NODE': await this.applyUpdateNode(pushCmd.data)
                        break
                    case 'DELETE_NODE': await this.applyDeleteNode(pushCmd.data)
                        break
                    //add the rest
                    default:
                        console.log('API_VAL UNKNOWN')
                }

        } catch (e) {
            console.log(e)
            this.#CLILogger.outputErr('[Validation]', e.msg)
        }

        await commandDonePromise
    }

    notifyDone() {
        if (this.#queueLength == 0) {
            this.#CLILogger.outputStd('[GraphInfo]', this.outputCb(this.#outputQueue)) // <= put in here the graph state after cmd
            this.#CLILogger.outputStd('[GraphInfo]', "Command finished!")
            this.#applyResolve()
        }

    }

    async applyCreateNode(nodeOpts) {
        this.#validateUserPushed('node', nodeOpts) //decomment later,refactor

        const nId = this.#graphModelRef.getNextNodeId()
        nodeOpts.nodeId = nId

        const newNode = new NodeObj({ ...nodeOpts })

        let nBefore, nAfter

        if (nodeOpts.anim) {
            this.#graphModelRef.commitNodeCreation(nId, newNode)

            nBefore = { ...this.#graphModelRef.getStateOfNode(nId) }

            await this.#animator.handleAnimation(newNode, () => {
                this.#renderer.render(this.#graphModelRef.getCurrentState())
            }, () => {
                this.#queueLength -= 1
                nAfter = { ...this.#graphModelRef.getStateOfNode(nId) }
                this.#outputQueue.push({ 'type': 'CREATE_NODE', nBefore, nAfter })
                this.notifyDone()
            })

        } else {
            this.#graphModelRef.commitNodeCreation(nId, newNode)

            nBefore = { ...this.#graphModelRef.getStateOfNode(nId) }

            this.#renderer.render(this.#graphModelRef.getCurrentState())
            this.#queueLength -= 1
            nAfter = { ...this.#graphModelRef.getStateOfNode(nId) }
            this.#outputQueue.push({ 'type': 'CREATE_NODE', nBefore, nAfter })
            this.notifyDone()
        }
    }

    async applyUpdateNode(nodeOpts) {
        if (nodeOpts.id === undefined)
            throw {
                'msg': `No NodeId provided for update apply !`
            }

        this.#validateUserPushed('node', nodeOpts)

        const node = this.#graphModelRef.getNodeId(nodeOpts.id)

        if (!node) {
            throw {
                'msg': `Node Id: ${nodeOpts.id} has not been found!`
            }
        }

        /* Nodes have a nodeId internally, discard the passed '-id' */
        /* In order to avoid duplication of same information */
        const nId = nodeOpts.id
        delete nodeOpts.id

        if (nodeOpts.anim) {
            this.#graphModelRef.commitNodeUpdate(nId, nodeOpts)
            await this.#animator.handleAnimation(node, () => {
                this.#renderer.render(this.#graphModelRef.getCurrentState())
            })

        } else {
            this.#graphModelRef.commitNodeUpdate(nId, nodeOpts)
            this.#renderer.render(this.#graphModelRef.getCurrentState())
        }
    }

    async applyDeleteNode(nodeOpts) {

        if (nodeOpts.id === undefined)
            throw {
                'msg': `No NodeId provided for delete apply !`
            }

        const node = this.#graphModelRef.getNodeId(nodeOpts.id)

        if (node === undefined) {
            throw {
                'msg': `Can't delete non-existent node Id: ${nodeOpts.id}`
            }
        }

        //TODO
        /* Find conns referenced by node and delete them */
        // if (node.conn_refs) {
        //     for (let i = 0; i < node.conn_refs.length; i++) {
        //         let connId = node.conn_refs[i]
        //         this.pushDeleteConn(connId)
        //     }
        // }

        if (nodeOpts.anim) {
            /*deletion with animation is STRICTLY awaitable*/
            nodeOpts.anim.awaitable = true
            this.#graphModelRef.commitNodeUpdate(nodeOpts.id, nodeOpts)

            await this.#animator.handleAnimation(node, () => {
                this.#renderer.render(this.#graphModelRef.getCurrentState())
            })
            this.#graphModelRef.commitNodeDelete(nodeOpts.id)

        } else {
            this.#graphModelRef.commitNodeDelete(nodeOpts.id)
            this.#renderer.render(this.#graphModelRef.getCurrentState())
        }
    }

    #validateUserPushed(type, opts) {

        /*If for some reason the user passed empty obj*/
        if (!Object.entries(opts).length)
            throw {
                'msg': `Passed data payload is empty!`
            }

        delete opts['cmdName']

        for (const [opt, arg] of Object.entries(opts)) {
            if (arg === undefined)
                delete opts[opt]
        }

        for (const [opt, arg] of Object.entries(opts)) {
            if (opt === 'anim') continue //skip anims for now

            if (type === 'node') {
                let optSupported = SupportedNodeOpts[opt] ? SupportedNodeOpts[opt].active : false

                if (!optSupported) {
                    throw {
                        'msg': `Option: '${opt}' is not supported on nodes. Check supported node options first!`
                    }
                }

                let argType = SupportedNodeOpts[opt].type
                let typeViolation = !SupportedValidators[argType](arg)

                if (typeViolation) {
                    throw {
                        'msg': `Option: '${opt}' is not of expected type or out of bounds assignment error.\
                                error.Check command logic definition for errors!`
                    }
                }
            }
            if (type === 'conn') {
                let optSupported = SupportedConnOpts[opt] ? SupportedConnOpts[opt].active : false

                if (!optSupported) {
                    throw {
                        'msg': `Option: '${opt}' is not supported on conns. Check supported conns operations first!`
                    }
                }

                let argType = SupportedConnOpts[opt].type
                let typeViolation = !SupportedValidators[argType](arg)

                if (typeViolation) {
                    throw {
                        'msg': `Option: '${opt}' is not of expected type or out of bounds assignment error.\
                                error.Check command logic definition for errors!`
                    }
                }
            }
        }
    }

    isBusy() { return this.#animator.hasNeedsToAwaitAnimation() }
}