const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userManagement = require('./Server/userManagement');
const gamesManagement = require('./Server/gamesManagement');
const singleGameManagement = require('./Server/singleGameManagement');
const chatManagement = require('./Server/chat');
const app = express();

app.use(session({ secret: 'keyboard cat', cookie: {httpOnly: false, maxAge:269999999999}}));
app.use(bodyParser.text());
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use('/users', userManagement);
app.use('/games', gamesManagement);
app.use('/singleGame', singleGameManagement);
app.use('/chat', chatManagement);
app.listen(3000, console.log('App listening on port 3000!'));