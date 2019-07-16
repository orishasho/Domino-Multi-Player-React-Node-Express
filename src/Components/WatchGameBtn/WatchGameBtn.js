import React from 'react';
import './WatchGameBtn.css';

const WatchGameBtn = ({gameTitle, gameIndex, watchGame, gameStatus}) => {
    return (
        <React.Fragment>
            <button className='btn' onClick={() => watchGame(gameTitle, gameIndex, gameStatus)}>Watch game</button>
        </React.Fragment>
    );
}

export default WatchGameBtn;