const Map = require('./Map.class.js');
//Game.class.js => Game => socket.game_join, socket.game_leave, socket.game_ready
// uniqid pour la Game => socket.game_join_ID
// creation de l'unique Id
const NB_PLAYER_FFA = 4;
const NB_PLAYER_FTF = 2
const HEIGHT = 80;
const WIDTH = 60;
const uniqid = require('uniqid');
class Game
{
	constructor(player, type)
	{
		this.host = player;
		this.listPlayer = [];
		this.listPlayerReady = [];
		this.id = uniqid();
		this.nb_player = verifType(type);
		this.join(player);
		this.playerLive = []
		this.listLooser = [];
		this.scoreTab = [];
	}
	go()
	{
	  this.listPlayerReady.map(i=> this.playerLive.push(i))
		// gameloop
		setInterval(()=>
		{
			while (this.playerLive > 1)
			{
			  if (this.playerLive[i].isAlive)
					this.playerLive[i].move(this.map);
		    else if (!this.listLooser.contains(this.playerLive[i].id))
			    this.listLooser.push(this.playerLive.splice(i, 1));
			}
			
	    this.sendAll("winner", this.playerLive[0].login + "a gagné")
      
		}, 100);// VARIABLE => 10 => 100
		// 1 - Dire a tout que la partie est finie, finir la partie, envoyer le score/podium, etc...
		if(this.listLooser.length == 3){
      gameFinish();
		}

		// 2- 
		// On va pas déplacer 100 fois par seconde les joueurs
		// 1/10 => déplacement vitesse normale
		// 1/7 => déplacement rapide
		// 1/12 => déplacement lent
		// sur 2 secondes => un rapide va se déplacer 3 fois, un moyen 2 fois, un lent 1 fois
		// 200 tours de setInterval => 6 tours "utiles", 194 autres tours servent juste à gérer les vitesses différentes
	}
	gameFinish(){
	  var i = 0 ;
	  while(this.scoreTab.length == this.nb_player - 1 ){
      this.scoreTab.push({"player" : this.listLooser.splice(0, 1),"score": i})
      i++;
    }
    this.scoreTab.push({"player" : this.playerLive.splice(0,1),"score":4})
    this.sendAll("score",this.scoreTab)
	}
	
	verifType(type)
	{
	  if(type == 'FFA')
	    return NB_PLAYER_FFA
	  else
	    return NB_PLAYER_FTF
	}
	
	isFull()
	{
	  if(this.listPlayerReady == this.nb_player)
	      return true
	  return false
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
		if (this.listPlayer.length < this.nb_player)
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
	  	if (this.listPlayerReady.length == this.nb_player)
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
module.exports = Game;