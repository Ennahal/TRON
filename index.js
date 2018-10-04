const PORT = 3000;
const HISTORY_MAX_MESSAGE = 50;
const SPAM_MAX_MESSAGE = 2;
class Server {
    constructor() {
        this.express = require('express');
        this.app = this.express();
        this.http = require('http').Server(this.app);
        this.io = require('socket.io')(this.http);
        this.userList = [];// Liste des utilisateurs connnectés
        // this.msgList = [];// Liste des anciens messages -> has been, vu qu'on a l'historique indépendamment pour chaque canal
        // key : nom du canal, value : liste des messages (historique)
        this.chanList = { "home": [], "gaming": [] };// Liste des canaux/rooms
        this.init();
    }
    init() {
        this.app.use(this.express.static('public'));
        // 1. la socket se connecte
        this.io.on('connection', (socket) => {
            // 2. l'utilisateur envoie le formulaire de register (login + avatar)
            // this.socket.emit("user_register", {login:login, avatar:avatar});
            socket.on('user_register', (user) => {
                // Par défaut le nouvel utilisateur rejoint le canal de base "home"
                socket.join("home");
                // Vérification taille du login de l'utilisateur (ternaire)
                user.login = user.login.length > 20 ? user.login.substring(0, 20) : user.login;
                // Enregistrer l'adresse IP
                user.ip = socket.handshake.address;
                // Passer writing à false par défaut
                user.writing = false;
                // Faire le lien entre une socket et son propriétaire (on va relier la socket au couple login/avatar)
                socket.user = user;
                // On stock le nouvel utilisateur dans notre liste d'users connectés
                // Avant d'insérer l'utilisateur dans la liste
                user.position = this.userList.length;
                this.userList.push(user);
                // Petit debug
                console.log("New User > ", user, "Nb users > ", this.userList.length);
                // 3. envoie de user_connected => Prévenir tous les utilisateurs du nouvel arrivant
                this.io.emit("user_connected", user, this.userList, { login: "Serveur", content: "Un nouvel utilisateur s'est connecté : " + user.login, avatar: "https://static.thenounproject.com/png/371299-200.png", date: new Date() });
                // Avant on envoyait directement this.msgList
                // Maintenant il faut envoyer l'historique du canal en question, du coup à la connexion on envoie l'historique de "home"
                socket.emit("message_history", "home", this.chanList["home"]);
                // 4. possibilité de user_disconnected => event en cas de deco
                socket.on("disconnect", () => {
                    // On va retirer de notre liste des utilisateurs connectés celui qui s'en va
                    var ready = false;
                    var i = 0;
                    while (i < this.userList.length) {
                        if (this.userList[i].login == user.login)// login / avatar
                        {
                            this.userList.splice(i, 1);
                            ready = true;
                        }
                        if (ready && this.userList[i] !== undefined)
                            this.userList[i].position--;
                        i++;
                    }
                    // On prévient les utilisateurs restant du départ
                    this.io.emit("user_disconnected", user, this.userList, { login: "Serveur", content: "Un utilisateur s'est déconnecté : " + user.login, avatar: "https://static.thenounproject.com/png/371299-200.png", date: new Date() });
                });
                // 5. possibilité de message => Lors de la réception d'un message
                // On a rajouté le channel dans lequel le message est écrit
                socket.on("message", (channel, content = "") => {
                    // Message vide ou trop long ?
                    if (content.trim().length > 0 && content.trim().length < 1024)// Vérifier la validité du message
                    {
                        // Vérifier et gérer le SPAM
                        if (!socket.interval) {
                            socket.nbr = 0;
                            socket.interval = setTimeout(() => {
                                socket.nbr = 0;
                                socket.interval = undefined;
                            }, 1000);
                        }
                        socket.nbr++;
                        if (socket.nbr < SPAM_MAX_MESSAGE + 1)// Si NON SPAM
                        {
                            // On génére le message
                            let msg = { date: new Date(), content: content, login: socket.user.login, avatar: socket.user.avatar };
                            // DEBUG
                            console.log("New Message > ", channel, msg);
                            // Avant on avait juste la transmission du message à tout le monde via io.emit
                            // Maintenant on choisit d'envoyer le message seulement au canal auquel il est destiné
                            this.io.to(channel).emit("message", channel, msg);
                            //      |<---- On envoie vers "channel"
                            // On ajoute comme d'habitude le message dans l'historique de ce canal
                            this.chanList[channel].push(msg);
                            // On fait le ménage si l'historique est trop grand
                            if (this.chanList[channel].length > HISTORY_MAX_MESSAGE)
                                this.chanList[channel].shift();
                        }
                        else// Si SPAM on envoie a l'utilisateur son propre message avec un message de service
                            socket.emit("message", channel, { date: new Date(), content: "Ce message ne peut pas être affiché : " + content, login: "Serveur", avatar: "https://static.thenounproject.com/png/371299-200.png" });
                    }
                    this.io.emit("user_resting", socket.user);
                });
                // On envoie la liste des canaux (les clefs de this.chanList)
                socket.emit("channel_history", Object.keys(this.chanList));
                // L'utilisateur rejoint ou quitte une room
                socket.on("channel_join", (channel) => {
                    // DEBUG
                    console.log(socket.user.login, " join ", channel);
                    // On vérifie si le canal existe si PAS
                    if (this.chanList[channel] === undefined) {
                        // Si il existe pas, on le créé, avec par défaut un historique vide
                        this.chanList[channel] = [];
                        // On envoie à tous le fait qu'un nouveau canal existe
                        this.io.emit("channel_new", channel);
                    }
                    // Par défaut quand un utilisateur envoie channel_join c'est quand même pour le rejoindre
                    socket.join(channel);
                });
                socket.on("channel_leave", (channel) => {
                    socket.leave(channel);
                });
                // Utilisateur en train d'écrire ou pas
                socket.on("user_writing", () => {
                    socket.user.writing = true;
                    this.io.emit("user_writing", socket.user);
                });
                socket.on("user_resting", () => {
                    socket.user.writing = false;
                    this.io.emit("user_resting", socket.user);
                });
            })
        });
    }
    listen(port) {
        this.http.listen(port, function () {
            console.log('Example app listening on port ' + port + '!');
        });
    }
}
var server = new Server();
server.listen(PORT);