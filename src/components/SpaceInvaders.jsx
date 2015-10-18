
import React, { Component } from 'react';

import Store from '../Store';
import Actions from '../Actions';

class SpaceInvaders extends Component {
    render() {
        return (
            <button onClick={Actions.start_time}>Start</button>
        );
    }
}

export default SpaceInvaders;
