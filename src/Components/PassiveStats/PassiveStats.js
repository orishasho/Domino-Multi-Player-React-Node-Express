import React from 'react';
import './PassiveStats.css';

function getMinutes (seconds) {
    return Math.floor(seconds / 60);
}

function getSeconds (seconds) {
    return seconds % 60;
}

function getAvgTime(seconds, numOfMoves) {
   return Math.floor(seconds/ numOfMoves);
}

const PassiveStats = ({userName, stats, seconds}) => {
    return (
        <div className="passive-stats">
            <h2>{userName} statistics:</h2>
            <h3>Moves played: {stats.numOfMovesPlayed}</h3>
            <h3>Play time: {getMinutes(seconds)}:{getSeconds(seconds)}</h3>
            {stats.numOfMovesPlayed > 0 ?
                <h3>Average time per move: {getAvgTime(seconds, stats.numOfMovesPlayed)} seconds</h3>
                : null}
            <h3>Dominos drawn: {stats.numOfDominosDrawn} </h3>
            <h3>Score: {stats.score}</h3>
        </div>
    );
}

export default PassiveStats;