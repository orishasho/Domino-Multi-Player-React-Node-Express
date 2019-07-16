const express = require('express');
const auth = require('./auth');
const gamesManagement = express.Router();

gamesManagement.get('/', auth.userAuthentication, (req, res) => {
	const userName = auth.getUserInfo(req.session.id).name;
	res.json({name:userName});
});

gamesManagement.get('/allGames', auth.userAuthentication, (req, res) => {	
	let gamesList = auth.getGamesList();
	res.json(gamesList);
});

gamesManagement.post('/addGame', auth.addGameToAuthList, (req, res) => {		
	res.sendStatus(200);
});

gamesManagement.post('/joinGame', auth.joinGame, (req, res) => {
	res.sendStatus(200);
});

gamesManagement.post('/watchGame', auth.watchGame, (req, res) => {
	res.sendStatus(200);
});

gamesManagement.post('/unwatchGame', auth.unwatchGame, (req, res) => {
	res.sendStatus(200);
});

gamesManagement.post('/restartGame', auth.restartGame, (req, res) => {
	res.sendStatus(200);
});

gamesManagement.delete('/deleteGame', auth.deleteGame, (req, res) => {
	res.sendStatus(200);
});

gamesManagement.post('/leaveGame', auth.leaveGame, (req, res) => {
	res.sendStatus(200);
});

module.exports = gamesManagement;