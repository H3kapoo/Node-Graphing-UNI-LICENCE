import { Renderer } from "../Renderer/Renderer";
import { NodeObj } from "../Objects/NodeObj";
import { AnimationManager } from "../Animation/AnimationManager"
import { SupportedConnOpts, SupportedNodeOpts, SupportedValidators } from "../Executor/OptionsSupport";

export class ModelApplier {

    #CLILogger
    #graphModelRef
    #renderer
    #animator

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

        try {
            for (const pushCmd of executorPushCmdQueue)
                switch (pushCmd.type) {
                    case 'CREATE_NODE': await this.applyCreateNode(pushCmd.data)
                    //add the rest
                }
        } catch (e) {
            console.log(e)
            this.#CLILogger.outputErr('[Validation]', e.msg)
        }
    }

    async applyCreateNode(nodeOpts) {
        this.#validateUserPushed('node', nodeOpts) //decomment later,refactor

        const nId = this.#graphModelRef.getNextNodeId()
        nodeOpts.nodeId = nId

        const newNode = new NodeObj({ ...nodeOpts })

        if (nodeOpts.anim) {
            this.#graphModelRef.commitNodeOperation(nId, newNode)
            await this.#animator.handleAnimation(newNode, () => {
                this.#renderer.render(this.#graphModelRef.getCurrentState())
            })

        } else {
            this.#graphModelRef.commitNodeOperation(nId, newNode)
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