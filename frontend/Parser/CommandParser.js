import { CommandsSchemas } from "./CommandsSchemas" //this will be replaced with a file in the future
import { CommandArgParser } from "./CommandArgParser"

export class CommandParser {
    parse(CLIText) {

        const cmdArgs = CLIText.replace(/\s+/g, ' ').split(' ').filter(el => el.length !== 0)

        let stateChangeMap = {}

        if (!cmdArgs.length) return { hasError: "false" }

        if (!CommandsSchemas[cmdArgs[0]]) {
            return {
                "hasError": true,
                "msg": "Command '" + cmdArgs[0] + "' doesn't exist"
            }
        }

        let cmdNameSplit = cmdArgs[0].split('.')

        for (let i = 1; i < cmdNameSplit.length; i++)
            cmdNameSplit[i] = cmdNameSplit[i].charAt(0).toUpperCase() + cmdNameSplit[i].substr(1)

        let cmdName = cmdNameSplit.join('')

        stateChangeMap.cmdName = cmdName

        for (let i = 1; i < cmdArgs.length; i += 2) {

            let opt = cmdArgs[i]
            let optArg = this._isArgThere(cmdArgs, i + 1) ? cmdArgs[i + 1] : null

            if (!CommandsSchemas[cmdArgs[0]][opt]) {
                return {
                    "hasError": true,
                    "msg": "There is no option " + opt + " for command " + cmdArgs[0]
                }
            }

            if (optArg == null) {
                return {
                    "hasError": true,
                    "msg": "There is no value for option " + opt
                }
            }

            //parsing of the actual cmd using the schemas
            stateChangeMap[opt] = CommandArgParser[CommandsSchemas[cmdArgs[0]][opt]](optArg)

            //bubble up more ERRORS from cmd arg parser here :) to be caught
            if (stateChangeMap[opt].hasError)
                return stateChangeMap[opt]
        }

        //check if all the mandatory opts are there
        for (let mandatory of CommandsSchemas[cmdArgs[0]].mandatory) {
            if (!stateChangeMap[mandatory]) {
                return {
                    "hasError": true,
                    "msg": "Mandatory opt " + mandatory + " not found"
                }
            }
        }

        return stateChangeMap
    }

    /* Utility */

    _isArgThere(cmdTokens, i) { return cmdTokens[i] !== null }

}