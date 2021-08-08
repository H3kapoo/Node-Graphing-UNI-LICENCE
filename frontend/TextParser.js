// import { StateManager } from "./StateManager"
import { CommandsSchemas, CommandsArgParser } from "./Parser/CommandsSchemas"
// import { CommandProcessor } from "./CommandProcessor"

export class TextParser {

    keywordsArray = []
    history = []
    historyOffset = 0

    /*
      history realted things should be moved to a separate logic class
      strictly leave here all that has to do with text command parsing
    */

    /* Core */

    setChangeListenerOnCLIObjectClassName(CLIObjectClassName) {
        const CLIObject = document.getElementsByClassName(CLIObjectClassName)[0]

        if (CLIObject === undefined) {
            console.log(`%c${this.className}::${this.setChangeListenerOnCLIObjectClassName.name}::CLIObject not found in HTML`, 'color: #ff0000')
            return
        }

        CLIObject.addEventListener("paste", function (e) {
            // cancel paste
            e.preventDefault();

            // get text representation of clipboard
            var text = " " + e.clipboardData.getData("text/plain");

            // insert text manually
            document.execCommand("insertText", false, text);
        });
        CLIObject.addEventListener('focus', evt => this.focusTesting(CLIObject))
        CLIObject.addEventListener('keydown', evt => this.keyDownTesting(evt, CLIObject))
        CLIObject.addEventListener('keyup', evt => this.keyUpTesting(evt, CLIObject))
        CLIObject.addEventListener('input', evt => this.inputTesting(CLIObject))

        // CLIObject.addEventListener('input', evt => this.getCommandsMapFromRawText(CLIObject))
        console.log(`%c${this.className}::${this.setChangeListenerOnCLIObjectClassName.name}::Evt set on 'input'`, 'color: #00ff00')

    }
    keyDownTesting(evt, CLIObject) {
        if (!evt)
            evt = window.event;

        if (evt.preventDefault && evt.which === 13)
            evt.preventDefault();
    }

    inputTesting(CLIObject) { this.historyOffset = 0 }

    keyUpTesting(evt, CLIObject) {
        //handle history up
        if (evt.which === 38) {

            if (this.historyOffset + 1 <= this.history.length)
                this.historyOffset += 1

            let index = this.history.length - this.historyOffset

            // CLIObject.innerHTML = "&nbsp;&nbsp;"
            CLIObject.textContent = " "
            CLIObject.textContent += this.history[index].replace(/\s{2,1000}/g, '');
            this.setEndOfContenteditable(CLIObject)
            this.focusTesting(CLIObject)
        }
        //handle history down
        else if (evt.which === 40) {

            if (this.historyOffset - 1 > 0)
                this.historyOffset -= 1

            let index = this.history.length - this.historyOffset

            CLIObject.textContent = " "
            CLIObject.textContent += this.history[index].replace(/\s{2,1000}/g, '');
            this.setEndOfContenteditable(CLIObject)
            this.focusTesting(CLIObject)
        }
        //handle enter key
        else if (evt.which === 13) {
            this.historyOffset = 0
            this.history.push(CLIObject.textContent);

            let newDiv = document.createElement("div")
            let strippedText = this.stripHTMLFromString(CLIObject.textContent);

            newDiv.id = "cmd-text"

            const currentDiv = document.getElementById("cmd-prepender");
            currentDiv.appendChild(newDiv)
            CLIObject.textContent = ""
            this.setEndOfContenteditable(CLIObject)
            this.focusTesting(CLIObject)

            this.prepareCmd(strippedText)

        }

    }

    prepareCmd(cmdText) {

        const cmdArgs = cmdText.replace(/\s+/g, ' ').split(' ').filter(el => el.length !== 0)
        console.log(cmdArgs)
        let cmdStateChangeMap = {}

        if (!cmdArgs.length) return
        if (!CommandsSchemas[cmdArgs[0]]) {
            console.log("Command " + cmdArgs[0] + "doesn't exist")
            return
        }

        cmdStateChangeMap.cmdName = cmdArgs[0]

        for (let i = 1; i < cmdArgs.length; i += 2) {

            let opt = cmdArgs[i]
            let optArg = this.isArgThere(cmdArgs, i + 1) ? cmdArgs[i + 1] : null

            if (!CommandsSchemas[cmdArgs[0]][opt]) {
                console.log("There is no option " + opt + " for command " + cmdArgs[0])
                return
            }

            if (optArg == null) {
                console.log("There is no value for option " + opt)
                return
            }

            cmdStateChangeMap[opt] = CommandsArgParser[CommandsSchemas[cmdArgs[0]][opt]](optArg)

            if (cmdStateChangeMap[opt].length == 0) {
                console.log("aaa")
                return
            }
        }

        for (let mandatory of CommandsSchemas[cmdArgs[0]].mandatory) {
            if (!cmdStateChangeMap[mandatory]) {
                console.log("Mandatory opt " + mandatory + " not found")
                return
            }
        }
        // new CommandProcessor().process(cmdStateChangeMap)
    }

    isArgThere(cmdTokens, i) { return cmdTokens[i] !== null }

    focusTesting(CLIObject) {
        if (!CLIObject.textContent.length) {
            CLIObject.textContent = " "
            this.setEndOfContenteditable(CLIObject)
        }
    }

    getCommandsMapFromRawText(CLIObject) {

        let rawText = CLIObject.innerHTML
        let strippedText = this.stripHTMLFromString(CLIObject.innerHTML)
        let filteredTokens = strippedText.split(' ').filter(el => el.length !== 0)
        let cmdsArrayIndexes = []

        filteredTokens.forEach((token, tokenIndex) => {
            if (this.isCommand(token)) {
                cmdsArrayIndexes.push(tokenIndex)
            }
        })

        let cmdI = {
            "cmd": "add",
            "cmdTokens": ["bla", "bla"]
        }
        //processed cmd
        let cmd = {
            "cmd": "conn",
            "from_node_id": 1,
            "to_node_id": 2,
            "opts": {
                "type": "-bid",
                "width": 2,
                "text_start": "con text",
                "text_end": "end text",
                "color": "#ff44ee"
            }
        }
        this.createStateChangeMap(this.mapTokensToCommands(cmdsArrayIndexes, filteredTokens))

        CLIObject.previousElementSibling.innerHTML = rawText

    }

    createStateChangeMap(tokensToCommandsMap) {

        if (tokensToCommandsMap === undefined) return

        let changeStateMapList = []

        for (let cmdAndTokens of tokensToCommandsMap) {
            switch (cmdAndTokens.cmd) {
                case "con":
                    changeStateMapList.push(this.getStateChangeSchema_CON(cmdAndTokens.cmdTokens))
                    break;
                case "grpc":
                    changeStateMapList.push(this.getStateChangeSchema_GRPC(cmdAndTokens.cmdTokens))

            }
        }
        // if (changeStateMapList)
        //     console.log(changeStateMapList)
        return changeStateMapList
    }

    getStateChangeSchema_GRPC(cmdTokens) { }

    getStateChangeSchema_CON(cmdTokens) {
        //con // {1} {3} -bid
        //["t","o","k"]
        let conSchema = {
            "affected_area": "connections",
            "affected_ids": [null, null],
            "affected_values": {
                "type": "-uni"
            }
        }

        const validIndexesAndIds = this.extractNodeIds(cmdTokens)

        conSchema.affected_ids = validIndexesAndIds.map(el => el.nr)

        const valuesChangesMap = this.extractValuesChanged(cmdTokens)
        //remove IDs tokens
        cmdTokens = cmdTokens.filter((_, index) => !(validIndexesAndIds.map(el => el.index)).includes(index))

        console.log(conSchema)
    }

    /* Loaders */

    loadKeyWordsFrom(pathToFile) { /*load*/ }

    loadKeyWordsASAP(keywordsArray) { this.keywordsArray = keywordsArray }

    /* Utility */

    setEndOfContenteditable(contentEditableElement) {
        let range, selection;
        if (document.createRange) {
            range = document.createRange()
            range.selectNodeContents(contentEditableElement)
            range.collapse(false)
            selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
        }
    }

    /**
     * Function finds NodeIDs from cmdTokens and returns IDs & indexes from cmdTokens for valid NodeIDs
     * @param {[array of string]} cmdTokens 
     * @returns {[array of +Int]}
     */
    extractNodeIds(cmdTokens) {

        let indexesAndIds = []

        cmdTokens = cmdTokens.filter((el, index) => {
            let nr = Number(el.substr(1, el.length - 2))
            if (el.length > 2 && el.startsWith('{') && el.endsWith('}') && Number.isInteger(nr) && nr >= 0) {
                indexesAndIds.push({ index, nr });
                return true;
            }
            return false;
        })

        return indexesAndIds;
    }

    mapTokensToCommands(cmdIndexes, tokens) {
        if (cmdIndexes.length === 0) return

        let tokensToCmdMap = []

        //if we only have one command
        if (cmdIndexes.length === 1) {
            let cmd = tokens[cmdIndexes[0]]
            let cmdTokens = []

            for (let j = cmdIndexes[0] + 1; j < tokens.length; j++)
                cmdTokens.push(tokens[j])

            tokensToCmdMap.push({
                "cmd": cmd,
                "cmdTokens": cmdTokens
            })
        }
        else {
            for (let i = 0; i < cmdIndexes.length - 1; i++) {
                let cmd = tokens[cmdIndexes[i]]
                let cmdTokens = []

                for (let j = cmdIndexes[i] + 1; j < cmdIndexes[i + 1]; j++)
                    cmdTokens.push(tokens[j])

                tokensToCmdMap.push({
                    "cmd": cmd,
                    "cmdTokens": cmdTokens
                })
            }

            //include last command edge case
            let cmd = tokens[cmdIndexes[cmdIndexes.length - 1]]
            let cmdTokens = []

            for (let j = cmdIndexes[cmdIndexes.length - 1] + 1; j < tokens.length; j++)
                cmdTokens.push(tokens[j])

            tokensToCmdMap.push({
                "cmd": cmd,
                "cmdTokens": cmdTokens
            })
        }
        return tokensToCmdMap;
    }

    removeFromArray(array, element) { return array.filter(el => el !== element) }

    isCommand(token) { return this.keywordsArray.some((el) => el === token) }

    printRawText() { console.log(this.keywordsArray) }

    stripHTMLFromString(str) {
        str = str.toString();
        // return str.replace(/&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' ');
        return str.replace(/(\n)/g, '');

        // return str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|\n|  |&gt;/g, ' ');
    }
}