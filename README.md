# Domino-Multi-Player-React-Node-Express
A multi player domino game website built as a ReactJS, NodeJS &amp; Express app.
To set up the project:
1. Clone this repository.
2. In the created folder install the node modules using npm install.
3. Open a terminal and run the script npm run build-watch.
4. Open another terminal and run the script npm run start-watch.
5. Browse to localhost:3000

Project summary:
1. When you launch the project, a Sign up page will load. The server checks whether you already signed up in the current session
or the name you chose is taken. If not, you'll be redirected to the Lobby page.
2. In the Lobby page you can view all the users that are logged in to the system, as well as the games in the system and their status.
3. Each user can create a game via the form in the Lobby. The server checks if the game title is taken and if you entered a wrong number of players.
4. While there are no users signed in the game, the creator can delete the game by clicking the "Delete Game" button.
5. If a game hasn't started, you can join it by clicking the "Join Game" button. You'll be redirected to the Game Wait Room and the 
game will start automatically once the specified number of players joined.
6. Once the game started, each player only sees their own hand, but the game board and bank are common for everyone.
7. The game specifies at all times the players lists and the current player.
8. If a 2 player game was chosen, once a player wins (gets rid of all his tiles), the game ends and the players will be redirected back
to the Lobby in 30 seconds.
9. If a 3 player game was chosen, the game continues after a player wins in order to determine the runner up. The winner can exit or watch.

Special features:
1. Multiple games: Multiple games can be played at the same time by different people - each game is independent, but all of the games are shown in the Lobby.
2. Watch game: You can choose to watch a game passively instead of joining as an active player by clicking the "Watch Game" button in the Lobby.
You can start watching a game even if it started, and you can stop watching and get back to the Lobby at any time. When you watch a game,
you're viewing all of the active players hands.
3. Statistics: The game specifies each and every player's statistics at all times.
4. Chat: There's a simple chat in each game, allowing you to chat with the other players.

