/*Class that starts command execution*/
import { CommandsLogic } from "./CommandsLogic"

/*NOTE: this all returns to GraphManager step 4*/
export class CommandProcessor {
    process(graphState, parsedData) {
        /*Check to see if cmd exists*/
        if (!CommandsLogic[parsedData.cmdName])
            return {
                'hasError': true,
                'msg': `Command '${parsedData.cmdName}' exists but has no logic defined.Did you forget to add it?`
            }
        return CommandsLogic[parsedData.cmdName](parsedData, graphState) /*graphState gets updated by reference*/
    }
}