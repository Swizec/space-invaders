
import React, { Component } from 'react';

import Points from './Points';

export default class Bullets extends Component {
    render() {
        let pointsData = this.props.bullets.map((bullet) => {
            bullet.r = 1;
            bullet.fillOpacity = 1;
            bullet.color = 'red';
            return bullet;
        });

        return (
            <Points points={pointsData} />
        );
    }
}
