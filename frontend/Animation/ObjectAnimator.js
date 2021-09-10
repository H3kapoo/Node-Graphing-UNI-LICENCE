import { Events } from "../Events/Events"

/*Class that actually executes the transition of animations logic*/
export class ObjectAnimator {

    #animatorManager = undefined

    #animData = undefined
    #animAux = undefined

    #renderTriggerTime = 16 //(ms) to be removed
    #durationDone = 0
    #totalDuration = undefined
    #animationDone = false
    #t = 0

    constructor() { }

    /*Public functs*/

    nextAnimationState(currentState) {
        /*if animation done,exit*/
        if (this.#animationDone) return


        this.#transition(currentState)

        this.#durationDone += this.#renderTriggerTime
        this.#t = this.#durationDone / this.#totalDuration //will give done travel as percentage %
        if (this.#t >= 1) {
            this.#animationDone = true
            this.#t = 1
            this.#transition(currentState)
        }

    }

    #transition(currentState) {

        if (this.#animAux === undefined) this.#animAux = { ...currentState }

        /*for each transitionable option in _animData_ for currentState..*/
        for (const [opt, arg] of Object.entries(this.#animData))
            currentState[opt] = this[`_${opt}Transitioner`](this.#animAux[opt], arg)
    }


    /*Private functs*/
    #notifyAnimationStarted() {
        /*Notify animation manager that animations are finished*/
        document.dispatchEvent(Events.notifyObjectAnimationStarted);
    }
    #notifyAnimationFinish() {
        /*Notify animation manager that animations are finished*/
        document.dispatchEvent(Events.notifyObjectAnimationFinished);
    }

    /*Transitioners*/

    _posTransitioner(currPos, finalPos) {
        const npx = (1 - this.#t) * currPos[0] + this.#t * finalPos[0]
        const npy = (1 - this.#t) * currPos[1] + this.#t * finalPos[1]
        return [npx, npy]
    }

    /*Setters*/

    setAnimData(data) {

        /*Notify animation manager that animation is pushed*/
        // this.#notifyAnimationStarted()

        this.#totalDuration = data.duration

        //delete non transitionable but required data
        delete data.duration

        this.#animData = data
    }
}