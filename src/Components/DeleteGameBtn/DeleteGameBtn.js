import React from 'react';
import './DeleteGameBtn.css';

const DeleteGameBtn = ({gameTitle, deleteGame}) => {
    return (
        <React.Fragment>
            <button className='btn' onClick={() => deleteGame(gameTitle)}>Delete game</button>
        </React.Fragment>
    );
}

export default DeleteGameBtn;