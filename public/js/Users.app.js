class UsersApp
{
	constructor(socket)
	{
		this.socket = socket;
		this.list = [];
		this.app = new Vue(
		{
			el: '#app_userlist',
			data:
			{
				users:this.list
			}
		});
		/*this.initSocket();*/
		this.initForm();
		/*this.initStatus();*/
	}
	/*initStatus()
	{
		// debounce : Ca envoie un message si il ne s'est rien déclenché pendant 1s
		// Si vous écrivez plus pendant 1s, user_resting est envoyé
		document.querySelector('form.messages_input input').addEventListener('keyup', debounce(() => this.socket.emit("user_resting"), 1000));
		// throttle : Ca envoie un message au maximum toutes les secondes tant que l'event se déclenche
		// Tant que vous écrivez, user_writing est envoyé au maximum toutes les secondes (et pas à chaque keyup)
		document.querySelector('form.messages_input input').addEventListener('keyup', throttle(() => this.socket.emit("user_writing"), 1000));
	}*/
	initForm()
	{
		document.querySelector('.structure_register_absolute .register_form').addEventListener('submit', (info) =>
		{
			info.preventDefault();
			// 2 champs à récupérer, login et avatar
			let login = document.querySelectorAll('.structure_register_absolute .register_form input')[0].value;
			let avatar = document.querySelectorAll('.structure_register_absolute .register_form input')[1].value;
			// On va cacher le mask de register
			document.querySelector('.structure_register_absolute').style.display = 'none';
			// On reset
			document.querySelectorAll('.structure_register_absolute .register_form input')[0].value = "";
			document.querySelectorAll('.structure_register_absolute .register_form input')[1].value = "";
			// On focus l'input du tchat
<<<<<<< HEAD
			document.querySelector(".type_msg .input_msg_write input").focus();
=======
			document.querySelector(".type_message .input_msg_write input").focus();
>>>>>>> 8fb0b3b1837d446f242f6ccd29029823384e66d6
			// On envoie les datas au serveur
			this.socket.emit("user_register", {login:login, avatar:avatar});
			return false;
		});
	}
	initSocket()
	{
		// this.socket.on('user_writing', (user) =>
		// {
		// 	var i = 0;
		// 	while (i < this.list.length)
		// 	{
		// 		if (this.list[i].login == user.login)
		// 		{
		// 			//console.log(user.login+" is writing");
		// 			Vue.set(this.app.users, i, user);
		// 			return;
		// 		}
		// 		i++;
		// 	}
		// });
		// this.socket.on('user_resting', (user) =>
		// {
		// 	var i = 0;
		// 	while (i < this.list.length)
		// 	{
		// 		if (this.list[i].login == user.login)
		// 		{
		// 			//console.log(user.login+" is resting");
		// 			Vue.set(this.app.users, i, user);
		// 			return;
		// 		}
		// 		i++;
		// 	}
		// });
		this.socket.on('user_list', (users) => 
		{
			console.log(users[0].login);
			console.log(users[0].avatar);
		});
		// // A la connexion d'un nouvel utilisateur
		// this.socket.on('user_connected', (user, list, message) =>
		// {
		// 	// Debug
		// 	console.log("Bonjour nouvel utilisateur > ", user);
		// 	// Ajouter un message pour prévenir de l'arrivé de user
		// 	// {date:new Date(), content:content, login:socket.user.login, avatar:socket.user.avatar}
		// 	messagesApp.list.push(message);
		// 	// On doit remplir notre this.list avec la nouvelle liste des utilisateurs SANS perdre le pointeur
		// 	// On vide le tableau SANS changer le pointeur
		// 	this.list.splice(0, this.list.length);
		// 	// On le rempli au fur et à mesure SANS changer le pointeur
		// 	var i = 0;
		// 	while (i < list.length)
		// 	{
		// 		this.list.push(list[i]);
		// 		i++;
		// 	}
		// });
		// A la déconnexion d'un utilisateur
		// this.socket.on('user_disconnected', (user, list, message) =>
		// {
		// 	console.log("Au revoir utilisateur > ", user);
		// 	messagesApp.list.push(message);
		// 	this.list.splice(0, this.list.length);
		// 	var i = 0;
		// 	while (i < list.length)
		// 	{
		// 		this.list.push(list[i]);
		// 		i++;
		// 	}
		// });
	}
}
// 6 : this.list = []; // il est partagé avec les data de vuejs
// 34 : list => il a son propre pointeur en mémoire
// 37 : this.list = list; // on change notre ancien this.list par la nouvelle list, on change complètement la variable, on change PAS la valeur de la variable