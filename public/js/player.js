class Player {
    constructor(playerInfo) {
    this.body = [];
    this.info = playerInfo;
    this.directions = {
        'right': {
            x: 1,
            y: 0
        },
        'left': {
            x: -1,
            y: 0
        },
        'up': {
            x: 0,
            y: -1
        },
        'down': {
            x: 0,
            y: 1
        }
    };
    this.animation = null;
};
initialize(canvas, board) {
    var self = this;
    var player = {};

    canvas.ctx.fillStyle = this.info.color;
    // ctx.strokeStyle = this.strokeColor;

    player = {
        x: this.info.startingPosition.x * this.info.size,
        y: this.info.startingPosition.y * this.info.size
    };
    this.body.push(player);

    canvas.ctx.fillRect(player.x, player.y, this.info.size, this.info.size);
    canvas.ctx.strokeRect(player.x, player.y, this.info.size, this.info.size);

    board.map[this.info.startingPosition.x][this.info.startingPosition.y] = true;

    var blockMovement = false;
};

move(canvas, board) {
    var lastHead = this.body[this.body.length - 1];
    var newHead = {
        x: lastHead.x + this.directions[this.info.currentDirection].x * this.info.size,
        y: lastHead.y + this.directions[this.info.currentDirection].y * this.info.size
    };

    var hasSnakeHitYWall = newHead.y < 0 || newHead.y > canvas.height - this.info.size;
    var hasSnakeHitXWall = newHead.x < 0 || newHead.x > canvas.width - this.info.size;

    // Check if the new head is on an obsticle - GAME OVER
    if (hasSnakeHitXWall || hasSnakeHitYWall || board.map[newHead.x / this.info.size][newHead.y / this.info.size]) {
        // alert(this.info.color + ' player lose!');

        return true;
    }

    // Add the new head
    canvas.ctx.fillStyle = this.info.color;
    // ctx.strokeStyle = this.strokeColor;

    canvas.ctx.fillRect(newHead.x, newHead.y, this.info.size, this.info.size);
    canvas.ctx.strokeRect(newHead.x, newHead.y, this.info.size, this.info.size);

    this.body.push(newHead);
    board.map[newHead.x / this.info.size][newHead.y / this.info.size] = true;

    return false;
};
}