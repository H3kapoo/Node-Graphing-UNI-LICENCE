/*Internal Imports*/
import { CommandsSchemas } from "./CommandsSchemas"
import { CommandArgParser } from "./CommandArgParser"

/*Class that handles user input parsing from CLI*/
export class CommandParser {
    /*Public funcs*/
    parse(CLIText) {
        let stateChangeMap = {}
        const cmdArgs = CLIText.replace(/\s+/g, ' ').split(' ').filter(el => el.length !== 0)

        if (!cmdArgs.length) throw { 'stage': '[Parse]', 'emptyLine': true, 'msg': 'Empty line. Nothing to do!' }

        if (!CommandsSchemas[cmdArgs[0]]) {
            throw {
                'stage': '[Parse]',
                'msg': `Command '${cmdArgs[0]}' doesn't exist!`
            }
        }

        stateChangeMap.cmdName = cmdArgs[0]

        for (let i = 1; i < cmdArgs.length; i += 2) {

            let opt = cmdArgs[i]
            let optArg = this._isArgThere(cmdArgs, i + 1) ? cmdArgs[i + 1] : null

            if (!CommandsSchemas[cmdArgs[0]][opt]) {
                throw {
                    'stage': '[Parse]',
                    "msg": `There is no option '${opt}' for command: ${cmdArgs[0]} .`
                }
            }

            if (optArg == null) {
                throw {
                    'stage': '[Parse]',
                    "msg": `There is no argument for option: ${opt} .`
                }
            }

            /*Parsing of the actual cmd opt args using the schemas*/
            if (!CommandArgParser[CommandsSchemas[cmdArgs[0]][opt]]) {
                throw {
                    'stage': '[Parse]',
                    "msg": "There is no argument schema to parse this argument,check for misspelling in the command schema."
                }
            }

            /*Throws error on arg parse fail*/
            stateChangeMap[this._noDash(opt)] = CommandArgParser[CommandsSchemas[cmdArgs[0]][opt]](optArg)

        }

        /*Check if all the mandatory opts are there*/
        for (let mandatory of CommandsSchemas[cmdArgs[0]].mandatory) {
            if (!stateChangeMap[this._noDash(mandatory)]) {
                throw {
                    'stage': '[Parse]',
                    "msg": `Mandatory option: '${mandatory}' not present!`
                }
            }
        }
        return stateChangeMap
    }

    /* Utility */
    _noDash(opt) { return opt.substr(1) }
    _isArgThere(cmdTokens, i) { return cmdTokens[i] !== null }

}