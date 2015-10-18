
const EventEmitter = require('events').EventEmitter;
import d3 from 'd3';

import Dispatcher from './Dispatcher';
import { START_GAME,
         TIME_TICK,
         CHANGE_EVENT,
         EDGE,
         PLAYER_MOVE,
         PLAYER_STOP,
         PLAYER_SHOOT,
         MOUSE_TRIGGER,
         KEY_TRIGGER,
         PLAYER_MAX_SPEED
} from './Constants';
import Actions from './Actions';

let Data = {
    timer: null,
    enemies: [],
    player: {},
    bullets: []
};

function player_speed() {
    let multiplier = d3.ease('cubic-in-out')(Data.player.ticks_moving/3);

    Data.player.ticks_moving += 1;

    return PLAYER_MAX_SPEED*multiplier;
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
            enemies: Data.enemies,
            player: Data.player,
            bullets: Data.bullets
        }
    }

    generateEnemy() {
        Data.enemies.push({
            id: 'invader-'+Data.enemies.length,
            alive: true,
            x: this.x_scale(Math.random()),
            y: this.enemy_y(Math.random()),
            speed: 1,
            vector: [1, 0]
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

        Data.player = {
            w: 50,
            h: 10,
            x: width/2,
            y: height-EDGE,
            ticks_moving: 0
        };

        Data.timer = setInterval(() => Actions.time_tick(), 16);
    }

    advanceGameState() {
        Data.enemies = Data.enemies.map((e) => {
            e.x = e.x+e.vector[0]*e.speed;
            e.y = e.y+e.vector[1]*e.speed;

            if (e.x <= EDGE || e.x >= Data.width-EDGE) {
                e.vector[0] = -e.vector[0];
            }

            return e;
        });

        Data.bullets = Data.bullets
                           .map((b) => {
                               b.x = b.x+b.vector[0];
                               b.y = b.y+b.vector[1];

                               return b;
                           })
                           .filter((b) =>
                                !(b.x <= EDGE
                                   || b.x >= Data.width-EDGE
                                   || b.y <= EDGE
                                   || b.y >= Data.height-EDGE)
                           );
    }

    movePlayer(dx, dy) {
        let p = Data.player;

        p.x += dx;
        p.y += dy;

        if (p.x-p.w/2 <= EDGE || p.x+p.w/2 >= Data.width-EDGE) {
            p.x -= dx;
        }

        if (p.y <= Data.height/3 || p.y >= Data.height-EDGE) {
            p.y -= dy;
        }

        Data.player = p;
    }

    addBullet(origin, vector) {
        Data.bullets.push({
            x: origin.x,
            y: origin.y,
            vector: vector,
            id: new Date().getTime()
        });
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
            store.advanceGameState();
            store.emitChange();
            break;

        case START_GAME:
            store.initGame(action.width, action.height, action.N_enemies);
            store.emitChange();
            break;

        case PLAYER_MOVE:
            if (action.type == MOUSE_TRIGGER) {
                store.movePlayer(action.dx, action.dy);
            }else{
                let speed = player_speed();
                store.movePlayer(speed*action.dx, speed*action.dy);
            }
            break;

        case PLAYER_STOP:
            Data.player.ticks_moving = 0;
            break;

        case PLAYER_SHOOT:
            store.addBullet(Data.player, [0, -1]);
            break;

        default:
            // no op
    };
});

let store = new Store();

export default store;
