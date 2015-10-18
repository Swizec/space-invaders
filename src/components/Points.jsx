
import React, { Component } from 'react';

class Point extends Component {
    render() {
        return (
            <circle cx={this.props.x}
                    cy={this.props.y}
                    style={{fillOpacity: this.props.fillOpacity || 0.4,
                            stroke: this.props.color || 'black',
                            fillColor: this.props.color || 'black'}}
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
