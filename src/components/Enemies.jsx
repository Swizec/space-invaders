
import React, { Component } from 'react';

import Points from './Points';
import { ENEMY_RADIUS } from '../Constants';

export default class Enemies extends Component {
    render() {
        let pointsData = this.props.enemies
                             .filter((e) => e.alive)
                             .map((enemy) => {
                                 enemy.r = ENEMY_RADIUS;
                                 return enemy;
                             });

        return (
            <Points points={pointsData} />
        );
    }
}
