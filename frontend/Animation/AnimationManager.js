/*Main job is to keep track of ongoing animations and trigger rendering loop when needed, then untrigger it*/

export class AnimationManager {

    #animsOngoing = true
    #animsCount = 0
    #modeAlreadyChanged = false
    changeRenderModeFunc = undefined
    triggerRender = undefined

    constructor(changeRenderModeFunc, triggerRender) {

        /*Switch render modes event based*/

    }

    /*Public functs*/
}