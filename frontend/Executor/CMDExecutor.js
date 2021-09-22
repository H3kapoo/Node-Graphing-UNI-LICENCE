import { CommandsLogic } from "./CommandsLogic";

//we should import the meta from somewhere
export class CMDExecutor {

    #CLILogger

    constructor(CLILogger) {
        this.#CLILogger = CLILogger
    }

    execute(parsedData) {
        try {
            return this.#execute(parsedData)
        } catch (e) {
            this.#CLILogger.outputErr('[CmdExecutor]', e.msg)
        }
    }

    #execute(parsedData) {
        if (!parsedData) return

        /*Check to see if cmd exists*/
        if (!CommandsLogic[parsedData.cmdName])
            throw {
                'msg': `Command '${parsedData.cmdName}' exists but has no logic defined.Did you forget to add it?`
            }

        /*Attach helper get func to object*/
        parsedData.get = function (opt) {
            if (this[opt])
                return this[opt]
            return []
        }

        let cmdQueue = []

        /*META API*/
        //abstract this from here
        const META_API = {
            pushCreateNode(data) { cmdQueue.push({ 'type': 'CREATE_NODE', data }) },
            pushUpdateNode(data) { cmdQueue.push({ 'type': 'UPDATE_NODE', data }) },
            pushDeleteNode(data) { cmdQueue.push({ 'type': 'DELETE_NODE', data }) },
            pushCreateConn(data) { cmdQueue.push({ 'type': 'CREATE_CONN', data }) },
            pushUpdateConn(data) { cmdQueue.push({ 'type': 'UPDATE_CONN', data }) },
            pushDeleteConn(data) { cmdQueue.push({ 'type': 'DELETE_CONN', data }) },
            pushResultMsg(dataMsg) { cmdQueue.push({ 'type': 'MSG', dataMsg }) }
        }

        CommandsLogic[parsedData.cmdName](parsedData, META_API)
        return cmdQueue
    }
}