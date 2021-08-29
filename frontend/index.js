/*Style imports*/
import "./Styles/index.css";
import "./Styles/tabby.css";

/*External Imports*/
import Tabby from 'tabbyjs'
import Split from 'split.js'

/*Internal Imports*/
import { CLITabManager } from './Tabs/CLITabManager';
import { CanvasManager } from './Canvas/CanvasManager';
import { GraphManager } from './Graph/GraphManager';
import { CommandsSchemas } from '../frontend/Parser/CommandsSchemas'
import { CommandsLogic } from '../frontend/Processor/CommandsLogic'

/*Class Inits*/
const cliTabManager_ = new CLITabManager('cli-textarea')
const canvasManager_ = new CanvasManager('canvas')
const graphManager_ = new GraphManager(canvasManager_, cliTabManager_)

/*Split into 2 parts (cli and canvas)*/
Split(['#left-side', '#right-side'], { sizes: [65, 35] })

/*Create tabs area*/
new Tabby('[data-tabs-left]');
new Tabby('[data-tabs-right]');

/*Init code*/
graphManager_.start()
graphManager_.graphRenderer_.renderGrid()

/*Backend comms*/
window.api.receive('nodify-reload-cmds-short', (evt, args) => refreshCommands())

/*Refresh loaded cmds on start*/
refreshCommands()

/*Commands loader*/
function refreshCommands() {
    /*Dont remove always*/
    let getFunc = CommandsLogic.get
    let setFunc = CommandsLogic.set

    CommandsSchemas = {}
    CommandsLogic = {}
    CommandsLogic['get'] = getFunc
    CommandsLogic['set'] = setFunc

    let filePaths = window.api.send('nodify-reload-cmds', {})

    for (let file of filePaths)
        loadScript(file, () => {
            CommandsSchemas[data.schema.name] = data.schema
            CommandsLogic[data.logic.name] = data.logic[data.logic.name]
            unloadScript('cmd-script')
        });
    console.log('[Index.js] Loaded ', filePaths.length, ' commands!')
}

function loadScript(url, callback) {
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.id = 'cmd-script'
    script.onreadystatechange = callback
    script.onload = callback
    head.appendChild(script)
}

function unloadScript(id) { document.getElementById(id).remove() }