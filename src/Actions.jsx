
import Dispatcher from './Dispatcher';
import { START_GAME, TIME_TICK } from './Constants';

export default {
    start_game(width, height, N_enemies) {
        Dispatcher.dispatch({
            actionType: START_GAME,
            width: width,
            height: height,
            N_enemies: N_enemies
        });
    },

    time_tick() {
        Dispatcher.dispatch({
            actionType: TIME_TICK
        });
    }
};
