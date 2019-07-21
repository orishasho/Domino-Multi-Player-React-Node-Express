import React from 'react';
import ActiveUsersList from '../ActiveUsersList/ActiveUsersList';
import CreateNewGame from '../CreateNewGame/CreateNewGame';
import ActiveGamesList from '../ActiveGamesList/ActiveGamesList';
import LogoutBtn from '../LogoutBtn/LogoutBtn';
import './Lobby.css';

const Lobby = ({
    userNamesList,
    gamesList,
    currentUser,
    joinGame,
    showCreateGame,
    gameTitle,
    createGameErrMessage,
    handleCreateNewGame,
    logoutHandler,
    deleteGame,
    watchGame}) => {
        return (
            <div className='lobby-header'>
                <div className="lobby-wrapper">
                    <h1 className="welcome-msg">Welcome to Multi Player Domino, {currentUser}</h1>
                    <h3>Active players:</h3>
                    {userNamesList ? <ActiveUsersList userNamesList={userNamesList}/> : null}
                    <h3>Active games:</h3>
                    {gamesList ? 
                        <ActiveGamesList 
                            gamesList={gamesList}
                            joinGame={joinGame}
                            deleteGame={deleteGame}
                            currentUser={currentUser}
                            watchGame={watchGame}
                            /> : null}
                    {showCreateGame ?
                        <CreateNewGame 
                            currentUser={currentUser}
                            errorMessage={createGameErrMessage}
                            handleCreateNewGame={handleCreateNewGame}/> :
                        <h3>Game "{gameTitle}" created!</h3>}
                    <LogoutBtn logoutHandler={logoutHandler}/>
                </div>
            </div>
        );
}

export default Lobby;