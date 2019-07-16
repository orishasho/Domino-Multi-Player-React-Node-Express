import React, {Component} from 'react';
import './BackToLobbyTimer.css';

export default class BackToLobbyTimer extends Component {
    constructor() {
        super();
        this.state = {
            seconds: 30
        };
        this.incOneSecond = this.incOneSecond.bind(this);
    }

    componentDidMount() {
        this.secondsTimer = setInterval(this.incOneSecond, 1000);
        console.log('mounted message');
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.seconds === 0) {
            this.props.backToLobby();
        }
    }

    componentWillUnmount() {
        if (this.secondsTimer) {
            clearTimeout(this.secondsTimer);
        }
    }

    incOneSecond() {
        this.setState({seconds: this.state.seconds - 1});
    }

    render() {
        return (
            <div className='message'>
                <h3>Returning to Lobby in {this.state.seconds} seconds...</h3>
            </div>
        );
    }
}