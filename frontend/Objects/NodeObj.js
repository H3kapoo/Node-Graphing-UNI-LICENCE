import { ObjectAnimator } from "../Animation/ObjectAnimator"

export class NodeObj {
    #currentState = {}

    #objAnimator = undefined

    constructor(state) {
        this.#currentState = state
        this.#objAnimator = new ObjectAnimator()

        /*If node is created with an animation,add it to animator*/
        if (state.anim) {
            this.#objAnimator.setUpAnim(this.#currentState.anim)
        }
    }

    /*Public functs*/

    updateAnimations() {
        this.#objAnimator.nextAnimationState(this.#currentState)
    }

    isAnimationDone() { return this.#objAnimator.isAnimationDone() }

    hasAnimation() { return this.#currentState.anim ? true : false }

    /*Getters*/

    getCurrentState() { return this.#currentState }
}