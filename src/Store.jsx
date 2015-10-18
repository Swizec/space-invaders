
const EventEmitter = require('events').EventEmitter;
import d3 from 'd3';

import Dispatcher from './Dispatcher';
import { START_GAME, TIME_TICK, CHANGE_EVENT, EDGE } from './Constants';
import Actions from './Actions';

let Data = {
    timer: null,
    enemies: []
};

class Store extends EventEmitter {
    constructor() {
        super();

        this.x_scale = d3.scale.linear()
                         .domain([0, 1]);

        this.enemy_y = d3.scale.threshold()
                    .domain(d3.range(0, 1, 0.25));
    }

    getGameState() {
        return {
            started: !!Data.timer,
            enemies: Data.enemies
        }
    }

    generateEnemy() {
        Data.enemies.push({
            id: Data.enemies.length,
            alive: true,
            x: this.x_scale(Math.random()),
            y: this.enemy_y(Math.random())
        });
    }

    initGame(width, height, N_enemies) {
        Data.width = width;
        Data.height = height;

        this.x_scale.rangeRound([EDGE, width-EDGE]);
        this.enemy_y.range(d3.range(0, 4, 0.25).map(
            (i) => EDGE+Math.round(i*height/3)
        ));

        d3.range(N_enemies).forEach(() => this.generateEnemy());

        Data.timer = setInterval(() => Actions.time_tick(), 16);
    }

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
            store.emitChange();
            break;

        case START_GAME:
            store.initGame(action.width, action.height, action.N_enemies);
            store.emitChange();
            break;

        default:
            // no op
    };
});

let store = new Store();

export default store;
