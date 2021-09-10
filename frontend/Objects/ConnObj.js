export class ConnObj {
    _currentState_ = {}

    constructor(state) {
        this._currentState_ = state
    }


    /*Getters*/

    getCurrentState() { return this._currentState_ }
}