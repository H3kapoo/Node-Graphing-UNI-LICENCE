/*Internal imports*/
import { StateManager } from "../Canvas/StateManager"
import { CommandParser } from "../Parser/CommandParser"
import { CommandProcessor } from "../Processor/CommandProcessor"
import { GraphRenderer } from "../Canvas/GraphRenderer"

export class GraphManager {
    _canvasManager_ = undefined
    _cliManager_ = undefined

    _commandParser_ = new CommandParser()
    _commandProcessor_ = new CommandProcessor()
    graphState_ = new StateManager()
    graphRenderer_ = undefined

    _indexingFlag_ = false

    constructor(canvasManager, cliManager) {
        this._canvasManager_ = canvasManager
        this._cliManager_ = cliManager
        this.graphRenderer_ = new GraphRenderer(this._canvasManager_.getCanvasDetails())

        /*Backend comms*/
        window.api.receive('nodify-indexing-artifacts-toggle', (evt, args) => {
            this._indexingFlag_ = !this._indexingFlag_
            this.graphRenderer_.render(this.graphState_.getState(), this._indexingFlag_)
        })
    }

    /*Public funcs*/
    compute(evt) {
        if (evt.which !== 13) return

        /*0. Support for command chaining (&) */
        let splittedChain = this._cliManager_.getCLIObject().textContent.split('&')

        for (let commandText of splittedChain) {
            /*1. Parse into data tokens */
            let parsedResult = this._commandParser_.parse(commandText)

            /*2. Clear cli text after parse */
            this._cliManager_.clearAfterDoneWithText()

            /*3. Catch any errors thrown by parsing stage */
            if (parsedResult.hasError)
                return this._cliManager_.outputErr('[Parse]', parsedResult.msg)

            /*4. If parsed data is ok,process command on current state schema */
            let processedResult = this._commandProcessor_.process(this.graphState_, parsedResult)

            /*5. Catch any errors thrown by process stage */
            if (processedResult.hasError)
                return this._cliManager_.outputErr('[Process]', processedResult.msg)

            /*6. Do the rendering with updates applied */
            this.graphRenderer_.render(this.graphState_.getState(), this._indexingFlag_)

            /*7. Output to CLI the cmd output */
            this._cliManager_.outputStd('[GraphInfo]', processedResult.msg)
        }
    }

    start() { this._cliManager_.getCLIObject().addEventListener('keyup', e => this.compute(e)) }

    stop() { this._cliManager_.getCLIObject().removeEventListener('keyup', e => this.compute(e)) }

}