//Game.class.js => Game => socket.game_join, socket.game_leave, socket.game_ready
// uniqid pour la Game => socket.game_join_ID
// creation de l'unique Id
const NB_PLAYER = 4;
const HEIGHT = 80;
const WIDTH = 60;
const uniqid = require('uniqid');
class Game
{
	constructor(player)
	{
		this.host = player;
		this.listPlayer = [];
		this.listPlayerReady = [];
		this.id = uniqid();
		this.join(player);
		this.listLooser = [];
	}
	go()
	{
		// gameloop
		setInterval(()=>
		{
			let i = 0;
			while (i < this.listPlayerReady.length)
			{
				if (this.listPlayerReady[i].isAlive)
					this.listPlayerReady[i].move(this.map);
		    	else if (!this.listLooser.contains(this.listPlayerReady[i].id))
			      	this.listLooser.push(this.listPlayerReady.splice(i, 1));
				i++;
			}
			if(this.listLooser.length == NB_PLAYER - 1) {
	      this.sendAll("winner", this.listPlayerReady[0].login + "a gagné")
      }
			// Dire a tout que la partie est finie, finir la partie, envoyer le score/podium, etc...
		}, 100);
	}
	join(player)
	{
		player.socket.on('game_leave', () =>
		{
			let i = 0
			while (i < this.listPlayer.length)
			{
				if (this.listPlayer[i].id == player.id)
					this.listPlayer.splice(i, 1);
				i++;
			}
			i = 0
			while (i < this.listPlayerReady.length)
			{
				if (this.listPlayerReady[i].id == player.id)
					this.listPlayerReady.splice(i, 1);
				i++;
			}
		});
		if (this.listPlayer.length < NB_PLAYER)
		{
			this.listPlayer.push(player);
			player.socket.once('game_ready', () =>
			{
				this.listPlayerReady.push(player);
				this.gameReady();
			});// game_ready, game_start...
		}
	}
	sendAll(type, content)
	{
		/* let i = 0;
        while (i < this.listPlayerReady.length) {
            this.listPlayerReady[i].socket.emit(type, content);
            i++;
      } */
    this.listPlayerReady.map(i => i.socket.emit(type, content))
	}
	gameReady()
	{
	  	if (this.listPlayerReady.length == NB_PLAYER)
	  	{
	  		// générer la map
	  		this.map = new Map(HEIGHT, WIDTH, this.listPlayerReady);
	  		this.sendAll("game_start");
	  		setTimeout(() =>
	  		{
				this.go();
	  		}, 5000);
	  		return true;
	  	}
	  	return false;
	}
	
}
module.export = Game;