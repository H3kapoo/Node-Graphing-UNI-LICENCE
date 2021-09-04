
/*Class handling command CLI style and behaviour*/
export class CLITabManager {
    _CLIObject_ = undefined
    commandText_ = undefined
    _cmdHistoryArray_ = []
    _cmdHistoryArraySize_ = 0
    _cmdHistoryOffset_ = 0
    _cliIntro_ = "#hekapoo$> " //TODO: fetch this from preferences or something,make it custom

    constructor(cliID) {
        this._CLIObject_ = document.getElementById(cliID)
        this._listenersSetup()
        this._CLIObject_.innerText = this._cliIntro_
        this._setCaret(this._cliIntro_.length, this._CLIObject_)
    }

    /*Public funcs*/
    outputStd(foundInContext, msg) {
        let outputDiv = document.createElement("div")

        let intro = `<span id='cmd-info-text-prep'>${foundInContext}</span>`

        let sanitized = this._sanitize(msg)
        let content = sanitized.replace(/[0-9]+/g, (match) => {
            return `<span id='cmd-text-number'>${match}</span>`
        })

        outputDiv.id = "cmd-info-text"
        outputDiv.innerHTML = intro + content

        document.getElementById("cmd-prepender").appendChild(outputDiv)
    }

    outputErr(foundInContext, msg) {
        let outputDiv = document.createElement("div")

        let intro = `<span id='cmd-err-text-prep'>${foundInContext}</span>`
        let sanitized = this._sanitize(msg)

        let content = sanitized.replace(/[0-9]+/g, (match) => {
            return `<span id='cmd-text-number'>${match}</span>`
        })

        outputDiv.id = "cmd-err-text"
        outputDiv.innerHTML = intro + content

        document.getElementById("cmd-prepender").appendChild(outputDiv)
    }

    outputGiven(msg) {
        let outputDiv = document.createElement("div")

        let intro = `<span id='cmd-err-info-prep'>${this._cliIntro_}</span>`

        outputDiv.id = "cmd-info-text"
        outputDiv.innerHTML = intro + this._sanitize(msg)

        document.getElementById("cmd-prepender").appendChild(outputDiv)
    }

    /*Private funcs*/
    _listenersSetup() {
        this._CLIObject_.addEventListener('paste', e => this._pasteListener(e))
        this._CLIObject_.addEventListener('keydown', e => this._keyDownListener(e))
        //this needs refactor,history has a bug messed up right now
        this._CLIObject_.addEventListener('keyup', e => this._keyUpListener(e))
        this._CLIObject_.addEventListener('input', e => this._inputListener())
        this._CLIObject_.addEventListener('focus', e => this._focusListener())
    }

    _pasteListener(e) {
        e.preventDefault()
        let text = '' + e.clipboardData.getData("text/plain").replace(this._cliIntro_, '')
        document.execCommand("insertText", false, text)
    }

    _keyDownListener(e) {

        this._keepCaretAwayFromCLIIntro(e, this._cliIntro_, this._CLIObject_)

        if (!e)
            e = window.event;

        /*handle text sent when enter key*/
        if (e.preventDefault && e.which === 13) {
            this.commandText_ = undefined
            this._setEndOfContenteditable(this._CLIObject_)
            e.preventDefault();
        }
    }

    _keyUpListener(e) {

        this._keepCaretAwayFromCLIIntro(e, this._cliIntro_, this._CLIObject_)

        /*handle text sent when enter key*/
        if (e.which === 13) {
            if (this.commandText_ === undefined) {
                this.commandText_ = this._CLIObject_.innerText.replace(this._cliIntro_, '')
            }
            this._CLIObject_.innerText = this._cliIntro_
            this._setEndOfContenteditable(this._CLIObject_)

            /*History*/
            this._cmdHistoryArray_.push(this.commandText_)
            this._cmdHistoryOffset_ = this._cmdHistoryArray_.length

        }

        /*handle history up*/
        if (e.which === 38) {

            if (this._cmdHistoryOffset_ <= 0) return
            this._CLIObject_.innerText = this._cliIntro_ + this._cmdHistoryArray_[this._cmdHistoryOffset_ - 1]
            this._cmdHistoryOffset_ -= 1

            this._setEndOfContenteditable(this._CLIObject_)
            this._focusListener(this._CLIObject_)
        }
        /*handle history down*/
        else if (e.which === 40) {

            if (this._cmdHistoryOffset_ >= this._cmdHistoryArray_.length) return
            this._cmdHistoryOffset_ += 1
            this._CLIObject_.innerText = this._cliIntro_ + this._cmdHistoryArray_[this._cmdHistoryOffset_ - 1]

            this._setEndOfContenteditable(this._CLIObject_)
            this._focusListener(this._CLIObject_)
        }
    }

    _inputListener(e) {
        // this._cmdHistoryOffset_ = 0
        // this._CLIObjectColor_.innerText = this._CLIObject_.innerText
    }

    _focusListener() {
        // if (!this._CLIObject_.textContent.length) {
        //     this._CLIObject_.innerText = this._cliIntro_
        //     this._setEndOfContenteditable(this._CLIObject_)
        // }
    }

    /*Getter*/
    getCLIObject() {
        return this._CLIObject_
    }

    /* Utility */

    _keepCaretAwayFromCLIIntro(evt, CLIIntro, CLIObject) {

        if (CLIObject.innerText.length < CLIIntro.length)
            CLIObject.innerText = CLIIntro

        /*prevent backspace bug*/
        if (this._getCaretCharacterOffsetWithin(CLIObject) <= CLIIntro.length) {
            if (evt.which === 8) {
                evt.preventDefault()
            }
        }

        if (this._getCaretCharacterOffsetWithin(CLIObject) < CLIIntro.length)
            this._setCaret(CLIIntro.length, CLIObject)

    }

    _getCaretCharacterOffsetWithin(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    _setCaret(pos, CLIObject) {
        {
            var range = document.createRange()
            var sel = window.getSelection()

            range.setStart(CLIObject.childNodes[0], pos)
            range.collapse(true)

            sel.removeAllRanges()
            sel.addRange(range)
        }
    }


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

    _sanitize(string) {
        return string
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        // .replace(/"/g, "&quot;")
        // .replace(/'/g, "&#039;");
    }
}