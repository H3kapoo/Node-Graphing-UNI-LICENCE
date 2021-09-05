/*Internal imports*/
import { StateManager } from "./StateManager"
import { CommandParser } from "../Parser/CommandParser"
import { CommandProcessor } from "../Processor/CommandProcessor"
import { GraphRenderer } from "./GraphRenderer"

export class GraphManager {
    _canvasManager_ = undefined
    _cliManager_ = undefined

    _commandParser_ = new CommandParser()
    _commandProcessor_ = new CommandProcessor()
    graphState_ = new StateManager()
    graphRenderer_ = undefined

    _indexingFlag_ = true //always show indexing at startup 

    constructor(canvasManager, cliManager) {
        this._canvasManager_ = canvasManager
        this._cliManager_ = cliManager
        this.graphRenderer_ = new GraphRenderer(this._canvasManager_.getCanvas())

        /*Show grid at start*/
        this.graphRenderer_.render(this.graphState_.getState(), this._indexingFlag_)

        /*Backend comms*/
        window.api.receive('nodify-indexing-artifacts-toggle', (evt, args) => {
            this._indexingFlag_ = !this._indexingFlag_
            this.graphRenderer_.render(this.graphState_.getState(), this._indexingFlag_)
        })
    }

    /*Public funcs*/
    compute(evt) {

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
                let processedResult = this._commandProcessor_.process(this.graphState_, parsedResult)

                /* Do the rendering with updates applied */
                this.graphRenderer_.render(this.graphState_.getState(), this._indexingFlag_)

                /* Output to CLI the cmd output */
                this._cliManager_.outputStd('[GraphInfo]', processedResult.msg)
            }
        } catch (err) {
            /* Special handle when the line is empty*/
            if (err.emptyLine)
                return this._cliManager_.outputStd(err.stage, err.msg)

            /* Catch errors thrown by parsing or process stage*/
            console.log(err.stage)
            this._cliManager_.outputErr(err.stage, err.msg)
        }
    }

    start() { this._cliManager_.getCLIObject().addEventListener('keyup', e => this.compute(e)) }

    stop() { this._cliManager_.getCLIObject().removeEventListener('keyup', e => this.compute(e)) }

}