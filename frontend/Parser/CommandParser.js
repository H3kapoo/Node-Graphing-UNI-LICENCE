/*Internal Imports*/
import { CommandsSchemas } from "./CommandsSchemas"
import { CommandArgParser } from "./CommandArgParser"

/*Class that handles user input parsing from CLI*/
export class CommandParser {
    /*Public funcs*/
    parse(CLIText) {
        let stateChangeMap = {}
        const cmdArgs = CLIText.replace(/\s+/g, ' ').split(' ').filter(el => el.length !== 0)

        if (!cmdArgs.length) return { hasError: "false", "msg": "Line empty.Nothing to do!" }

        if (!CommandsSchemas[cmdArgs[0]]) {
            return {
                "hasError": true,
                "msg": `Command '${cmdArgs[0]}' doesn't exist!`
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
                    "msg": `There is no option '${opt}' for command: ${cmdArgs[0]} .`
                }
            }

            if (optArg == null) {
                return {
                    "hasError": true,
                    "msg": `There is no argument for option: ${opt} .`
                }
            }

            /*Parsing of the actual cmd opt args using the schemas*/
            if (!CommandArgParser[CommandsSchemas[cmdArgs[0]][opt]]) {
                return {
                    "hasError": true,
                    "msg": "There is no argument schema to parse this argument,\
                            check for misspelling in the command schema."
                }
            }

            stateChangeMap[opt] = CommandArgParser[CommandsSchemas[cmdArgs[0]][opt]](optArg)

            /*Bubble up more Erros from cmd arg parser here :) to be caught*/
            if (stateChangeMap[opt].hasError)
                return stateChangeMap[opt]
        }

        /*Check if all the mandatory opts are there*/
        for (let mandatory of CommandsSchemas[cmdArgs[0]].mandatory) {
            if (!stateChangeMap[mandatory]) {
                return {
                    "hasError": true,
                    "msg": `Mandatory option: '${mandatory}' not present!`
                }
            }
        }
        return stateChangeMap
    }

    /* Utility */
    _isArgThere(cmdTokens, i) { return cmdTokens[i] !== null }

}