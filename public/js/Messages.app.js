class MessagesApp
{
	constructor(socket)
	{
		this.socket = socket;
		this.currentChannel = "home";
		this.list = [];
		this.app = new Vue(
		{
			el: '#app_msglist',
			data:
			{
				messages:this.list
			},
			updated:this.scrollToBottom.bind(this)
		});
		// On va initialiser les sockets
		this.initSocket();
		// Le formulaire d'envoie de message
		this.initForm();
	}
	loadFromChannel(channel)
	{
		let messages = [];
		var i = 0;
		while (i < channelsApp.list.length && messages.length == 0)
		{
			if (channelsApp.list[i].name == channel)
				messages = channelsApp.list[i].messages;
			i++;
		}
		this.list.splice(0, this.list.length);
		i = 0;
		while (i < messages.length)
		{
			this.list.push(messages[i]);
			i++;
		}
		this.currentChannel = channel;
	}
	scrollToBottom()
	{
		var div = document.querySelector("div.msg_history");
		div.scrollTop = div.scrollHeight;
	}
	initForm()
	{
		document.querySelector('form.type_msg').addEventListener('submit', (info) =>
		{
			// On n'oublie pas le preventDefault
			info.preventDefault();
			// On récupère le contenu de l'input
			let val = document.querySelector('form.type_msg input').value;
			// On l'envoie par la socket
			this.socket.emit("message", this.currentChannel, val);
			// On reset l'input
			document.querySelector('form.type_msg input').value = "";
			// Pour la rétrocompatibilité
			return false;
		});
	}
	initSocket()
	{
		// La liste de la mort qui tue d'après Florian
		// A réception d'un message, on ajoute ce dit message dans la liste des messages
		this.socket.on("message", (channel, message) =>
		{
			if (this.currentChannel == channel)
				this.list.push.bind(this.list);
			var i = 0;
			while (i < channelsApp.list.length)
			{
				if (channelsApp.list[i].name == channel)
					return channelsApp.list[i].messages.push(message);
				i++;
			}
		});
		this.socket.on("message_history", (channel, list) =>
		{
			if (this.currentChannel == channel)
			{
				var i = list.length - 1;
				while (i > 0)
				{
					this.list.unshift(list[i]);
					i--;
				}
			}
			var i = 0;
			while (i < channelsApp.list.length)
			{
				if (channelsApp.list[i].name == channel)
					channelsApp.list[i].messages.unshift.apply(channelsApp.list[i].messages, list.reverse());
				i++;
			}
		});
	}
}