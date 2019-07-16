import React from 'react';
import './LeaveGameBtn.css';

const LeaveGameBtn = ({leaveGame, currentUser}) => {
    return(
        <button type="button" className="btn" onClick={() => leaveGame(currentUser)}>
            <span>Return to Lobby</span>
        </button>
    );
}

export default LeaveGameBtn;