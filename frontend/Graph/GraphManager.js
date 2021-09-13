/*Internal imports*/
import { StateManager } from "./StateManager"
import { CommandParser } from "../Parser/CommandParser"
import { CommandProcessor } from "../Processor/CommandProcessor"
import { GraphRenderer } from "./GraphRenderer"

export class GraphManager {
    #canvasManager = undefined
    _cliManager_ = undefined

    _commandParser_ = new CommandParser()
    _commandProcessor_ = new CommandProcessor()
    #graphState = new StateManager()

    #animationManager = undefined
    #graphRenderer = undefined
    _graphRendererInterval_ = undefined

    #indexingFlag = true //always show indexing at startup 

    constructor(canvasManager, cliManager) {
        this.#canvasManager = canvasManager
        this._cliManager_ = cliManager
        this.#graphRenderer = new GraphRenderer(this.#canvasManager.getCanvas())

        /*Trigger rendering loop*/
        this.#graphRenderer.render(this.#graphState.getState(), this.#indexingFlag)

        /*Backend comms*/
        window.api.receive('nodify-indexing-artifacts-toggle', (evt, args) => {
            this.#indexingFlag = !this.#indexingFlag
            this.#graphRenderer.render(this.#graphState.getState(), this.#indexingFlag)
        })
    }

    /*Public funcs*/

    async compute(evt) {

        if (evt.which !== 13) return

        /* Output to CLI the cmd inputted by user */
        this._cliManager_.outputGiven(this._cliManager_.commandText_)

        /* Support for command chaining (&) */
        let splittedChain = this._cliManager_.commandText_.split('&')

        try {

            for (let commandText of splittedChain) {
                /* Parse into data tokens */
                let parsedResult = this._commandParser_.parse(commandText)

                /* If parsed data is ok,process command on current state schema */
                let processedResult = await this._commandProcessor_.process(this.#graphState, parsedResult)

                /* Render pass*/
                this.#graphRenderer.render(this.#graphState.getState(), this.#indexingFlag)

                /* Output to CLI the cmd output */
                this._cliManager_.outputStd('[GraphInfo]', "processedResult.msg")
            }
        } catch (err) {
            console.log(err)
            /* Special handle when the line is empty*/
            if (err.emptyLine)
                return this._cliManager_.outputStd(err.stage, err.msg)

            /* Catch errors thrown by parsing or process stage*/
            this._cliManager_.outputErr(err.stage, err.msg)
        }
    }

    start() { this._cliManager_.getCLIObject().addEventListener('keyup', e => this.compute(e)) }

    stop() { this._cliManager_.getCLIObject().removeEventListener('keyup', e => this.compute(e)) }

}