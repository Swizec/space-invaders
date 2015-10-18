
import React, { Component } from 'react';

import Points from './Points';

export default class Enemies extends Component {
    render() {
        let pointsData = this.props.enemies.map((enemy) => {
            enemy.r = 5;
            return enemy;
        });

        return (
            <Points points={pointsData} />
        );
    }
}
