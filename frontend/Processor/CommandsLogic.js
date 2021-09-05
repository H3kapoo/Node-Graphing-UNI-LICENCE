/*Commands loaded will be populated in here, some helper functions already live here*/
export let CommandsLogic = {
    call(funcName, parsedData, state) {
        if (this[funcName]) return this[funcName](parsedData, state)
        else throw {
            'stage': '[Process]',
            'msg': `Can't call unexisting command: '${funcName}' inside command '${parsedData.cmdName}'!`
        }
    }
}