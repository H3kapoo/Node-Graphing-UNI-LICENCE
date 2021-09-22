/*Main job is to keep track of ongoing animations and trigger rendering loop when needed, then untrigger it*/

import events from "./Events"

export class AnimationManager {

    #animObjectsList = []
    #needsToAwaitAnimation = false
    #animCnt = 0
    #resolveAnim = undefined
    #graphRendererRef = undefined
    then = undefined
    now = undefined

    constructor() { }

    /*Public functs*/

    async handleAnimation(stateObject, modelUpdateCb) {
        this.#animObjectsList.push(stateObject)
        this.#animCnt = this.#animObjectsList.length
        console.log('[AM] Obj has anim, currentCnt: ', this.#animCnt)

        if (stateObject.getCurrentState().anim.awaitable === true) {
            this.#needsToAwaitAnimation = true
            this.updateAnims(modelUpdateCb)

            return new Promise((resolve, reject) => { this.#resolveAnim = resolve })
        }
        /*resolve directly if no need to wait*/
        this.updateAnims(modelUpdateCb)
        return new Promise((resolve, reject) => resolve())
    }

    updateAnims(modelUpdateCb) {

        /*Delta time inits*/
        if (!this.then)
            this.then = Date.now()

        this.now = Date.now();
        let deltaTime = this.now - this.then;

        modelUpdateCb()

        let animHasFinished = false

        for (let obj of this.#animObjectsList)
            animHasFinished = obj.updateAnimations(deltaTime)
        if (animHasFinished) {
            for (let obj of this.#animObjectsList) {
                if (obj.isAnimationDone()) {

                    /*remove done animation from list of anims*/
                    const filterObj = (o) => o !== obj;
                    this.#animObjectsList = this.#animObjectsList.filter(filterObj);

                    /*dbg*/
                    if (this.hasNeedsToAwaitAnimation)
                        console.log('[AM] Waited for animation is done,calling handler..')
                    else
                        console.log('[AM] Non-need-to-wait animation done,calling handler..')

                    /*resolve waiting promise,if any*/
                    if (this.#resolveAnim)
                        this.#resolveAnim()

                    /*handle if GR should changes modes + decrease anim cnt*/
                    this.#needsToAwaitAnimation = false
                    this.#animCnt -= 1
                    window.requestAnimationFrame(() => this.updateAnims(modelUpdateCb))

                    console.log('[AM] Animation done handled, anims remaining: ', this.#animCnt)
                }
            }
        }

        this.then = this.now

        if (this.#animCnt)
            window.requestAnimationFrame(() => this.updateAnims(modelUpdateCb))
        else
            this.then = undefined
    }

    hasNeedsToAwaitAnimation() { return this.#needsToAwaitAnimation }

    /*Private functs*/

    /*Setters*/
    setGraphRendererRef(graphRendererRef) {
        this.#graphRendererRef = graphRendererRef
    }
}