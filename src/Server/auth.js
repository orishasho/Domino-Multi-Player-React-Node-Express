var userList = {};
var gamesList = [];
var currGameIndex = -1;

//-----USER AUTH-----
function userAuthentication(req, res, next) {		
	if (userList[req.session.id] === undefined) {				
		res.sendStatus(401);		
	} else {		
		next();
	}
}

function addUserToAuthList(req, res, next) {	
	if (userList[req.session.id] !== undefined) {
		res.status(403).send('You already signed up to the system');
	} else {		
		for (sessionid in userList) {
			const name = userList[sessionid];
			if (name === req.body) {
				res.status(403).send('User name already exists');
				return;
			}
		}		
		userList[req.session.id] = req.body;
		next();
	}
}

function removeUserFromAuthList(req, res, next) {	
	if (userList[req.session.id] === undefined) {
		res.status(403).send('user does not exist');
	} else {						
		delete userList[req.session.id];
		next();
	}
}

function getUserInfo(id) {	
    return {name: userList[id]};
}

function getUserNamesList() {
	return userList;
}

//-----GAMES AUTH-----
function getGamesList() {
	return gamesList;
}

function addGameToAuthList(req, res, next) {
	//check if game title already exists
	const reqGame = JSON.parse(req.body);
	var toReturn = false;
	if (reqGame.maxPlayersNum != 2 && reqGame.maxPlayersNum != 3) {
		res.status(403).send('Players number has to be 2 or 3');
		return;
	}
	gamesList.forEach(game => {
		if (game.title === reqGame.title) {
			res.status(403).send('Game title already exists');
			toReturn = true;
		}
	});
	if (toReturn) {
		return;
	}
	//if not - add to game list
	currGameIndex++;
	const newGame = {
		title: reqGame.title,
		maxPlayersNum: reqGame.maxPlayersNum,
		curPlayersNum: 0,
		creator: userList[req.session.id],
		status: 'waiting',
		activePlayers: [],
		currPlayer: null,
		passivePlayers: [],
		gameIndex: currGameIndex
	}
	gamesList.push(newGame);
	next();
}

function joinGame(req, res, next) {
	const data = JSON.parse(req.body);
	//find the game to join
	for (let i = 0; i < gamesList.length; i++) {
		if (gamesList[i].title == data.gameTitle) {
			gamesList[i].curPlayersNum++;
			gamesList[i].activePlayers.push(data.currentUser);
			if (gamesList[i].curPlayersNum == gamesList[i].maxPlayersNum) {
				gamesList[i].status = 'started';
				console.log('changed status');
			}
			if (!gamesList[i].currPlayer) {
				gamesList[i].currPlayer = data.currentUser;
			}
		}
	}
	next();
}

function watchGame(req, res, next) {
	const data = JSON.parse(req.body);
	//find the game to watch
	for (let i = 0; i < gamesList.length; i++) {
		if (gamesList[i].title == data.gameTitle) {
			gamesList[i].passivePlayers.push(data.currentUser);
			console.log('Adding player to passive list');
		}
	}
	next();
}

function restartGame(req, res, next) {
	const gameTitle = JSON.parse(req.body);

	for (i = 0; i < gamesList.length; i++) {
		if (gamesList[i].title == gameTitle) {
			gamesList[i].curPlayersNum = 0;
			gamesList[i].status = 'waiting';
			gamesList[i].activePlayers = [];
			gamesList[i].currPlayer = null;
			gamesList[i].passivePlayers = [];
			console.log('Game restarted');
			break;
		}
	}
	next();
}

function deleteGame(req, res, next) {
	const gameTitle = JSON.parse(req.body);
	for(i = 0; i < gamesList.length; i++) {
		if (gamesList[i].title == gameTitle) {
			gamesList.splice(i, 1);
			break;
		}
	}
	next();
}

function leaveGame(req, res, next) {
	const data = JSON.parse(req.body);
	for(i = 0; i < gamesList.length; i++) {
		if (gamesList[i].title == data.gameTitle) {
			for (let j = 0; j < gamesList[i].activePlayers.length; j++) {
				if (gamesList[i].activePlayers[j] == data.userToLeave) {
					gamesList[i].activePlayers.splice(j, 1);
					gamesList[i].curPlayersNum = gamesList[i].curPlayersNum - 1;
				}
			}
		}
	}
	next();
}

function leaveGamePassive(req, res, next) {
	const data = JSON.parse(req.body);
	for(i = 0; i < gamesList.length; i++) {
		if (gamesList[i].title == data.gameTitle) {
			for (let j = 0; j < gamesList[i].passivePlayers.length; j++) {
				if (gamesList[i].passivePlayers[j] == data.userToLeave) {
					gamesList[i].passivePlayers.splice(j, 1);
					gamesList[i].curPlayersNum = gamesList[i].curPlayersNum - 1;
				}
			}
		}
	}
	next();
}

function unwatchGame(req, res, next) {
	const data = JSON.parse(req.body);
	for(i = 0; i < gamesList.length; i++) {
		if (gamesList[i].title == data.gameTitle) {
			for (let j = 0; j < gamesList[i].passivePlayers.length; j++) {
				if (gamesList[i].passivePlayers[j] == data.userToLeave) {
					gamesList[i].passivePlayers.splice(j, 1);
				}
			}
		}
	}
	next();
}

module.exports = {
	userAuthentication,
	addUserToAuthList,
	removeUserFromAuthList,
	getUserInfo,
	getUserNamesList,
	getGamesList,
	addGameToAuthList,
	joinGame,
	watchGame,
	restartGame,
	deleteGame,
	leaveGame,
	unwatchGame,
	leaveGamePassive
};
