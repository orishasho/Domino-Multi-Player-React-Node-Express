import React, {Component} from 'react';
import './CreateNewGame.css';

const CreateNewGame = ({handleCreateNewGame, errorMessage}) => {
    return (
        <div className="create-new-game-wrapper">
            <h3>Create a new game:</h3>
            <form onSubmit={handleCreateNewGame}>
                <label className="game-title-label" htmlFor="gameTitle"> Game Title: </label>
                <input className="game-title-input" name="gameTitle"/>    
                <label className="game-players-num-label" htmlFor="maxPlayersNum"> Num of players (2 or 3): </label>
                <input className="game-players-num-input" name="maxPlayersNum"/>                     
                <input className="submit-btn btn" type="submit" value="Create new game!"/>
            </form>
            <div className="create-new-game-error-message">
                {errorMessage}
            </div>
        </div>
    );
}

export default CreateNewGame;