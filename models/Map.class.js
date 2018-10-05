class Map {
    // Créer un tableau 2D de 60x80
    // Ajouter les joueurs sur la map par défaut
    // Gérer les collisions
    // Gérer les powerups*
    // OK ?
    constructor(height, width, players) {
        // height : 80, width : 60 (ou l'inverse)
        this.height = height;
        this.width = width;
        this.players = players;
        this.map = [];
        this.create();
        this.initPlayerPosition();
    }
    move(player, x, y)// player.x, player.y
    {
    	console.log(player.login, "move");
        if (this.testXY(x, y))
        {
            // x, y valides
            this.map[x][y] = player.color;
            return true;
        }
        return false;
    }
    initPlayerPosition() {
        let defaultCoords = [
            [10, 10, "right"],
            [10, this.width - 10, "up"],
            [this.height - 10, 10, "left"],
            [this.height - 10, this.width - 10, "down"]
        ];
        let i = 0;
        while (i < this.players.length) {
            let x = defaultCoords[i][0];
            let y = defaultCoords[i][1];
            let dir = defaultCoords[i][2];
            this.players[i].initPosition(x, y, dir);
            this.map[x][y] = this.players[i].color;
            i++;
        }
    }
    create() {
        let x = 0;
        let y = 0;
        while (x < this.height) {
            this.map[x] = [];
            y = 0;
            while (y < this.width) {
                this.map[x][y] = "";
                y++;
            }
            x++;
        }
        // this.map[height][width]
    }
    testXY(x, y) {
        // Si la colonne existe && si la ligne existe && (si la case est vide || ou si la case contient un powerup)
        if (this.map[x] !== undefined && this.map[x][y] !== undefined && this.map[x][y] == "")
            return true;
        return false;
    }
}
module.exports = Map;