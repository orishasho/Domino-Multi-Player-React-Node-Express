import React from 'react';
import './JoinGameBtn.css';

const JoinGameBtn = ({gameTitle, gameIndex, joinGame}) => {
    return (
        <React.Fragment>
            <button className='btn' onClick={() => joinGame(gameTitle, gameIndex)}>Join game</button>
        </React.Fragment>
    );
}

export default JoinGameBtn;