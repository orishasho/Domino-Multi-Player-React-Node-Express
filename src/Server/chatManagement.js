const express = require('express');
const chatLogic = require('./chatLogic');
const bodyParser = require('body-parser');
const chatManagement = express.Router();

chatManagement.use(bodyParser.text());

chatManagement.get('/', (req, res) => {
	let allChatsContents = chatLogic.getAllChatsContents();
    res.json(allChatsContents);
});

chatManagement.post('/:gameIndex', chatLogic.addNewMsg, (req, res) => {
    res.sendStatus(200);
});
/*
	.post(auth.userAuthentication, (req, res) => {		
        const body = req.body;
        const userInfo =  auth.getUserInfo(req.session.id);
        chatContent.push({user: userInfo, text: body});        
        res.sendStatus(200);
	});
chatManagement.appendUserLogoutMessage = function(userInfo) {
	chatContent.push({user: userInfo, text: `user had logout`}); 
}
*/



module.exports = chatManagement;