/*Main job is to keep track of ongoing animations and trigger rendering loop when needed, then untrigger it*/

import events from "./Events"

export class AnimationManager {

    #graphRendererRef = undefined
    #intervalHandler = undefined
    #renderMode = 'once'

    #animObjectsList = []
    #needsToAwaitAnimation = false
    #animCnt = 0
    animDoneCb = undefined

    constructor() { }


    /*Public functs*/

    updateAnimations() {
        for (let obj of this.#animObjectsList)
            obj.updateAnimations()

        for (let obj of this.#animObjectsList) {
            if (obj.isAnimationDone()) {
                const filterObj = (o) => o !== obj;
                this.#animObjectsList = this.#animObjectsList.filter(filterObj);

                if (this.hasNeedsToAwaitAnimation)
                    console.log('[AM] Waited for animation is done,calling handler..')
                else
                    console.log('[AM] Non-need-to-wait animation done,calling handler..')

                this.animDoneCb()
                this.#handleDoneAnimation()
            }
        }
    }

    async pushAndWaitAnimIfNeeded(object) {
        if (object.hasAnimation()) {
            this.#animObjectsList.push(object)

            this.#animCnt = this.#animObjectsList.length
            console.log('[AM] Obj has anim, currentCnt: ', this.#animCnt)

            if (this.#renderMode !== 'loop')
                this.#renderLoop()

            const handleDoneAnimationFunc = () => this.#handleDoneAnimation()

            /* obj has animation and we should wait for it to finish before proceeding*/
            if (object.getCurrentState().anim.shouldWait === true) {
                this.#needsToAwaitAnimation = true

                return new Promise((resolve, reject) => {
                    this.animDoneCb = () => resolve()
                })
            }

            /* obj has animation but there's no need to wait for it to finish*/
            return new Promise((resolve, reject) => {
                this.animDoneCb = () => resolve()
            })

        }

        this.#renderOnce()

        /*no animation exists on obj,just resolve immidiately*/
        return new Promise((resolve, reject) => resolve())
    }

    hasNeedsToAwaitAnimation() {
        return this.#needsToAwaitAnimation
    }

    /*Private functs*/
    #handleDoneAnimation() {
        this.#needsToAwaitAnimation = false
        this.#animCnt -= 1

        if (this.#animCnt <= 0)
            this.#renderOnce()

        console.log('[AM] Animation done handled, anims remaining: ', this.#animCnt)
    }

    #renderLoop() {
        if (this.#intervalHandler) return
        this.#renderMode = 'loop'
        this.#intervalHandler = setInterval(() => this.#graphRendererRef.render(), 16) //ms
        console.log('[AM] Requested mode: loop')
        console.log('[AM] Created handler: ', this.#intervalHandler)
    }

    #renderOnce() {
        clearInterval(this.#intervalHandler)
        console.log('[AM] Requested mode: once')
        console.log('[AM] Deleted handler: ', this.#intervalHandler)
        this.#intervalHandler = undefined
        this.#renderMode = 'once'
        this.#graphRendererRef.render()
    }

    /*Setters*/
    setGraphRendererRef(graphRendererRef) {
        this.#graphRendererRef = graphRendererRef
    }
}