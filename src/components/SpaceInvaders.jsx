
import React, { Component } from 'react';
import autobind from 'autobind-decorator';

import Store from '../Store';
import Actions from '../Actions';

import Enemies from './Enemies';

@autobind
class SpaceInvaders extends Component {

    constructor() {
        super();
        this.state = Store.getGameState();
    }

    componentDidMount() {
        Store.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        Store.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState(Store.getGameState());
    }

    start_game() {
        Actions.start_game(this.props.width,
                           this.props.height,
                           this.props.initialEnemies);
    }

    render() {
        if (this.state.started) {
            return (
                <svg width={this.props.width} height={this.props.height}>
                    <Enemies enemies={this.state.enemies} />
                </svg>
            );
        }else{
            return (
                <button onClick={this.start_game}>Start</button>
            );
        }
    }
}

export default SpaceInvaders;
