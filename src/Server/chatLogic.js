const auth = require('./auth');
var allChatsContents = [[]];

function getAllChatsContents() {
    return allChatsContents;
}

function addNewMsg(req, res, next) {
    const userInfo =  auth.getUserInfo(req.session.id);
    if (allChatsContents.length > req.params.gameIndex) {
        allChatsContents[req.params.gameIndex].push({user: userInfo, text: req.body});
    }
    else {
        allChatsContents[req.params.gameIndex] = new Array();
        allChatsContents[req.params.gameIndex].push({user: userInfo, text: req.body});
    }
    next();
}

module.exports = {
    getAllChatsContents,
    addNewMsg
};
