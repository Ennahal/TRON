const Player = require('./models/Player.class.js');
// Import de la classe
// const Game = require('models/Game.class.js');
// Instanciation de l'objet
// var game = new Game();
/*
client => server
move_left
move_right
move_up
move_down
use_powerup
game_leave
game_ready
game_join(id_game)
game_create(type)// ffa ou ftf
user_register({login:"", avatar:""})
message_ffa(content)
message_ftf(content)

server => client
game_list([{id:"", players:""}])
user_list([{login:"", avatar:""}])
player_dead
game_start
message_ffa({date:new Date(), login:"", avatar:"", content:""})
message_ftf({date:new Date(), login:"", avatar:"", content:""})
*/
/**
index.js => Server => io.connection, socket.user_register, socket.game_create, socket.message => le lobby par défaut
Game.class.js => Game => socket.game_join, socket.game_leave, socket.game_ready
// uniqid pour la Game => socket.game_join_ID
	=> Map.class.js => /!\ [80][60] => map.collide(x, y);
Player.class.js => Player => haut / bas / gauche / droite : droite / gauche + vitesse up/vitesse down : espace
**/

//--------------------------------- ancien index.js
const PORT = 3142;
class Server
{
	constructor()
	{
		this.express = require('express');
		this.app = this.express();
		this.http = require('http').Server(this.app);
		this.io = require('socket.io')(this.http);
		this.rooms = [] ;
		this.players = {};
		this.games = {};
		this.init();
	}
	createGame(player)
	{
		var game = new Game(player);
		this.games[game.id] = game;
		// uniqid(); => dans Game.constructor
		// Faire des trucs cools genre new Game :p
	}
	removePlayer(player)
	{
		delete this.players[player.id];
	}
	joinGame(player, gameId)
	{
		this.games[gameId].join(player);
	}
	createPlayer(socket, info)
	{// const Player = require('models/Player.class.js');
		var player = new Player(socket, info);
		this.players[player.id] = player;
		console.log("New Player > ", player.login);
		// Se déconnecter
		socket.on("disconnect", this.removePlayer.bind(this, player));
		// Créer une partie
		socket.on("game_create", this.createGame.bind(this, player));
		// Envoyer la liste des games
		socket.emit("game_list", this.games.map(game => game.id));
		// Envoyer la liste des joueurs
		socket.emit("user_list", this.players.map((user) =>
		{
			return {login:user.login, avatar:user.avatar, id:user.id}
		});
		// Rejoindre une partie par son id
		socket.on("game_join", this.joinGame.bind(this, player));
	}
	init()
	{
		this.app.use(this.express.static('public'));
		this.io.on('connection', (socket) =>
		{
			socket.on('user_register', this.createPlayer.bind(this, socket));
			
			socket.on("message_ffa", (content ="") => {
			  let msg_ffa = {date:new Date(), login:socket.player.login, avatar:socket.player.avatar, content:content}
        this.io.to()
			});
			socket.on("message_ftf", (content ="") => {
			  let msg_ftf = {date:new Date(), login:socket.player.login, avatar:socket.player.avatar, content:content}
			});
			/* A VOIR AVEC LE FRONT POUR LES MESSAGES
			socket.on("message", (channel, content = "") =>
			{
				if (content.trim().length > 0 && content.trim().length < 1024)
				{
					if (!socket.interval)
					{
						socket.nbr = 0;
						socket.interval = setTimeout(() =>
						{
							socket.nbr = 0;
							socket.interval = undefined;
						}, 1000);
					}
					socket.nbr++;
					if (socket.nbr < SPAM_MAX_MESSAGE + 1)
					{
						let msg = {date:new Date(), content:content, login:socket.user.login, avatar:socket.user.avatar};
						console.log("New Message > ", channel, msg);
						this.io.to(channel).emit("message", channel, msg);
						this.chanList[channel].push(msg);
						if (this.chanList[channel].length > HISTORY_MAX_MESSAGE)
							this.chanList[channel].shift();
					}
					else
						socket.emit("message", channel, {date:new Date(), content:"Ce message ne peut pas être affiché : "+content, login:"Serveur", avatar:"https://static.thenounproject.com/png/371299-200.png"});
				}
				this.io.emit("user_resting", socket.user);
			});*/
		});
	}
	listen(port)
	{
		this.http.listen(port, function ()
		{
			console.log('Example app listening on port '+port+'!');
		});
	}
}
var server = new Server()
server.listen(PORT);