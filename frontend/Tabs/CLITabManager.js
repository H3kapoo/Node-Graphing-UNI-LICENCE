export class CLITabManager {
    cliObject = undefined
    historyArr = [""]
    historyOffset = 0

    constructor(cliID) {
        this.cliObject = document.getElementById(cliID)
        //define undefined behaviour,throw err then return
        this.listenersSetup()
    }

    //todo: implement later..
    outputStd(foundInContext, msg) {
        let outputDiv = document.createElement("div")

        outputDiv.id = "cmd-info-text"
        outputDiv.innerText = foundInContext + " " + msg

        const holderDiv = document.getElementById("cmd-prepender");
        holderDiv.appendChild(outputDiv)
    }

    outputErr(foundInContext, msg) {

        let outputDiv = document.createElement("div")

        outputDiv.id = "cmd-err-text"
        outputDiv.innerText = foundInContext + " " + msg

        const holderDiv = document.getElementById("cmd-prepender");
        holderDiv.appendChild(outputDiv)
    }

    listenersSetup() {
        this.cliObject.addEventListener('paste', e => this.pasteListener(e))
        this.cliObject.addEventListener('keydown', e => this.keyDownListener(e))
        //this needs refactor,history a bog messed up right now
        //also cursor going behind ::before needs to be fixed
        this.cliObject.addEventListener('keyup', e => this.keyUpListener(e))
        this.cliObject.addEventListener('input', e => this.inputListener(e))
        this.cliObject.addEventListener('focus', e => this.focusListener(e))
    }

    pasteListener(e) {
        e.preventDefault();
        let text = " " + e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
    }
    keyDownListener(e) {
        if (!e)
            e = window.event;

        if (e.preventDefault && e.which === 13)
            e.preventDefault();
    }
    keyUpListener(e) {
        //handle history up
        if (e.which === 38) {

            if (this.historyOffset + 1 <= this.historyArr.length)
                this.historyOffset += 1

            let index = this.historyArr.length - this.historyOffset

            this.cliObject.textContent = " "
            this.cliObject.textContent += this.historyArr[index].replace(/\s{2,1000}/g, '');
            this._setEndOfContenteditable(this.cliObject)
            this.focusListener(this.cliObject)
        }
        //handle history down
        else if (e.which === 40) {

            if (this.historyOffset - 1 > 0)
                this.historyOffset -= 1

            let index = this.historyArr.length - this.historyOffset

            this.cliObject.textContent = " "
            this.cliObject.textContent += this.historyArr[index].replace(/\s{2,1000}/g, '');
            this._setEndOfContenteditable(this.cliObject)
            this.focusListener(this.cliObject)
        }
    }
    inputListener(e) {
        this.historyOffset = 0
    }
    focusListener(e) {
        if (!this.cliObject.textContent.length) {
            this.cliObject.textContent = " "
            this._setEndOfContenteditable(this.cliObject)
        }
    }

    clearAfterDoneWithText() {
        this.historyOffset = 0
        this.historyArr.push(this.cliObject.textContent);

        // let newDiv = document.createElement("div")
        // let strippedText = this.stripHTMLFromString(CLIObject.textContent);

        // newDiv.id = "cmd-text"

        // const currentDiv = document.getElementById("cmd-prepender");
        // currentDiv.appendChild(newDiv)
        this.cliObject.textContent = ""
        this._setEndOfContenteditable(this.cliObject)
        this.focusListener(this.cliObject)
    }

    getCLI() { return this.cliObject }

    /* Utility */

    _setEndOfContenteditable(contentEditableElement) {
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
}