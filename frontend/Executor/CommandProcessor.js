/*Class that starts command execution*/
import { CommandsLogic } from "./CommandsLogic"

/*NOTE: this all returns to GraphManager step 4*/
export class CommandProcessor {
    process(graphState, parsedData) {

        /*Check to see if cmd exists*/
        if (!CommandsLogic[parsedData.cmdName])
            throw {
                'stage': '[Process]',
                'msg': `Command '${parsedData.cmdName}' exists but has no logic defined.Did you forget to add it?`
            }

        /*Attach helper get func to object*/
        parsedData.get = function (opt) {
            if (this[opt])
                return this[opt]
            return []
        }

        /*Bubble up errors to GraphManager*/
        return CommandsLogic[parsedData.cmdName](parsedData, graphState) /*graphState gets updated by reference*/
    }
}