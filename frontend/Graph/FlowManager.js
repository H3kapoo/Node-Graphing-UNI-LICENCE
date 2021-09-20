import { CommandParser } from "../Parser/CommandParser"
import { CommandProcessor } from "../Processor/CommandProcessor"
import { GraphRenderer } from "./GraphRenderer";
import { StateManager } from "./StateManager"
import { AnimationManager } from "../Animation/AnimationManager";

export class FlowManager {

    #canvasManager = undefined
    #CLIManager = undefined
    #graphRenderer = undefined
    #stateManager = undefined
    #animationManager = undefined
    #commandParser = new CommandParser()
    #commandProcessor = new CommandProcessor()

    constructor(canvasManager, CLIManager) {
        this.#canvasManager = canvasManager
        this.#CLIManager = CLIManager
        this.#stateManager = new StateManager()
        this.#animationManager = new AnimationManager()
        this.#graphRenderer = new GraphRenderer(this.#stateManager.getState(), this.#canvasManager.getCanvas())

        /*Set needed refs*/
        this.#stateManager.setAnimationManagerRef(this.#animationManager)

        this.#stateManager.setGraphRendererRef(this.#graphRenderer)

        this.#animationManager.setGraphRendererRef(this.#graphRenderer)

        /*Initial render pass*/
        this.#graphRenderer.render()

        /*Listeners*/
        this.#CLIManager.getCLIObject().addEventListener('keyup', e => this.compute(e))
    }

    async compute(evt) {
        if (evt.which !== 13) return

        /* Output to CLI the cmd inputted by user */
        this.#CLIManager.outputGiven(this.#CLIManager.commandText_)

        if (this.#animationManager.hasNeedsToAwaitAnimation()) {
            this.#CLIManager.outputErr('[Animation]', 'There are awaitable animations ongoing. Command rejected!')
            return
        }

        /* Support for command chaining (&) */
        let splittedChain = this.#CLIManager.commandText_.split('&')

        try {

            for (let commandText of splittedChain) {
                /* Parse into data tokens */
                let parsedResult = this.#commandParser.parse(commandText)

                /* If parsed data is ok,process command on current state schema */
                let processedResult = await this.#commandProcessor.process(this.#stateManager, parsedResult)

                /* Output to CLI the cmd output */
                this.#CLIManager.outputStd('[GraphInfo]', processedResult.msg)
            }
        } catch (err) {

            console.log(err)
            /* Special handle when the line is empty*/
            if (err.emptyLine)
                return this.#CLIManager.outputStd(err.stage, err.msg)

            /* Catch errors thrown by parsing or process stage*/
            this.#CLIManager.outputErr(err.stage, err.msg)
        }
    }
}