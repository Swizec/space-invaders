import * as d3 from "d3";

import Dispatcher from "./Dispatcher";
import Actions from "./Actions";

import {
    START_GAME,
    STOP_GAME,
    TIME_TICK,
    CHANGE_EVENT,
    EDGE,
    PLAYER_MOVE,
    PLAYER_STOP,
    PLAYER_SHOOT,
    MOUSE_TRIGGER,
    KEY_TRIGGER,
    PLAYER_MAX_SPEED,
    BULLET_MAX_SPEED,
    ENEMY_SHOTS_PER_MINUTE,
    ENEMY_RADIUS,
    MS_PER_FRAME
} from "./Constants";

const EventEmitter = require("events").EventEmitter;

let Data = {
    timer: null,
    ended: null,
    enemies: [],
    player: {},
    bullets: []
};

function player_speed() {
    let multiplier = d3.ease("cubic-in-out")(Data.player.ticks_moving / 3);

    Data.player.ticks_moving += 1;

    return PLAYER_MAX_SPEED * multiplier;
}

function bullet_speed(bullet) {
    let multiplier = d3.ease("exp")(bullet.ticks_alive / BULLET_MAX_SPEED);

    return BULLET_MAX_SPEED * multiplier;
}

function shouldShoot() {
    let N_alive = Data.enemies.filter(e => e.alive).length,
        p = ENEMY_SHOTS_PER_MINUTE / N_alive / (MS_PER_FRAME * 60);

    return Math.random() <= p;
}

function hit(e) {
    let lx = e.x - e.w / 2,
        rx = e.x + e.w / 2,
        ty = e.y - e.h / 2,
        by = e.y + e.h / 2,
        b;

    for (let i = 0; i < Data.bullets.length; i++) {
        b = Data.bullets[i];
        if (b.x >= lx && b.x <= rx && b.y >= ty && b.y <= by) {
            return true;
        }
    }

    return false;
}

class Store extends EventEmitter {
    constructor() {
        super();

        this.x_scale = d3.scale.linear().domain([0, 1]);

        this.enemy_y = d3.scale.threshold().domain(d3.range(0, 1, 0.25));
    }

    getGameState() {
        return {
            started: !!Data.timer,
            ended: !!Data.ended,
            enemies: Data.enemies,
            player: Data.player,
            bullets: Data.bullets
        };
    }

    generateEnemy() {
        Data.enemies.push({
            id: "invader-" + Data.enemies.length,
            alive: true,
            x: this.x_scale(Math.random()),
            y: this.enemy_y(Math.random()),
            w: ENEMY_RADIUS,
            h: ENEMY_RADIUS,
            speed: 1,
            vector: [1, 0]
        });
    }

    startGame(width, height, N_enemies) {
        Data = Data = {
            timer: null,
            ended: null,
            enemies: [],
            player: {},
            bullets: []
        };
        Data.width = width;
        Data.height = height;

        this.x_scale.rangeRound([EDGE, width - EDGE]);
        this.enemy_y.range(
            d3.range(0, 4, 0.25).map(i => EDGE + Math.round(i * height / 3))
        );

        d3.range(N_enemies).forEach(() => this.generateEnemy());

        Data.player = {
            w: 50,
            h: 10,
            x: width / 2,
            y: height - EDGE,
            ticks_moving: 0
        };

        Data.timer = setInterval(() => Actions.time_tick(), MS_PER_FRAME);
    }

    stopGame() {
        Data.timer = clearInterval(Data.timer);
        Data.ended = true;
    }

    advanceGameState() {
        Data.enemies = Data.enemies.filter(e => e.alive).map(e => {
            e.x = e.x + e.vector[0] * e.speed;
            e.y = e.y + e.vector[1] * e.speed;

            if (e.x <= EDGE || e.x >= Data.width - EDGE) {
                e.vector[0] = -e.vector[0];
            }

            if (hit(e)) {
                e.alive = false;
            }

            if (shouldShoot()) {
                this.addBullet(e, [0, 1]);
            }

            return e;
        });

        Data.bullets = Data.bullets
            .map(b => {
                b.ticks_alive += 1;

                b.x = b.x + b.vector[0] * bullet_speed(b);
                b.y = b.y + b.vector[1] * bullet_speed(b);

                return b;
            })
            .filter(
                b =>
                    !(
                        b.x <= EDGE ||
                        b.x >= Data.width - EDGE ||
                        b.y <= EDGE ||
                        b.y >= Data.height - EDGE
                    )
            );

        if (hit(Data.player) || !Data.enemies.filter(e => e.alive).length) {
            this.stopGame();
        }
    }

    movePlayer(dx, dy) {
        let p = Data.player;

        p.x += dx;
        p.y += dy;

        if (p.x - p.w / 2 <= EDGE || p.x + p.w / 2 >= Data.width - EDGE) {
            p.x -= dx;
        }

        if (p.y <= Data.height / 3 || p.y >= Data.height - EDGE) {
            p.y -= dy;
        }

        Data.player = p;
    }

    addBullet(origin, vector) {
        Data.bullets.push({
            x: origin.x + vector[0] * 3,
            y: origin.y + vector[1] * 3 + origin.h * vector[1],
            vector: vector,
            ticks_alive: 0,
            id: "bullet-" + new Date().getTime() + "-" + Math.random() * 1000
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

Dispatcher.register(function(action) {
    switch (action.actionType) {
        case TIME_TICK:
            store.advanceGameState();
            store.emitChange();
            break;

        case START_GAME:
            store.startGame(action.width, action.height, action.N_enemies);
            store.emitChange();
            break;

        case STOP_GAME:
            store.stopGame();
            store.emitChange();
            break;

        case PLAYER_MOVE:
            if (action.type == MOUSE_TRIGGER) {
                store.movePlayer(action.dx, action.dy);
            } else {
                let speed = player_speed();
                store.movePlayer(speed * action.dx, speed * action.dy);
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
    }
});

let store = new Store();

export default store;
