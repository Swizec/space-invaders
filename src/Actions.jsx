
import Dispatcher from './Dispatcher';
import { START_TIME, TIME_TICK } from './Constants';

export default {
    start_time() {
        Dispatcher.dispatch({
            actionType: START_TIME
        });
    },

    time_tick() {
        Dispatcher.dispatch({
            actionType: TIME_TICK
        });
    }
};
