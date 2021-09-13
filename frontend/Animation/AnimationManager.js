/*Main job is to keep track of ongoing animations and trigger rendering loop when needed, then untrigger it*/

import events from "./Events"

export class AnimationManager {

    #graphRendererRef = undefined
    #intervalHandler = undefined
    #renderMode = 'once'

    #animObjectsList = []
    #needsToAwaitAnimation = false
    func = undefined
    animCnt = 0
    constructor() {
    }

    /*Public functs*/

    updateAnimations() {
        // console.log('[AM] Updating animations..')
        //trigger the resolve here somehow so we dont need to emit anything
        for (let obj of this.#animObjectsList)
            obj.updateAnimations()

        for (let obj of this.#animObjectsList) {
            if (obj.isAnimationDone()) {
                const filterObj = (o) => o !== obj;
                this.#animObjectsList = this.#animObjectsList.filter(filterObj);
                events.emit('anim-done', {})
                this.#handleDoneAnimation()
            }
        }
    }

    async pushAndWaitAnimIfNeeded(object) {
        if (object.hasAnimation()) {
            this.#animObjectsList.push(object)

            this.animCnt = this.#animObjectsList.length
            console.log('[AM] Obj has anim, currentCnt: ', this.animCnt)

            if (this.#renderMode !== 'loop')
                this.#renderLoop()

            const handleDoneAnimationFunc = () => this.#handleDoneAnimation()

            /* obj has animation and we should wait for it to finish before proceeding*/
            if (object.getCurrentState().anim.shouldWait === true) {
                this.#needsToAwaitAnimation = true
                return new Promise((resolve, reject) => {
                    this.func = function () {
                        console.log('[AM] Waited for animation is done,calling handler..')
                        resolve()
                    }
                    events.on('anim-done', this.func)
                })
            }

            /* obj has animation but there's no need to wait for it to finish*/
            // console.log('[AM] Non-need-to-wait animation done,calling handler..')
            return new Promise((resolve, reject) => {
                events.on('anim-done', () => console.log('[AM] Non-need-to-wait animation done,calling handler..'))
                resolve()
            })

        }
        else if (this.#animObjectsList.length === 0) {
            console.log('[AM] No anims running, mode is once')
            this.#renderOnce()
        }

        /*no animation exists on obj,just resolve immidiately*/
        return new Promise((resolve, reject) => resolve(8))
    }

    waitForEvent(eventType) {
        return new Promise(function (resolve) {
            events.on(eventType, resolve)
        })
    }


    hasNeedsToAwaitAnimation() {
        return this.#needsToAwaitAnimation
    }

    /*Private functs*/
    #handleDoneAnimation() {
        this.#needsToAwaitAnimation = false
        this.animCnt -= 1

        if (this.animCnt <= 0) {
            this.#renderOnce()
            events.removeAllListeners('anim-done')
        }

        console.log('[AM] Animation done handled, anims remaining: ', this.animCnt)
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