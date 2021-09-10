import { ObjectAnimator } from "../Animation/ObjectAnimator"

export class NodeObj {
    #currentState = {}

    #objAnimator = undefined

    constructor(state) {
        this.#currentState = state
        this.#objAnimator = new ObjectAnimator()

        /*If node is created with an animation,add it to animator*/
        if (state.anim)
            this.#objAnimator.setAnimData(state.anim)
    }

    /*Public functs*/

    updateState(newState) {
        this.#currentState = newState
    }

    updateAnimations() {
        this.#objAnimator.nextAnimationState(this.#currentState)
    }

    /*Getters*/

    getCurrentState() { return this.#currentState }
}