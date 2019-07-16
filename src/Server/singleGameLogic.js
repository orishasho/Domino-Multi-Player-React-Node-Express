const _ = require('lodash');
var currBank = [];
var playersCurrHands = [];
var playersCurrStats = [];
var currBoard = [];
var currPlayerIndex = [];
var maxIndex = [];
var boardSize = [];
var validIndexes = [];
var locationsToFlip = [];
var activePlayers = [];
var passivePlayers = [];
var isGameOver = [];
var winnerIndex = [];
var secondPlaceIndex = [];

function initCurrPlayerIndex(req, res, next) {
    currPlayerIndex[JSON.parse(req.body)] = 0;
    isGameOver[JSON.parse(req.body)] = 0;
    boardSize[JSON.parse(req.body)] = 0;
    winnerIndex[JSON.parse(req.body)] = null;
    secondPlaceIndex[JSON.parse(req.body)] = null;
    next();
}

function addActivePlayers(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    activePlayers[dataToUpdate.gameIndex] = dataToUpdate.activePlayers;
    console.log(`player: ${JSON.stringify(activePlayers[dataToUpdate.gameIndex][0])}`)
    next();
}

function addPassivePlayers(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    passivePlayers[dataToUpdate.gameIndex] = dataToUpdate.passivePlayers;
    next();
}

function removePassivePlayer(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    const indexToRemove = passivePlayers[dataToUpdate.gameIndex].indexOf(dataToUpdate.playerName);
    passivePlayers[dataToUpdate.gameIndex].splice(indexToRemove, 1);
    next();
}

function addPassivePlayer(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    passivePlayers[dataToUpdate.gameIndex].push(dataToUpdate.currentUser);
    next();
}

function addStartBank(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    currBank[dataToUpdate.gameIndex] = dataToUpdate.startBank;
    next();
}

function addStartHands(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    playersCurrHands[dataToUpdate.gameIndex] = dataToUpdate.startHands;
    console.log(`HAND: ${playersCurrHands[dataToUpdate.gameIndex][0][0]}`)
    next();
}

function addStartBoard(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    currBoard[dataToUpdate.gameIndex] = dataToUpdate.startBoard;
    next();
}

function addStartStats(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    playersCurrStats[dataToUpdate.gameIndex] = dataToUpdate.startStats;
    next();
}
function updateMaxPlayerIndex(req, res, next) { 
    const dataToUpdate = JSON.parse(req.body);
    maxIndex[dataToUpdate.gameIndex] = dataToUpdate.maxPlayerIndex;
    next();
}

function updateDataAfterDraw(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    currBank[dataToUpdate.gameIndex] = dataToUpdate.newBank;
    playersCurrHands[dataToUpdate.gameIndex][dataToUpdate.currPlayerIndex] = dataToUpdate.newHand;
    playersCurrStats[dataToUpdate.gameIndex][dataToUpdate.currPlayerIndex] = dataToUpdate.newStats;
    next();
}

function updateDataAfterFirstMove(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    currBoard[dataToUpdate.gameIndex] = dataToUpdate.newBoard;
    playersCurrHands[dataToUpdate.gameIndex][dataToUpdate.currPlayerIndex] = dataToUpdate.newHand;
    playersCurrStats[dataToUpdate.gameIndex][dataToUpdate.currPlayerIndex] = dataToUpdate.newStats;
    boardSize[dataToUpdate.gameIndex]++;
    updateCurrPlayerIndex(dataToUpdate.gameIndex);
    next();
}

function updateDataAfterSecondMoveHandClick(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    currBoard[dataToUpdate.gameIndex] = dataToUpdate.newBoard;
    validIndexes[dataToUpdate.gameIndex] = dataToUpdate.validIndexes;
    locationsToFlip[dataToUpdate.gameIndex] = dataToUpdate.locationsToFlip;
    next();
}

function cleanYellowDominos(req, res, next) {
    const dataToUpdate = JSON.parse(req.body);
    currBoard[dataToUpdate.gameIndex] = dataToUpdate.newBoard;
    validIndexes[dataToUpdate.gameIndex] = [];
    locationsToFlip[dataToUpdate.gameIndex] = [];
    next();
}

function updateDataAfterBoardClick(req, res, next) {
    console.log('in update after board click');
    const dataToUpdate = JSON.parse(req.body);
    playersCurrHands[dataToUpdate.gameIndex][dataToUpdate.currPlayerIndex] = dataToUpdate.newHand;
    playersCurrStats[dataToUpdate.gameIndex][dataToUpdate.currPlayerIndex] = dataToUpdate.newStats;
    boardSize[dataToUpdate.gameIndex]++;
    activePlayers[dataToUpdate.gameIndex] = dataToUpdate.activePlayers;
    isGameOver[dataToUpdate.gameIndex] = dataToUpdate.endGame;
    winnerIndex[dataToUpdate.gameIndex] = dataToUpdate.winnerIndex;
    secondPlaceIndex[dataToUpdate.gameIndex] = dataToUpdate.secondPlaceIndex;
    if (!isGameOver[dataToUpdate.gameIndex]) {
        console.log('updating index afet click');
        updateCurrPlayerIndex(dataToUpdate.gameIndex);
    }
    next();
}

function updateEndGameWinner(req, res, next) { 
    const dataToUpdate = JSON.parse(req.body);
    isGameOver[dataToUpdate.gameIndex] = true;
    winnerIndex[dataToUpdate.gameIndex] = dataToUpdate.winnerIndex;
    next();
}

function restartGame(req, res, next) { //TODO: Add gameIndex
    const gameIndex = JSON.parse(req.body);
    currBank[gameIndex] = null;
    playersCurrHands[gameIndex] = null;
    playersCurrStats[gameIndex] = null;
    currBoard[gameIndex] = null;
    currPlayerIndex[gameIndex] = 0;
    maxIndex[gameIndex] = null;
    boardSize[gameIndex] = 0;
    validIndexes[gameIndex] = null;
    locationsToFlip[gameIndex] = null;
    activePlayers[gameIndex] = [];
    passivePlayers[gameIndex] = [];
    isGameOver[gameIndex] = false;
    winnerIndex[gameIndex] = null;
    secondPlaceIndex[gameIndex] = null;
    console.log('Game restarted');
    next();
}

function skipTurn(req, res, next) {
    const gameIndex = JSON.parse(req.body);
    updateCurrPlayerIndex(gameIndex);
}

function updateCurrPlayerIndex(gameIndex) {
    if (currPlayerIndex[gameIndex] === maxIndex[gameIndex]) {
        currPlayerIndex[gameIndex] = 0;
    }
    else {
        currPlayerIndex[gameIndex]++;
        if (winnerIndex[gameIndex] !== null && winnerIndex[gameIndex] === currPlayerIndex[gameIndex]) {
            updateCurrPlayerIndex(gameIndex);
        }
    }
}

function getGameData() { // Need to pass gameIndex as url param
    var gameData = {
        bank: currBank,
        hands: playersCurrHands,
        stats: playersCurrStats,
        board: currBoard,
        currPlayerIndex: currPlayerIndex,
        boardSize: boardSize,
        validIndexes: validIndexes,
        locationsToFlip: locationsToFlip,
        activePlayers: activePlayers,
        passivePlayers: passivePlayers,
        isGameOver: isGameOver,
        winnerIndex: winnerIndex,
        secondPlaceIndex: secondPlaceIndex
    }
    return gameData;
}

module.exports = {
    initCurrPlayerIndex,
    addActivePlayers,
    addPassivePlayers,
    removePassivePlayer,
    addStartBank,
    addStartHands,
    addStartBoard,
    addStartStats,
    getGameData,
    updateMaxPlayerIndex,
    updateDataAfterDraw,
    updateDataAfterFirstMove,
    updateDataAfterSecondMoveHandClick,
    cleanYellowDominos,
    updateDataAfterBoardClick,
    updateEndGameWinner,
    restartGame,
    skipTurn,
    addPassivePlayer
};