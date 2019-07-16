import React, {Component} from 'react';
import SignUp from '../SignUp/SignUp';
import Lobby from '../Lobby/Lobby';
import GameWaitRoom from '../GameWaitRoom/GameWaitRoom';
import Game from '../Game/Game';
import GameLogic from '../../Services/GameLogic.js';
import './BaseContainer.css';
const _ = require('lodash');

export default class BaseContainer extends Component {
    constructor() {
        super();
        this.state = {
            showSignUp: true,
            showLobby: false,
            showGameWaitRoom: false,
            signUpErrMessage: '',
            currentUser: '',
            userNamesList: null,
            gamesList: null,
            joinedGameTitle: '',
            createGameErrMessage: '',
            showCreateGame: false,
            startGame: false,
            game: {
                title: '',
                maxPlayersNum: null
            },
            joinedGameIndex: null,
            isWatching: false
        }
        this.gameLogic = new GameLogic();
        this.startGame = this.startGame.bind(this);
        this.getActiveGamesList = this.getActiveGamesList.bind(this);
        this.getActiveUsersList = this.getActiveUsersList.bind(this);
        this.handleCreateNewGame = this.handleCreateNewGame.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
        this.backToLobbyFromGame = this.backToLobbyFromGame.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.backToLobbyFromGame = this.backToLobbyFromGame.bind(this);
        this.watchGame = this.watchGame.bind(this);
    }
    //-----LIFECYCLE METHODS-----
    componentDidUpdate(prevProps, prevState) {
        //Set game data once
        if (this.state.startGame && !prevState.startGame) {
            let currGame = _.cloneDeep(this.getCurrGame());
            if (currGame.currPlayer == this.state.currentUser) {
                this.gameLogic.startGame(currGame.activePlayers, currGame.passivePlayers, this.state.joinedGameIndex);
            }
        }
        //Setting and clearing pull intervals
        if (this.state.showLobby && !prevState.showLobby) {
            this.getActiveUsersList();
            this.getActiveGamesList();
        }
        else if (!this.state.showLobby && prevState.showLobby) {
            clearTimeout(this.pullUserListTimer);
        }

        else if (!this.state.showGameWaitRoom && prevState.showGameWaitRoom) {
            clearTimeout(this.pullGamesListTimer);
        }
    }

    componentWillUnmount() {
        if (this.pullUserListTimer) {
            clearTimeout(this.pullUserListTimer);
        }
        if (this.pullGamesListTimer) {
            clearTimeout(this.pullGamesListTimer);
        }
    }
    //-----RENDER METHODS-----
    renderSignUp() {
        return (
            <React.Fragment>
                <SignUp errorMessage={this.state.signUpErrMessage} handleSignUp={this.handleSignUp}/>
            </React.Fragment>
        );
    }

    renderLobby() {
        return (
            <React.Fragment>
                <Lobby
                    currentUser={this.state.currentUser}
                    userNamesList={this.state.userNamesList}
                    gamesList={this.state.gamesList}
                    showCreateGame={this.state.showCreateGame}
                    gameTitle={this.state.game.title}
                    createGameErrMessage={this.state.createGameErrMessage}
                    handleCreateNewGame={this.handleCreateNewGame}
                    joinGame={this.joinGame}
                    logoutHandler={this.logoutHandler}
                    deleteGame={this.deleteGame}
                    watchGame={this.watchGame}/>
            </React.Fragment>
        );
    }

    renderGameWaitRoom() {
        return (
            <React.Fragment>
                <GameWaitRoom
                    gameTitle={this.state.joinedGameTitle}
                    currentUser={this.state.currentUser}
                    curPlayersNum={this.getCurPlayersNumInCurGame()}
                    maxPlayersNum={this.getMaxPlayersNumInCurGame()}
                    startGame={this.startGame}
                    leaveGame={this.leaveGame}
                    />
            </React.Fragment>
        );
    }

    renderStartGame() {
        var currGame = _.cloneDeep(this.getCurrGame());
        return (
            <Game
                currGame={currGame}
                currentUser={this.state.currentUser}
                backToLobbyFromGame={this.backToLobbyFromGame}
                gameIndex={this.state.joinedGameIndex}
                backToLobbyFromGame={this.backToLobbyFromGame}/>
        );
    }
    
    render() {
        if (this.state.showSignUp) {
            return this.renderSignUp();
        }
        else if (this.state.showLobby) {
            return this.renderLobby();
        }
        else if (this.state.showGameWaitRoom) {
            return this.renderGameWaitRoom();
        }
        else {
            return this.renderStartGame();
        }
    }
    //-----SIGNUP FUNCTIONS-----
    handleSignUp(e) {
        e.preventDefault();
        const userName = e.target.elements.userName.value;
        fetch('/users/addUser', {method:'POST', body: userName, credentials: 'include'})
        .then(res => {            
            if (res.ok) {
                this.setState(()=> ({
                    signUpErrMessage: '',
                    showSignUp: false,
                    currentUser: userName,
                    showLobby: true,
                    showCreateGame: true}));
            }
            else if (res.status === 403) {
                res.text().then(errMessage => {
                    this.setState(()=> ({signUpErrMessage: errMessage}));
                });
            }   
        });
        return false;
    }

    //-----LOBBY FUNCTIONS-----
    getActiveUsersList() {
        //Pulling active user list from server every 200ms
        return fetch('/users/allUsers')
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            this.pullUserListTimer = setTimeout(this.getActiveUsersList, 200);
            return res.json();
        })
        .then(userList => {
            this.setState({userNamesList: Object.values(userList)});
        })
        .catch(err => {throw err});
    }

    getActiveGamesList() {
        //Pulling active games list from server every 200ms
        return fetch('/games/allGames')
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            this.pullGamesListTimer = setTimeout(this.getActiveGamesList, 200);
            return res.json();
        })
        .then(gamesList => {
            this.setState({gamesList: _.cloneDeep(gamesList)});
        })
        .catch(err => {throw err});   
    }

    joinGame(gameTitle, gameIndex) {
        const dataToUpdate = {
            gameTitle: gameTitle,
            currentUser: this.state.currentUser
        }
        fetch('/games/joinGame', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                this.setState({
                    showLobby: false,
                    showGameWaitRoom: true,
                    joinedGameTitle: gameTitle,
                    joinedGameIndex: gameIndex});
            }
        })
        .catch(err => {throw err});
    }

    watchGame(gameTitle, gameIndex, gameStatus) {
        const dataToUpdate = {
            gameTitle: gameTitle,
            currentUser: this.state.currentUser,
            gameIndex: gameIndex
        }
        if (gameStatus == 'started') {
            this.watchActiveGame(dataToUpdate);
        }
        else {
            this.watchInactiveGame(dataToUpdate);
        }
    }

    watchActiveGame(dataToUpdate) {
        fetch('/singleGame/addPassivePlayer', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                this.setState({
                    showLobby: false,
                    showGameWaitRoom: false,
                    startGame: true,
                    joinedGameTitle: dataToUpdate.gameTitle,
                    joinedGameIndex: dataToUpdate.gameIndex,
                    isWatching: true});
            }
        })
        .catch(err => {throw err});
        fetch('/games/watchGame', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                console.log('added passive player');
            }
        })
        .catch(err => {throw err});
    }

    watchInactiveGame(dataToUpdate) {
        fetch('/games/watchGame', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                this.setState({
                    showLobby: false,
                    showGameWaitRoom: true,
                    joinedGameTitle: dataToUpdate.gameTitle,
                    joinedGameIndex: dataToUpdate.gameIndex,
                    isWatching: true});
            }
        })
        .catch(err => {throw err});
    }

    handleCreateNewGame(e) {
        e.preventDefault();
        const gameTitle = e.target.elements.gameTitle.value;
        const maxPlayersNum = e.target.elements.maxPlayersNum.value;
        const newGame = {
            title: gameTitle,
            maxPlayersNum: maxPlayersNum
        }
        fetch('/games/addGame', {method:'POST', body: JSON.stringify(newGame), credentials: 'include'})
        .then(res => {            
            if (res.ok) {
                this.setState(()=> ({createGameErrMessage: '', showCreateGame: false, game: _.cloneDeep(newGame)}));
            }
            else if (res.status === 403) {
                res.text().then(errMessage => {
                    this.setState(()=> ({createGameErrMessage: errMessage}));
                });
            }   
        });
        return false;
    }

    logoutHandler() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(res => {
            if (!res.ok) {
                console.log(`failed to logout the user: ${this.state.currentUser.name}`, res);                
            }
            this.setState({currentUser: '', showSignUp: true, showLobby: false});
        });
    }
    //-----GAME WAIT ROOM FUNCTIONS-----
    getCurPlayersNumInCurGame() {
        var curPlayersNum = null;
        this.state.gamesList.forEach(game => {
            if (game.title === this.state.joinedGameTitle) {
                curPlayersNum = game.curPlayersNum;
            }
        });
        return curPlayersNum;
    }

    getMaxPlayersNumInCurGame() {
        var maxPlayersNum = null;
        this.state.gamesList.forEach(game => {
            if (game.title === this.state.joinedGameTitle) {
                maxPlayersNum = game.maxPlayersNum;
            }
        });
        return maxPlayersNum;
    }

    startGame() {
        this.setState({showGameWaitRoom: false, startGame: true});
    }
    //-----GAME FUNCTIONS-----
    backToLobbyFromGame() {
        this.restartGame();
        this.setState({startGame: false, showLobby: true, joinedGameTitle: '', joinedGameIndex: null});
    }

    backToLobbyFromGame() {
        if (!this.state.isWatching) {
            this.setState({startGame: false, showLobby: true, joinedGameTitle: '', joinedGameIndex: null});
        }
        else {
            this.leaveGame(this.state.currentUser);
        }
    }

    restartGame() {
        fetch('/games/restartGame', {method:'POST', body: JSON.stringify(this.state.joinedGameTitle), credentials: 'include'})
        .then(res => {            
            if (res.ok) {
                console.log('Game restarted');
            }
            else {
                console.log('Error restarting game');
            }   
        });
        fetch('/singleGame/restartGame', {method: 'POST', body: JSON.stringify(this.state.joinedGameIndex), credentials: 'include'})
        .then(res => {
            if (!res.ok) {
                console.log('Failed to restart game in single game');                
            }
        });
    }

    getCurrGame() {
        for (let i = 0; i < this.state.gamesList.length; i++) {
            if (this.state.gamesList[i].title === this.state.joinedGameTitle) {
                return _.cloneDeep(this.state.gamesList[i]); 
            }
        }
    }
    
    deleteGame(gameTitle) {
        fetch('/games/deleteGame', {method:'DELETE', body: JSON.stringify(gameTitle), credentials: 'include'})
        .then(res => {            
            if (res.ok) {
                console.log('Game deleted');
                this.setState({showCreateGame: true});
            }
            else {
                console.log('Error deleting game');
            }   
        });
    }

    leaveGame(userToLeave) {
        const dataToUpdate = {
            gameTitle: this.state.joinedGameTitle,
            userToLeave: userToLeave
        };
        if (!this.state.isWatching) {
            fetch('/games/leaveGame', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
            .then(res => {            
                if (res.ok) {
                    console.log('Left game');
                    this.setState({showGameWaitRoom: false, showLobby: true, joinedGameTitle: '', joinedGameIndex: null});
                }
                else {
                    console.log('Error leaving game');
                }   
            });
        }

        else {
            fetch('/games/unwatchGame', {method:'POST', body: JSON.stringify(dataToUpdate), credentials: 'include'})
            .then(res => {            
                if (res.ok) {
                    console.log('Left game');
                    this.setState({showGameWaitRoom: false, showLobby: true, isWatching: false, joinedGameTitle: '', joinedGameIndex: null});
                }
                else {
                    console.log('Error leaving game');
                }   
            });
        }

    }
}