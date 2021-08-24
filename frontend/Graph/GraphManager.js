import { StateManager } from "../Canvas/StateManager"
import { CommandParser } from "../Parser/CommandParser"
import { CommandProcessor } from "../Processor/CommandProcessor"
import { GraphRenderer } from "../Canvas/GraphRenderer"

//NOTE: AN ERROR CREATOR HELPER CLASS SHOULD BE IMPLEMENTED
//      AT SOME POINT TO PRETIFY THE OUTPUT
export class GraphManager {
    canvasManager_ = undefined
    cliManager_ = undefined

    commandParser_ = new CommandParser()
    commandProcessor_ = new CommandProcessor()
    graphState_ = new StateManager()
    graphRenderer_ = undefined

    constructor(canvasManager, cliManager) {
        this.canvasManager_ = canvasManager
        this.cliManager_ = cliManager
        this.graphRenderer_ = new GraphRenderer(this.canvasManager_.getCanvasDetails())
    }

    compute(evt) {

        //TODO: HANDLE CASES WHEN parsedResult.hasError IS UNDEFINED
        if (evt.which !== 13) return

        //1. parse into data tokens DONE
        let parsedResult = this.commandParser_.parse(this.cliManager_.getCLI().textContent)

        //2. clear cli text after parse DONE
        this.cliManager_.clearAfterDoneWithText()

        //3. catch any errors thrown by parsing stage DONE
        // console.log(parsedResult)
        if (parsedResult.hasError)
            return this.cliManager_.outputErr('[Parse]', parsedResult.msg)

        //4. if parsed data is ok,process command on current state schema WORKING ON
        let processedResult = this.commandProcessor_.process(this.graphState_, parsedResult)

        //5. catch any errors thrown by process stage SEMI-DONE
        if (processedResult.hasError)
            return this.cliManager_.outputErr('[Process]', processedResult.msg)

        //6. do the rendering with updates applied TBD
        this.graphRenderer_.render(this.graphState_.getState())

        //7. output to CLI the cmd output DONE
        console.log('graph ', this.graphState_.state_)
        this.cliManager_.outputStd('[GraphInfo]', processedResult.msg)

    }

    start() { this.cliManager_.getCLI().addEventListener('keyup', e => this.compute(e)) }
    stop() { this.cliManager_.getCLI().removeEventListener('keyup', e => this.compute(e)) }

}