
/*Class handling command CLI style and behaviour*/
export class CLITabManager {
    #CLIObject = undefined
    commandText = undefined
    #cmdHistoryArray = []
    #cmdHistoryOffset = 0
    #cliIntro = "#terminal$> " //TODO: fetch this from preferences or something,make it custom

    constructor(cliID) {
        this.#CLIObject = document.getElementById(cliID)
        this.#listenersSetup()
        this.#CLIObject.innerText = this.#cliIntro
        this.#setCaret(this.#cliIntro.length, this.#CLIObject)
    }

    /*Public funcs*/
    outputStd(foundInContext, msg) {

        let outputDiv = document.createElement("div")

        let intro = `<span id='cmd-info-text-prep'>${foundInContext}</span>`

        let sanitized = this.#sanitize(msg)
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
        let sanitized = this.#sanitize(msg)

        let content = sanitized.replace(/[0-9]+/g, (match) => {
            return `<span id='cmd-text-number'>${match}</span>`
        })

        outputDiv.id = "cmd-err-text"
        outputDiv.innerHTML = intro + content

        document.getElementById("cmd-prepender").appendChild(outputDiv)
    }

    outputEcho(msg) {

        let outputDiv = document.createElement("div")

        let intro = `<span id='cmd-err-info-prep'>${this.#cliIntro}</span>`

        outputDiv.id = "cmd-info-text"
        outputDiv.innerHTML = intro + this.#sanitize(msg)

        document.getElementById("cmd-prepender").appendChild(outputDiv)
    }

    /*Private funcs*/
    #listenersSetup() {
        this.#CLIObject.addEventListener('paste', e => this.#pasteListener(e))
        this.#CLIObject.addEventListener('keydown', e => this.#keyDownListener(e))
        //this needs refactor,history has a bug messed up right now
        this.#CLIObject.addEventListener('keyup', e => this.#keyUpListener(e))
        this.#CLIObject.addEventListener('input', e => this.#inputListener())
        this.#CLIObject.addEventListener('focus', e => this.#focusListener())
    }

    #pasteListener(e) {
        e.preventDefault()
        let text = '' + e.clipboardData.getData("text/plain").replace(this.#cliIntro, '')
        document.execCommand("insertText", false, text)
    }

    #keyDownListener(e) {

        this.#keepCaretAwayFromCLIIntro(e, this.#cliIntro, this.#CLIObject)

        if (!e)
            e = window.event;

        /*handle text sent when enter key*/
        if (e.preventDefault && e.which === 13) {
            this.commandText = undefined
            this.#setEndOfContenteditable(this.#CLIObject)
            e.preventDefault();
        }
    }

    #keyUpListener(e) {

        this.#keepCaretAwayFromCLIIntro(e, this.#cliIntro, this.#CLIObject)

        /*handle text sent when enter key*/
        if (e.which === 13) {
            if (this.commandText === undefined) {
                this.commandText = this.#CLIObject.innerText.replace(this.#cliIntro, '')
            }
            this.#CLIObject.innerText = this.#cliIntro
            this.#setEndOfContenteditable(this.#CLIObject)

            /*History*/
            this.#cmdHistoryArray.push(this.commandText)
            this.#cmdHistoryOffset = this.#cmdHistoryArray.length

        }

        /*handle history up*/
        if (e.which === 38) {

            if (this.#cmdHistoryOffset <= 0) return
            this.#CLIObject.innerText = this.#cliIntro + this.#cmdHistoryArray[this.#cmdHistoryOffset - 1]
            this.#cmdHistoryOffset -= 1

            this.#setEndOfContenteditable(this.#CLIObject)
            this.#focusListener(this.#CLIObject)
        }
        /*handle history down*/
        else if (e.which === 40) {

            if (this.#cmdHistoryOffset >= this.#cmdHistoryArray.length) return
            this.#cmdHistoryOffset += 1
            this.#CLIObject.innerText = this.#cliIntro + this.#cmdHistoryArray[this.#cmdHistoryOffset - 1]

            this.#setEndOfContenteditable(this.#CLIObject)
            this.#focusListener(this.#CLIObject)
        }
    }

    #inputListener(e) {
        // this.#cmdHistoryOffset = 0
        // this._CLIObjectColor_.innerText = this.#CLIObject.innerText
    }

    #focusListener() {
        // if (!this.#CLIObject.textContent.length) {
        //     this.#CLIObject.innerText = this.#cliIntro
        //     this.#setEndOfContenteditable(this.#CLIObject)
        // }
    }

    /*Getter*/
    getCLIObject() {
        return this.#CLIObject
    }

    /* Utility */

    #keepCaretAwayFromCLIIntro(evt, CLIIntro, CLIObject) {

        if (CLIObject.innerText.length < CLIIntro.length)
            CLIObject.innerText = CLIIntro

        /*prevent backspace bug*/
        if (this.#getCaretCharacterOffsetWithin(CLIObject) <= CLIIntro.length) {
            if (evt.which === 8) {
                evt.preventDefault()
            }
        }

        if (this.#getCaretCharacterOffsetWithin(CLIObject) < CLIIntro.length)
            this.#setCaret(CLIIntro.length, CLIObject)

    }

    #getCaretCharacterOffsetWithin(element) {
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

    #setCaret(pos, CLIObject) {
        {
            var range = document.createRange()
            var sel = window.getSelection()

            range.setStart(CLIObject.childNodes[0], pos)
            range.collapse(true)

            sel.removeAllRanges()
            sel.addRange(range)
        }
    }


    #setEndOfContenteditable(contentEditableElement) {
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

    #sanitize(string) {
        return string
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        // .replace(/"/g, "&quot;")
        // .replace(/'/g, "&#039;");
    }
}