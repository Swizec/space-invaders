
import React, { Component } from 'react';
import autobind from 'autobind-decorator';

import Store from '../Store';
import Actions from '../Actions';

import Enemies from './Enemies';
import Bullets from './Bullets';
import Player from './Player';

@autobind
class SpaceInvaders extends Component {

    constructor() {
        super();
        this.state = Store.getGameState();
    }

    componentDidMount() {
        Store.addChangeListener(this._onChange);
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }

    componentWillUnmount() {
        Store.removeChangeListener(this._onChange);
        window.removeEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }

    _onChange() {
        this.setState(Store.getGameState());
    }

    start_game() {
        Actions.start_game(this.props.width,
                           this.props.height,
                           this.props.initialEnemies);
    }

    keydown(event) {
        let key = event.keyIdentifier;

        switch (key) {
            case 'Right':
                Actions.player_key_move(1, 0);
                break;
            case 'Left':
                Actions.player_key_move(-1, 0);
                break;
            case 'U+0020':
                Actions.player_shoot();
                break;
            default:
                // no op
        }
    }

    keyup(event) {
        let key = event.keyIdentifier;

        switch (key) {
            case 'Right':
            case 'Left':
                Actions.player_stop();
                break;
            default:
                // no op
        }
    }

    render() {
        if (this.state.started) {
            return (
                <svg width={this.props.width} height={this.props.height}>
                    <Enemies enemies={this.state.enemies} />
                    <Bullets bullets={this.state.bullets} />
                    <Player {...this.state.player} />
                </svg>
            );
        }else{
            return (
                <div className="text-center">
                    <h1>Space Invaders</h1>
                    <p className="lead">Simple space invaders clone built with React and some d3.js. <br/><code>Arrow keys</code> or mouse drag to move, <code>&lt;space&gt;</code> to shoot.</p>
                    <button onClick={this.start_game} className="btn btn-success btn-lg">Start Game</button>
                </div>
            );
        }
    }
}

export default SpaceInvaders;
