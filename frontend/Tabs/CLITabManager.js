/*Class handling command CLI style and behaviour*/
export class CLITabManager {
    _CLIObject_ = undefined
    _cmdHistoryArray_ = [""]
    _cmdHistoryOffset_ = 0

    constructor(cliID) {
        this._CLIObject_ = document.getElementById(cliID)
        this._listenersSetup()
    }

    /*Public funcs*/
    //TODO: Diff between normal std and err output
    outputStd(foundInContext, msg) {
        let outputDiv = document.createElement("div")

        outputDiv.id = "cmd-info-text"
        outputDiv.innerText = foundInContext + " " + msg

        document.getElementById("cmd-prepender").appendChild(outputDiv)
    }

    outputErr(foundInContext, msg) {
        let outputDiv = document.createElement("div")

        outputDiv.id = "cmd-err-text"
        outputDiv.innerText = foundInContext + " " + msg

        document.getElementById("cmd-prepender").appendChild(outputDiv)
    }

    clearAfterDoneWithText() {
        this._cmdHistoryOffset_ = 0
        this._cmdHistoryArray_.push(this._CLIObject_.textContent);
        this._CLIObject_.textContent = ""
        this._setEndOfContenteditable(this._CLIObject_)
        this._focusListener(this._CLIObject_)
    }

    /*Private funcs*/
    _listenersSetup() {
        this._CLIObject_.addEventListener('paste', e => this._pasteListener(e))
        this._CLIObject_.addEventListener('keydown', e => this._keyDownListener(e))
        //this needs refactor,history has a bug messed up right now
        //also cursor going behind ::before needs to be fixed
        this._CLIObject_.addEventListener('keyup', e => this._keyUpListener(e))
        this._CLIObject_.addEventListener('input', e => this._inputListener())
        this._CLIObject_.addEventListener('focus', e => this._focusListener())
    }

    _pasteListener(e) {
        e.preventDefault()
        let text = " " + e.clipboardData.getData("text/plain")
        document.execCommand("insertText", false, text)
    }

    _keyDownListener(e) {
        if (!e)
            e = window.event;

        if (e.preventDefault && e.which === 13)
            e.preventDefault();
    }

    _keyUpListener(e) {
        /*handle history up*/
        if (e.which === 38) {
            if (this._cmdHistoryOffset_ + 1 <= this._cmdHistoryArray_.length)
                this._cmdHistoryOffset_ += 1

            let index = this._cmdHistoryArray_.length - this._cmdHistoryOffset_

            this._CLIObject_.textContent = " "
            this._CLIObject_.textContent += this._cmdHistoryArray_[index].replace(/\s{2,1000}/g, '')
            this._setEndOfContenteditable(this._CLIObject_)
            this._focusListener(this._CLIObject_)
        }
        /*handle history down*/
        else if (e.which === 40) {

            if (this._cmdHistoryOffset_ - 1 > 0)
                this._cmdHistoryOffset_ -= 1

            let index = this._cmdHistoryArray_.length - this._cmdHistoryOffset_

            this._CLIObject_.textContent = " "
            this._CLIObject_.textContent += this._cmdHistoryArray_[index].replace(/\s{2,1000}/g, '')
            this._setEndOfContenteditable(this._CLIObject_)
            this._focusListener(this._CLIObject_)
        }
    }

    _inputListener(e) {
        this._cmdHistoryOffset_ = 0
    }

    _focusListener() {
        if (!this._CLIObject_.textContent.length) {
            this._CLIObject_.textContent = " "
            this._setEndOfContenteditable(this._CLIObject_)
        }
    }

    /*Getter*/
    getCLIObject() {
        return this._CLIObject_
    }

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