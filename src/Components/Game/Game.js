import React, {Component} from 'react';
import GameBoard from '../GameBoard/GameBoard';
import Hand from '../Hand/Hand';
import Bank from '../Bank/Bank';
import ActiveStats from '../ActiveStats/ActiveStats';
import PassiveStats from '../PassiveStats/PassiveStats';
import ChangeDominoBtn from '../ChangeDominoBtn/ChangeDominoBtn';
import BackToLobbyTimer from '../BackToLobbyTimer/BackToLobbyTimer';
import BackToLobbyFromGameBtn from '../BackToLobbyFromGameBtn/BackToLobbyFromGameBtn';
import ChatContainer from '../ChatContainer/ChatContainer';
import GameLogic from '../../Services/GameLogic.js';
import './Game.css';
const _ = require('lodash');

export default class Game extends Component {
    constructor() {
        super();
        this.state = {
            isGameOver: false,
            currBank: null, //[{firstNum, secondNum}]
            currHand: [], //[{firstNum, secondNum}]
            boardContainer: [], //28x28 matrix, empty cell = '', cell with a domino = {firstNum, secondNum, dir}
            boardContainerSize: 0,
            dominoToAdd: null, //{firstNum , secondNum}
            locationsToFlip: [], //[{i, j}] 
            validIndexes: [], //[{i, j, dir}]
            showChangeDominoBtn: false,
            currPlayerIndex: 0,
            allPlayersHands: null,
            allPlayersStats: null,
            allPlayersSeconds: [],
            activePlayers: [],
            passivePlayers: [],
            winnerIndex: null,
            secondPlaceIndex: null
        };
        this.boardMid = 14;
        this.gameLogic = new GameLogic();
        this.changeDominoBtnClick = this.changeDominoBtnClick.bind(this);
        this.handDominoClick = this.handDominoClick.bind(this);
        this.boardDominoClick = this.boardDominoClick.bind(this);
        this.drawTile = this.drawTile.bind(this);
        this.getGameData = this.getGameData.bind(this);
        this.updateUserSeconds = this.updateUserSeconds.bind(this);
        this.removePassivePlayer = this.removePassivePlayer.bind(this);
    }
    //----------LIFECYCLE METHODS----------
    componentDidMount() {
        const maxPlayerIndex = this.props.currGame.maxPlayersNum - 1;
        this.gameLogic.postMaxPlayerIndex(maxPlayerIndex, this.props.gameIndex);
        this.getGameData();
    }

    componentWillUnmount() {
        if (this.pullGameDataTimer) {
            clearTimeout(this.pullGameDataTimer);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.winnerIndex !== null && this.state.currPlayerIndex === this.state.winnerIndex) {
            console.log('skipping turn');
            this.gameLogic.skipTurn(this.props.gameIndex);
        }
        if (this.state.currPlayerIndex !== prevState.currPlayerIndex && this.state.currBank.length === 0) {
            console.log('Checking valid moves');
            this.gameLogic.checkEveryPlayerForValidMoves(
                this.state.allPlayersHands,
                this.state.allPlayersStats,
                this.state.boardContainer,
                this.state.boardContainerSize,
                this.state.validIndexes,
                this.state.locationsToFlip,
                this.state.currPlayerIndex,
                this.props.gameIndex
            );

        }
    }
    //----------PULLING DATA----------
    getGameData() {
        //Pull all game data every 200ms
        return fetch(`/singleGame/getGameData`)
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            this.pullGameDataTimer = setTimeout(this.getGameData, 200);
            return res.json();
        })
        .then(gameData => {
            if (gameData && gameData.bank[this.props.gameIndex] && gameData.hands[this.props.gameIndex] && gameData.stats[this.props.gameIndex] && gameData.board[this.props.gameIndex]) {
                console.log('in get!');
                this.setState({
                    currBank: _.cloneDeep(gameData.bank[this.props.gameIndex]),
                    currHand: _.cloneDeep(gameData.hands[this.props.gameIndex][this.props.currGame.activePlayers.indexOf(this.props.currentUser)]),
                    boardContainer: _.cloneDeep(gameData.board[this.props.gameIndex]),
                    allPlayersHands: _.cloneDeep(gameData.hands[this.props.gameIndex]),
                    allPlayersStats: _.cloneDeep(gameData.stats[this.props.gameIndex]),
                    currPlayerIndex: gameData.currPlayerIndex[this.props.gameIndex],
                    boardContainerSize: gameData.boardSize[this.props.gameIndex],
                    validIndexes: _.cloneDeep(gameData.validIndexes[this.props.gameIndex]),
                    locationsToFlip: _.cloneDeep(gameData.locationsToFlip[this.props.gameIndex]),
                    activePlayers: _.cloneDeep(gameData.activePlayers[this.props.gameIndex]),
                    passivePlayers: _.cloneDeep(gameData.passivePlayers[this.props.gameIndex]),
                    isGameOver: gameData.isGameOver[this.props.gameIndex],
                    winnerIndex: gameData.winnerIndex[this.props.gameIndex],
                    secondPlaceIndex: gameData.secondPlaceIndex[this.props.gameIndex]
                });
            }
        })
        .catch(err => {throw err});   
    }
    //----------GAME LOGIC----------
    drawTile() {
        //1. exit if not user's turn\game is over\player has valid moves
        var canPlayerDraw = this.gameLogic.checkIfPlayerHasValidMoves(
            this.state.boardContainerSize,
            this.state.currHand,
            this.state.validIndexes,
            this.state.locationsToFlip,
            this.state.boardContainer);

        if (this.props.currGame.activePlayers[this.state.currPlayerIndex] !== this.props.currentUser || 
            this.state.isGameOver) {
            return;
        }
        else if (this.state.currBank.length === 0) {
            alert ('No more dominos to draw!');
            return;
        }
        else if (!canPlayerDraw) {
            alert ('You still have valid moves!');
            return;
        }
        //2. Update new data in server
        this.gameLogic.postNewDataForDrawTile(
            this.state.currBank,
            this.state.currHand,
            this.state.allPlayersStats[this.state.currPlayerIndex],
            this.state.currPlayerIndex,
            this.props.gameIndex);
    }

    secondMoveOrAbove(dominoFromHand) {
        var dominoFromHandCopy = {
            firstNum: dominoFromHand.firstNum,
            secondNum: dominoFromHand.secondNum
        }
        this.gameLogic.postNewDataForSecondMoveHandClick(this.state.boardContainer, dominoFromHandCopy, this.props.gameIndex);
        this.setState({
            dominoToAdd: dominoFromHandCopy,
            showChangeDominoBtn: true
        });
    }

    updateUserSeconds(userNameToUpdate, newSecondsPlayed) {
       const userIndex = this.props.currGame.activePlayers.indexOf(userNameToUpdate);
       var newAllPlayersSeconds = _.cloneDeep(this.state.allPlayersSeconds);
       newAllPlayersSeconds[userIndex] = newSecondsPlayed;
       this.setState({allPlayersSeconds: newAllPlayersSeconds});

    }
    //----------EVENT HANDLERS----------
    handDominoClick(dominoFromHand) {
        //exit if not user's turn\game is over
        if (this.props.currGame.activePlayers[this.state.currPlayerIndex] !== this.props.currentUser ||
            this.state.isGameOver) {
            return;
        }
        else if (this.state.boardContainerSize === 0) { //First move
            this.gameLogic.postNewDataForFirstMove(
                this.boardMid,
                this.state.boardContainer,
                dominoFromHand,
                this.state.currHand,
                this.state.allPlayersStats[this.state.currPlayerIndex],
                this.state.currPlayerIndex,
                this.props.gameIndex);
        }
        else {
            this.secondMoveOrAbove(dominoFromHand);
        }
    }

    boardDominoClick(iParam, jParam) {
        var isClickValid;
        //0. Exit if it's not the right user's turn\user clicked on board before hand\not current user's turn
        if (this.props.currGame.activePlayers[this.state.currPlayerIndex] !== this.props.currentUser ||
            !this.state.dominoToAdd || this.state.isGameOver) {
            return;
        }
        isClickValid = this.gameLogic.isBoardClickValid(this.state.validIndexes, iParam, jParam);
        if (isClickValid) {
            this.gameLogic.postNewDataForBoardClick(
                this.state.boardContainer,
                this.state.validIndexes,
                this.state.dominoToAdd,
                iParam,
                jParam,
                this.state.currHand,
                this.state.allPlayersStats[this.state.currPlayerIndex],
                this.state.boardContainerSize,
                this.state.locationsToFlip,
                this.state.currPlayerIndex,
                this.state.winnerIndex,
                this.state.activePlayers,
                this.props.currGame.activePlayers[this.state.currPlayerIndex],
                this.props.gameIndex
            );
            this.setState({
                dominoToAdd: null,
                showChangeDominoBtn: false
            });
        }
        else {
            alert("Illegal move - Please try again!");
        }
    }

    changeDominoBtnClick() {
        // exit if not user's turn\game is over
        if (this.props.currGame.activePlayers[this.state.currPlayerIndex] !== this.props.currentUser
            || this.state.isGameOver) {
            return;
        }
        this.gameLogic.cleanYellowDominos(this.state.boardContainer, this.state.validIndexes, this.props.gameIndex);
        this.setState({showChangeDominoBtn: false});
    }

    removePassivePlayer() {
        if (this.state.passivePlayers.includes(this.props.currentUser)) {
            this.gameLogic.removePassivePlayer(this.props.currentUser, this.props.gameIndex, this.props.currGame.title);
        }
    }
    //----------RENDER METHODS----------
    renderGameBoard() {
        return(
            <React.Fragment>
                {this.state.boardContainer ? 
                <div className='gameboard'>
                    <GameBoard
                        boardContainer={this.state.boardContainer}
                        boardDominoClick={this.boardDominoClick} />
                </div> : null}
            </React.Fragment>
        );
    }

    renderBank() {
        const isWinnerOrSecondPlace = (this.state.winnerIndex !== null &&
            this.props.currGame.activePlayers[this.state.winnerIndex] === this.props.currentUser
            || this.state.secondPlaceIndex !== null &&
            this.props.currGame.activePlayers[this.state.secondPlaceIndex] === this.props.currentUser);
        return(
            <React.Fragment>
                {this.state.currBank ? 
                <Bank drawTile={this.drawTile}
                    currBank={this.state.currBank}
                    isWinnerOrSecondPlace={isWinnerOrSecondPlace} />
                : null}
            </React.Fragment>
        )
    }

    renderHand() {
        if (!this.state.isGameOver && this.state.passivePlayers.includes(this.props.currentUser)) {
            return this.renderAllHandsForPassivePlayers();
        }
        else {
            return(
                <React.Fragment>
                    {this.state.currHand ? 
                    <Hand currHand={this.state.currHand} handDominoClick={this.handDominoClick}/>
                    : null}
                </React.Fragment>
            );
        }
    }

    renderAllHandsForPassivePlayers() {
        if (this.state.allPlayersHands) {
            return (
                <React.Fragment>
                    {this.state.allPlayersHands.map((hand, i) => {
                        return (
                            <div key={i} className='game-data'>
                                <h3 className='game-data-child'>{this.state.activePlayers[i]}'s hand: </h3>
                                <Hand currHand={hand} handDominoClick={this.handDominoClick}/>
                            </div>
                        );
                    })}
                </React.Fragment>
            );
        }
        else {
            return null;
        }
    }

    renderWinLoseMessages() {
        if (this.state.isGameOver && this.props.currGame.activePlayers.length === 2) {
            //2 players game - display win\lose messages
            if (this.props.currGame.activePlayers[this.state.winnerIndex] === this.props.currentUser) {
                return(
                    <div className='game-data'>
                        <div className='game-data-child'>
                            <h3>Congratulations {this.props.currentUser}, you won!</h3>
                        </div>
                    </div>

                );
            }
            else {
                return(
                    <div className='game-data'>
                        <div className='game-data-child'>
                            <h3>You lost, {this.props.currentUser}. Better luck next time!</h3>
                        </div>
                    </div>
                );
            }
        }
        else if (this.state.winnerIndex !== null && this.props.currGame.activePlayers.length === 3) {
            //3 players game - display win\lose messages
            if (this.props.currGame.activePlayers[this.state.winnerIndex] === this.props.currentUser) {
                return(
                    <div className='game-data'>
                        <div className='game-data-child'>
                            <h3>Congratulations {this.props.currentUser}, you won!</h3>
                        </div>
                    </div>
                );
            }
            if (this.state.secondPlaceIndex !== null) {
                if (this.props.currGame.activePlayers[this.state.secondPlaceIndex] === this.props.currentUser) {
                    return(
                        <div className='game-data'>
                            <div className='game-data-child'>
                                <h3>Congratulations {this.props.currentUser}, you are the runner up!</h3>
                            </div>
                        </div>
                    );
                }
                else {
                    return(
                        <div className='game-data'>
                            <div className='game-data-child'>
                                <h3>You lost, {this.props.currentUser}. Better luck next time!</h3>
                            </div>
                        </div>
                    );
                }
            }
        }
    }

    renderChangeDominoBtn() {
        return(
            <div className='buttons'>
                <div className='buttons-item'>
                    {this.state.showChangeDominoBtn && !this.state.isGameOver ?
                        <ChangeDominoBtn changeDominoBtnClick={this.changeDominoBtnClick} />
                    : null}
                </div>
            </div>
        );
    }

    renderStats() {
        return (
            <div className='stats'>
                {this.renderActiveStats()}
                {this.renderPassiveStats()}
            </div>
        );
    }

    renderActiveStats() {
        var secondsPlayed = 0;
        if (this.state.allPlayersSeconds[this.state.currPlayerIndex]) {
            secondsPlayed = this.state.allPlayersSeconds[this.state.currPlayerIndex];
        }
        if (!this.state.isGameOver && this.state.allPlayersStats && this.state.activePlayers.length > 1) {
            return(
                <div className='stats-item'>
                    <ActiveStats
                        userName={this.props.currGame.activePlayers[this.state.currPlayerIndex]}
                        stats={this.state.allPlayersStats[this.state.currPlayerIndex]}
                        seconds={secondsPlayed}
                        updateTime={this.updateUserSeconds}
                    />
                </div>
            );
        }
        else {
            return null;
        }

    }

    renderPassiveStats() {
        if (this.state.allPlayersStats) {
            return(
                <React.Fragment>
                    {this.state.allPlayersStats.map((stats, i) => {
                        if (!this.state.isGameOver) { // Game in play - only look for passives
                            if (i !== this.state.currPlayerIndex) {
                                let secondsPlayed = 0;
                                if (this.state.allPlayersSeconds[i]) {
                                    secondsPlayed = this.state.allPlayersSeconds[i];
                                }
                                return (
                                    <div className='stats-item' key={i}>
                                        <PassiveStats
                                            userName={this.props.currGame.activePlayers[i]}
                                            stats={stats}
                                            seconds={secondsPlayed}
                                        /> 
                                    </div>
                                );
                            }
                            else {
                                return null;
                            }
                        }
                        else { // Game over - show every player as passive
                            let secondsPlayed = 0;
                            if (this.state.allPlayersSeconds[i]) {
                                secondsPlayed = this.state.allPlayersSeconds[i];
                            }
                            return (
                                <div key={i}>
                                    <PassiveStats
                                        userName={this.props.currGame.activePlayers[i]}
                                        stats={stats}
                                        seconds={secondsPlayed}
                                    /> 
                                </div>
                            );
                        }
                    })}
                </React.Fragment>
            );
        }
        else {
            return null;
        }
    }

    renderPassivePlayersList() {
        return(
            <div className='game-data-child'>
                <h3>Passive players:
                    {this.state.passivePlayers.map((playerName, i) => {
                        if (i === this.state.passivePlayers.length - 1) {
                            return <span key={playerName}>{playerName}</span>;
                        }
                        else {
                            return <span key={playerName}>{playerName}, </span>;
                        }
                    })}
                </h3>
            </div>
        );
    }

    renderActivePlayersList() {
        return(
            <div className='game-data-child'>
                <h3>Active players: 
                    {this.props.currGame.activePlayers.map((playerName, i) => {
                        if (i === this.props.currGame.activePlayers.length - 1) {
                            return <span key={playerName}>{playerName}</span>;
                        }
                        else {
                            return <span key={playerName}>{playerName}, </span>;
                        }
                    })}
                </h3>
            </div>
        );
    }

    renderCurrentPlayerName() {
        return(
            <div className='game-data-child'>
                <h3>Current player: {this.props.currGame.activePlayers[this.state.currPlayerIndex]}</h3>
            </div> 
        );
    }

    renderWinnerName() {
        return(
            <div className='game-data-child'>
                <h3>Winner: {this.props.currGame.activePlayers[this.state.winnerIndex]}</h3>
            </div>
        );
    }

    renderSecondPlaceAndLoserNames() {
        return(
            <React.Fragment>
                <div className='game-data-child'>
                    <h3>Runner up: {this.props.currGame.activePlayers[this.state.secondPlaceIndex]}</h3>
                </div>
                <div className='game-data-child'>
                    <h3>Last place: {this.state.activePlayers[0]}</h3>
                </div>
            </React.Fragment>
        );
    }

    renderGameData() {
        return (
            <div className='game-data'>
                <div className='game-data-child'>
                    <h3>Game in play: "{this.props.currGame.title}", logged in as: {this.props.currentUser}</h3>
                </div>
                {this.renderActivePlayersList()}
                {this.state.passivePlayers !== null && this.state.passivePlayers.length > 0 ? this.renderPassivePlayersList() : null}
                {!this.state.isGameOver ? this.renderCurrentPlayerName() : null}
                {this.state.winnerIndex !== null ? this.renderWinnerName() : null}
                {this.state.secondPlaceIndex !== null ? this.renderSecondPlaceAndLoserNames() : null}
            </div>
        );
    }

    renderBackToLobbyTimer() {
        return this.state.isGameOver ? <BackToLobbyTimer backToLobby={this.props.backToLobbyFromGame}/> : null;
    }

    renderBackToLobbyFromGameBtn() {
        if (!this.state.isGameOver && this.state.winnerIndex !== null
            && this.props.currentUser == this.props.currGame.activePlayers[this.state.winnerIndex]
            || this.state.passivePlayers.includes(this.props.currentUser)) {
                return (
                    <div className='game-data'>
                        <BackToLobbyFromGameBtn
                            backToLobby={this.props.backToLobbyFromGame}
                            removePassivePlayer={this.removePassivePlayer}/>
                    </div>
                );
            }
        else {
            return null;
        }
    }

    renderChatRoom() {
        if (this.state.passivePlayers.includes(this.props.currentUser)) {
            return null;
        }
        else {
            return(
                <div className="chat-base-container">
                    <div className="user-info-area">
                        Chat: 
                    </div>
                    <ChatContainer/>                
                </div>
            );
        }

    }

    render() {
        return (
            <div className="game">
                {this.renderGameBoard()}
                {this.renderChangeDominoBtn()}
                {this.renderBank()}
                {this.renderHand()}
                {this.renderWinLoseMessages()}
                {this.renderGameData()}
                {this.renderBackToLobbyTimer()}
                {this.renderBackToLobbyFromGameBtn()}
                {this.renderStats()}
                {this.renderChatRoom()}
            </div>
        );
    }
}