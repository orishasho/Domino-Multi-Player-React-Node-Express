import React from 'react';
import './BackToLobbyFromGameBtn.css';

const BackToLobbyFromGameBtn = ({backToLobby, removePassivePlayer}) => {
    return (
            <button
                className='btn'
                onClick={() => {
                    removePassivePlayer();
                    backToLobby();
                }}>
                    Return to Lobby
            </button>
    );
}

export default BackToLobbyFromGameBtn;