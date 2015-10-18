
import React, { Component } from 'react';

class Point extends Component {
    render() {
        return (
            <circle cx={this.props.x}
                    cy={this.props.y}
                    style={{fillOpacity: 0.4}}
                    r={this.props.r}
            />
        );
    }
};

export default class Points extends Component {
    render() {
        return (
            <g>
                {this.props.points.map((point) => {
                    return (<Point {...point} key={point.id} />);
                })}
            </g>
        );
    }
}
