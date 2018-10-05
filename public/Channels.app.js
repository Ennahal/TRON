// class ChannelsApp{
//     constructor(socket) {
// 		this.socket = socket;// On save la socket dans l'objet
// 		this.list = [];// On créé une liste bidon de canaux
// 		this.app = new Vue(// On link avec vuejs
// 		{
// 			el: '#app_chanlist',// On relie vuejs à l'élement dans le dom (selon selecteur) : EL => ELEMENT
// 			data:// Les données qui sont lié au dom : notre this.list correspond à la liste des canaux
// 			{
// 				channels: this.list
// 			},
// 			methods:
// 			{
// 				select: (channel) =>
// 				{
// 					this.socket.emit('channel_join', channel.name);
// 					messagesApp.loadFromChannel(channel.name);
// 				}
// 			}
// 		});
// 		// On va initialiser les sockets
// 		this.initSocket();
//     }

//     initSocket() {
// 		this.socket.on("channel_new", (channel) =>
// 		{
// 			this.list.push({name:channel, messages:[]});
// 		});
// 		this.socket.on("channel_history", (chanList) =>
// 		{
// 			this.list.splice(0, this.list.length);
// 			let i = 0;
// 			while (i < chanList.length)
// 			{
// 				this.list.push({name:chanList[i], messages:[]});
// 				i++;
// 			}
// 		});
//     }
// }