/*This class should serve as a custom singleton event emiter*/
class EventsHandler {

    constructor() {
        this._events = {};
        if (EventsHandler.instance == null) {
            EventsHandler.instance = this
            // this.event = new Event("start");

        }
        return EventsHandler.instance
    }


    on(name, listener) {
        /* added */
        // if (this._events[name] === listener) return

        if (!this._events[name]) {
            this._events[name] = [];
        }

        this._events[name].push(listener);
    }

    removeListener(name, listenerToRemove) {
        if (!this._events[name]) {
            throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
        }

        const filterListeners = (listener) => listener !== listenerToRemove;

        this._events[name] = this._events[name].filter(filterListeners);
    }
    removeAllListeners() {
        const f = () => { }
        const filterListeners = (listener) => listener === f;

        for (const [name, data] of Object.entries(this._events))
            this._events[name] = this._events[name].filter(filterListeners);
    }

    emit(name, data) {
        if (!this._events[name]) {
            throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
        }

        const fireCallbacks = (callback) => {
            callback(data);
        };

        this._events[name].forEach(fireCallbacks);
    }
}

const events = new EventsHandler()
Object.freeze(events)
export default events
