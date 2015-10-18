
import Dispatcher from './Dispatcher';
import { START_GAME, TIME_TICK, PLAYER_MOVE } from './Constants';

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
    },

    player_move(dx, dy) {
        Dispatcher.dispatch({
            actionType: PLAYER_MOVE,
            dx: dx,
            dy: dy
        });
    }
};
