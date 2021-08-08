import { CommandsSchemas } from "./CommandsSchemas" //this will be replaced with a file in the future
import { CommandArgParser } from "./CommandArgParser"

export class CommandParser {
    parse(CLIText) {

        const cmdArgs = CLIText.replace(/\s+/g, ' ').split(' ').filter(el => el.length !== 0)

        let stateChangeMap = {}

        if (!cmdArgs.length) return

        if (!CommandsSchemas[cmdArgs[0]]) {
            //BUBBLE UP ERROR INSTEAD BY RETURNING
            console.log("Command " + cmdArgs[0] + " doesn't exist")
            return
        }

        //namespace.cmd usually
        stateChangeMap.cmdName = cmdArgs[0]

        for (let i = 1; i < cmdArgs.length; i += 2) {

            let opt = cmdArgs[i]
            let optArg = this._isArgThere(cmdArgs, i + 1) ? cmdArgs[i + 1] : null

            if (!CommandsSchemas[cmdArgs[0]][opt]) {
                //BUBBLE UP ERROR INSTEAD BY RETURNING
                console.log("There is no option " + opt + " for command " + cmdArgs[0])
                return
            }

            if (optArg == null) {
                //BUBBLE UP ERROR INSTEAD BY RETURNING
                console.log("There is no value for option " + opt)
                return
            }

            //parsing of the actual cmd using the schemas
            stateChangeMap[opt] = CommandArgParser[CommandsSchemas[cmdArgs[0]][opt]](optArg)
            //bubble up more errors from cmd arg parser here :) to be caught

            if (stateChangeMap[opt].length == 0) {
                //BUBBLE UP ERROR INSTEAD BY RETURNING
                //i dont know what i meant by this, should be imp ig
                console.log("aaa")
                return
            }
        }

        //check if all the mandatory opts are there
        for (let mandatory of CommandsSchemas[cmdArgs[0]].mandatory) {
            if (!stateChangeMap[mandatory]) {
                //BUBBLE UP ERROR INSTEAD BY RETURNING
                console.log("Mandatory opt " + mandatory + " not found")
                return
            }
        }

        return stateChangeMap
    }

    /* Utility */

    _isArgThere(cmdTokens, i) { return cmdTokens[i] !== null }

}