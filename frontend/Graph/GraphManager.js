import { CommandParser } from "../Parser/CommandParser"

export class GraphManager {
    canvasManager_ = undefined
    cliManager_ = undefined

    commandParser_ = new CommandParser()

    constructor(canvasManager, cliManager) {
        this.canvasManager_ = canvasManager
        this.cliManager_ = cliManager
    }

    start() { this.cliManager_.getCLI().addEventListener('keyup', e => this.compute(e)) }
    stop() { this.cliManager_.getCLI().removeEventListener('keyup', e => this.compute(e)) }

    compute(evt) {
        if (evt.which !== 13) return

        //parse into data tokens
        let parsedResult = this.commandParser_.parse(this.cliManager_.getCLI().textContent)
        this.cliManager_.clearAfterDoneWithText()

        console.log('parsed result', parsedResult)

    }

}