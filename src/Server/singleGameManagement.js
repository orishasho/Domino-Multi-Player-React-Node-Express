const express = require('express');
const singleGameLogic = require('./singleGameLogic');
const singleGameManagement = express.Router();

singleGameManagement.post('/addActivePlayers', singleGameLogic.addActivePlayers, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/addPassivePlayers', singleGameLogic.addPassivePlayers, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/removePassivePlayer', singleGameLogic.removePassivePlayer, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/addStartBank', singleGameLogic.addStartBank, (req, res) => {		
	res.sendStatus(200);
});

singleGameManagement.post('/addStartHands', singleGameLogic.addStartHands, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/addStartBoard', singleGameLogic.addStartBoard, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/addStartStats', singleGameLogic.addStartStats, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/updateMaxPlayerIndex', singleGameLogic.updateMaxPlayerIndex, (req, res) => {
    res.sendStatus(200);    
});

singleGameManagement.post('/updateDataAfterDraw', singleGameLogic.updateDataAfterDraw, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/updateDataAfterFirstMove', singleGameLogic.updateDataAfterFirstMove, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/updateDataAfterSecondMoveHandClick', singleGameLogic.updateDataAfterSecondMoveHandClick, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/cleanYellowDominos', singleGameLogic.cleanYellowDominos, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/updateDataAfterBoardClick', singleGameLogic.updateDataAfterBoardClick, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/updateEndGameWinner', singleGameLogic.updateEndGameWinner, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/restartGame', singleGameLogic.restartGame, (req, res) => {
	res.sendStatus(200);
});

singleGameManagement.post('/skipTurn', singleGameLogic.skipTurn, (req, res) => {
    res.sendStatus(200);
})

singleGameManagement.post('/initCurrPlayerIndex', singleGameLogic.initCurrPlayerIndex, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.post('/addPassivePlayer', singleGameLogic.addPassivePlayer, (req, res) => {
    res.sendStatus(200);
});

singleGameManagement.get('/getGameData', (req, res) => {
    let gameData = singleGameLogic.getGameData();
    res.json(gameData);
});

module.exports = singleGameManagement;