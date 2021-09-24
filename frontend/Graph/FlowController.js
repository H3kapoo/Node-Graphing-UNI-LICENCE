import { CMDParser } from "../Parser/CMDParser"
import { CMDExecutor } from "../Executor/CMDExecutor";
import { GraphModel } from "../Models/GraphModel";
import { ModelApplier } from "../Applier/ModelApplier";

export class FlowManager {

    #canvasManager
    #CLIManager
    #graphModel
    #cmdParser
    #cmdExecutor
    #modelApplier

    constructor(canvasManager, CLIManager) {

        this.#canvasManager = canvasManager
        this.#CLIManager = CLIManager
        this.#graphModel = new GraphModel()
        this.#cmdParser = new CMDParser(this.#CLIManager)
        this.#cmdExecutor = new CMDExecutor(this.#CLIManager)
        this.#modelApplier = new ModelApplier(this.#CLIManager, this.#graphModel, this.#canvasManager) //last param to be removed

        /*Listeners*/
        this.#CLIManager.getCLIObject().addEventListener('keyup', e => this.compute(e))
    }

    async compute(evt) {
        if (evt.which !== 13) return

        if (this.#modelApplier.isBusy()) {
            this.#CLIManager.outputErr('[Animation]', 'Canvas is busy drawing! Command Rejected!')
            return
        } else
            this.#CLIManager.outputEcho(this.#CLIManager.commandText)

        const splittedChain = this.#CLIManager.commandText.split('&&')

        for (const cmd of splittedChain) {
            const parsedPayload = this.#cmdParser.parse(cmd)
            const queue = this.#cmdExecutor.execute(parsedPayload)

            if (!queue) continue

            this.#modelApplier.outputCb = queue.outputFunc
            await this.#modelApplier.tryToApply(queue.executorPushCmdQueue)
        }
    }
}