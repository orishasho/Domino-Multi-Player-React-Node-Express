import React from 'react';
import LeaveGameBtn from '../LeaveGameBtn/LeaveGameBtn';
import './GameWaitRoom.css';

const GameWaitRoom = ({gameTitle, currentUser, curPlayersNum, maxPlayersNum, startGame, leaveGame}) => {
    return (
        <div className='game-wait-room-wrapper'>
            <h3>Welcome to the game "{gameTitle}", {currentUser}!</h3>
            <p>{curPlayersNum} players joined from {maxPlayersNum} needed</p>
            <LeaveGameBtn leaveGame={leaveGame} currentUser={currentUser}/>
            {curPlayersNum == maxPlayersNum ? startGame() : null}
        </div>
    );
}

export default GameWaitRoom;