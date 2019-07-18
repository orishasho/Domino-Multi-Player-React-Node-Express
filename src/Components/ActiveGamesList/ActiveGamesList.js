import React from 'react';
import JoinGameBtn from '../JoinGameBtn/JoinGameBtn';
import WatchGameBtn from '../WatchGameBtn/WatchGameBtn';
import DeleteGameBtn from '../DeleteGameBtn/DeleteGameBtn';
import './ActiveGamesList.css';

const ActiveGamesList = ({gamesList, joinGame, deleteGame, currentUser, watchGame}) => {
    return (
            <ol className ="active-games-list">
                {gamesList.map((game, i) => <li key={i}>
                    <p>
                    Title: {game.title}, Creator: {game.creator},
                    Required players: {game.maxPlayersNum}, Players signed in: {game.activePlayers.length},
                    Players watching: {game.passivePlayers.length}, Game status: {game.status}
                    </p>
                    {game.status === 'waiting' ?
                        <JoinGameBtn
                            gameTitle={game.title}
                            gameIndex={game.gameIndex}
                            joinGame={joinGame}/> : null}
                    <WatchGameBtn
                        gameTitle={game.title}
                            gameIndex={game.gameIndex}
                            watchGame={watchGame}
                            gameStatus={game.status}/>
                    {game.activePlayers.length === 0 && game.creator == currentUser ?
                        <DeleteGameBtn gameTitle={game.title} deleteGame={deleteGame}/> : null}
                </li>)}
            </ol>
    );
}

export default ActiveGamesList;