
const EventEmitter = require('events').EventEmitter;

import Dispatcher from './Dispatcher';
import { START_TIME, TIME_TICK } from './Constants';

class Store extends EventEmitter {
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }
}

Dispatcher.register(function (action) {

    switch (action.actionType) {
        case TIME_TICK:
            console.log("tick");
            break;

        case START_TIME:
            console.log(store);
            break;

        default:
            // no op
    };
});

let store = new Store();

export default store;
