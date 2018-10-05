const uniqid = require('uniqid');
class Player {
    constructor(socket, info) {
        this.socket = socket;
        this.id = uniqid();
        this.speed = 1;
        this.isAlive = true;
        this.login = info.login;
        this.avatar = info.avatar;
        this.x = undefined;
        this.y = undefined;
        this.position = undefined;
        this.initsocket();
    }
    initPosition(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
    changeDirection(direction)// left right
    {
        if (direction == 'left') {
            if (this.direction == "top")
                this.direction = "left";
            else if (this.direction == "left")
                this.direction = "down";
            else if (this.direction == "down")
                this.direction = "right";
            else if (this.direction == "right")
                this.direction = "top";
        }
        else if (direction == 'right') {
            if (this.direction == "top")
                this.direction = "right";
            else if (this.direction == "right")
                this.direction = "down";
            else if (this.direction == "down")
                this.direction = "left";
            else if (this.direction == "left")
                this.direction = "top";
        }
    }
    move(map) {
        // this.direction + this.speed
        var alive = undefined;
        if (this.direction == "top")
            alive = map.move(this, this.x, this.y - 1);
        else if (this.direction == "right")
            alive = map.move(this, this.x + 1, this.y);
        else if (this.direction == "down")
            alive = map.move(this, this.x, this.y + 1);
        else if (this.direction == "left")
            alive = map.move(this, this.x - 1, this.y);
        if (!alive) {
            this.isAlive = false;
            this.socket.emit("player_dead");
        }
    }
    speed(speeding) {
        if (speeding == 'up')
            this.speed += 1
        if (speeding == 'down')
            this.speed -= 1 / 2
    }
    initsocket() {
        this.socket.on('move_left', () => this.changeDirection('left'))
        this.socket.on('move_right', () => this.changeDirection('right'))
        this.socket.on('move_up', () => this.speed('up'))
        this.socket.on('move_down', () => this.speed('down'))
        this.socket.on('use_powerUp', () => this.useItem())
    }

    useItem() {

    }

    playerIsAlive() {
        if (this.isAlive === true)
            this.speed = 1;
        else
            this.speed = 0;
    }

}
module.exports = Player;