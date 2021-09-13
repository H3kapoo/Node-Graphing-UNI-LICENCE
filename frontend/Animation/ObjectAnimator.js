/*Class that actually executes the transition of animations logic*/
export class ObjectAnimator {

    #animData = undefined
    #animAux = undefined
    #renderTriggerTime = 16 //(ms) to be removed
    #durationDone = 0
    #totalDuration = undefined
    #animationDone = false
    #notified = false
    #t = 0

    constructor() { }

    /*Public functs*/

    nextAnimationState(currentState) {

        /*if animation done,exit*/
        if (this.#t === 1 && !this.#notified) {
            console.log('[OA] Anim done')
            this.#animationDone = true
            delete currentState.anim
            this.#notified = true
        }

        this.#transition(currentState)

        this.#durationDone += this.#renderTriggerTime
        this.#t = this.#durationDone / this.#totalDuration //will give done travel as percentage %
        if (this.#t >= 1) {
            this.#t = 1
            this.#transition(currentState)
        }

    }

    #transition(currentState) {

        if (this.#animAux === undefined) this.#animAux = { ...currentState }
        /*for each transitionable option in _animData_ for currentState..*/
        for (const [opt, arg] of Object.entries(this.#animData))
            if (this.isTransitionable(opt))
                currentState[opt] = this[`_${opt}Transitioner`](this.#animAux[opt], arg)
    }

    /*Transitioners*/

    _posTransitioner(currPos, finalPos) {
        const npx = (1 - this.#t) * currPos[0] + this.#t * finalPos[0]
        const npy = (1 - this.#t) * currPos[1] + this.#t * finalPos[1]
        return [npx, npy]
    }

    isTransitionable(opt) {
        if (opt === 'pos') return true
        return false
    }

    /*Getters*/
    isAnimationDone() { return this.#animationDone }

    /*Setters*/

    setUpAnim(data) {
        this.#totalDuration = data.dt
        this.#animData = undefined
        this.#animationDone = false
        this.#notified = false

        this.#animData = data
    }
}