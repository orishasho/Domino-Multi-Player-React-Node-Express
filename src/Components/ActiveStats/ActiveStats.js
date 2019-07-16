import React, {Component} from 'react';
import './ActiveStats.css';

export default class ActiveStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsPlayed: props.seconds
        };
        this.incOneSecond = this.incOneSecond.bind(this);
    }

    componentDidMount() {
        this.secondsTimer = setInterval(this.incOneSecond, 1000);
    }

    componentDidUpdate(prevProps, prevState) {
        //After user's turn ended:
        //1. Update user's total time in Game component
        //2. Update the seconds in the state for the current user
        if (this.props.userName !== prevProps.userName) {
            this.props.updateTime(prevProps.userName, prevState.secondsPlayed);
            this.setState({secondsPlayed: this.props.seconds});
        }
    }

    componentWillUnmount() {
        if (this.secondsTimer) {
            clearTimeout(this.secondsTimer);
        }
    }

    incOneSecond() {
        this.setState({secondsPlayed: this.state.secondsPlayed + 1});
    }

    getMinutes (seconds) {
        return Math.floor(seconds / 60);
    }

    getSeconds (seconds) {
        return seconds % 60;
    }

    getAvgTime(seconds, numOfMoves) {
        return Math.floor(seconds/ numOfMoves);
    }

    render() {
        const {userName, stats, seconds, updateTime} = this.props;
        return (
            <div className="active-stats">
                <h2>Current player ({userName}) statistics:</h2>
                <h3>Moves played: {stats.numOfMovesPlayed}</h3>
                <h3>Play time: 
                    {this.getMinutes(this.state.secondsPlayed)}:{this.getSeconds(this.state.secondsPlayed)}
                </h3>
                {stats.numOfMovesPlayed > 0 ?
                    <h3>
                        Average time per move:
                        {this.getAvgTime(this.state.secondsPlayed, stats.numOfMovesPlayed)} seconds
                    </h3>
                    : null}
                <h3>Dominos drawn: {stats.numOfDominosDrawn} </h3>
                <h3>Score: {stats.score}</h3>
            </div>
        );
    }
}