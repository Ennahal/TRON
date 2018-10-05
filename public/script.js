// Initialisation des paramètres globaux
// momentjs pour la date en FRancais
moment.locale('fr');
// Le filtre vuejs pour l'affichage de la date au bon format
Vue.filter('formatDate', (value) => moment(value).format('HH:mm'));
// La connexion au serveur de socket
var socket = io("//pixelsass.fr:3142");/*url:port*/
// Création des apps vuejs (Messages, Channels, Users)

// var messagesApp = new MessagesApp(socket);
//var channelsApp = new ChannelsApp(socket);
var usersApp = new UsersApp(socket);