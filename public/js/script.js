(function(){
    /*document.querySelector('.structure_lobby').style.display = 'none';
    document.querySelector('.structure_register_absolute').style.display = 'none';
    document.querySelector('.structure_game').style.display = 'flex';*/

    var canvas = document.getElementById('tron-canvas');
    var ctx = canvas.getContext('2d');
    // canvas variables
    canvas.width = 1000;
    canvas.height = 1000;

    // board variable
    var boardColor = '#000';
    var squareSize = 10;
    var lineWidth = 1;
    /*
        map[80][60] => colorier des cases
    */
    var map = [];
    let x = 0;
    while (x < 80)
    {
        map[x] = [];
        let y = 0;
        while (y < 60)
        {
            // map[x][y] = 'rgb('+parseInt(Math.random() * 255)+', '+parseInt(Math.random() * 255)+', '+parseInt(Math.random() * 255)+')';
            map[x][y] = '';
            y++;
        }
        x++;
    }
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, 810, 610);
    function drawdiff(diff)
    {
        let i = 0;
        while (i < diff.length)
        {
            if (diff[i])
            {
                let x = diff[i].x;
                let y = diff[i].y;
                let color = diff[i].color;
                ctx.fillStyle = color;
                ctx.fillRect(x * 10 + 5, y * 10 + 5, 10, 10);
                map[x][y] = color;
            }
            i++;
        }
    }
    function draw(map)
    {
        ctx.clearRect(0, 0, 810, 610);
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, 810, 610);
        let x = 0;
        while (x < map.length)
        {
            let y = 0;
            while (y < map[x].length)
            {
                if (map[x][y])
                    ctx.fillStyle = map[x][y];
                else
                    ctx.fillStyle = "#FFF";
                //ctx.lineWidth = lineWidth;
                ctx.fillRect(x * 10 + 5, y * 10 + 5, 10, 10);
                y++;
            }
            x++;

        }
    }
    draw(map);
    const keyMap = {
        38:"move_up",
        90:"move_up",
        40:"move_down",
        83:"move_down",
        37:"move_left",
        81:"move_left",
        39:"move_right",
        68:"move_right",
        32:"use_powerup"
    };
    window.addEventListener('keydown', function(e)
    {
        if (keyMap[e.keyCode] !== undefined)
            socket.emit(keyMap[e.keyCode]);
    });
    socket.on("game_start", (color, map) =>
    {
        draw(map);
        document.querySelector('div.container_users').style.background = color;
    });
    socket.on("game_diff", (diff) =>
    {
        drawdiff(diff);
    });
    // Quand vous envoyez move_up au serveur, il renvoie move_up a tous les joueurs
    // red player variables
    /*
    var redPlayerInfo = {
        color: '#ff0000',
        size: 10,
        speed: 100,
        currentDirection: 'right',
        startingPosition: {
            x: 9,
            y: 24
        },
        controls: {
            up: 87,
            down: 83,
            left: 65,
            right: 68
        }
    };

    // blue player variables
    var bluePlayerInfo = {
        color: '#0000ff',
        size: 10,
        speed: 100,
        currentDirection: 'left',
        startingPosition: {
            x: 39,
            y: 24
        },
        controls: {
            up: 38,
            down: 40,
            left: 37,
            right: 39
        }
    };*/
/*
    window.addEventListener('keydown', function(e) {
        if (!blockMovement) {
            blockMovement = keyDownEventHandler(e, bluePlayer);
        }
    }, true);*/
})();
/*
    redPlayer.animation = setInterval(function() {
        isGameOver = redPlayer.move(canvas, board);
        blockMovement = false;
        if (isGameOver) {
            clearInterval(redPlayer.animation);
            clearInterval(bluePlayer.animation);
        }
    }, redPlayer.info.speed);

    bluePlayer.animation = setInterval(function() {
        isGameOver = bluePlayer.move(canvas, board);
        blockMovement = false;
        if (isGameOver) {
            clearInterval(redPlayer.animation);
            clearInterval(bluePlayer.animation);
        }
    }, bluePlayer.info.speed);
})();*/

/*
 *   @function keyDownEventHandler
 *
 *   @param {Object} e - Event arguments.
 *   @param {Object} snake - Snake object reference.
 *
 *   @returns {boolean}
 */
 /*
function keyDownEventHandler(e, player) {
    console.log(e.keyCode);
    var direction = player.info.currentDirection;

    // Checks the direction the user chooses and compares with the snake's
    // current direction. If the direction is different than the same or 
    // an opposite direction - the direction changes
    switch(e.keyCode) {
        // Up arrow
        case player.info.controls.up:
            if (direction !== 'down' && direction !== 'up') {
                player.info.currentDirection = 'up';

                return true;
            }
            break;
        // Right arrow
        case player.info.controls.right:
            if (direction !== 'left' && direction !== 'right') {
                player.info.currentDirection = 'right';

                return true;
            }
            break;
        // Down arrow
        case player.info.controls.down:
            if (direction !== 'up' && direction !== 'down') {
                player.info.currentDirection = 'down';

                return true;
            }
            break;
        // Left arrow
        case player.info.controls.left:
            if (direction !== 'right' && direction !== 'left') {
                player.info.currentDirection = 'left';

                return true;
            }
            break;
        default:
            break;
    }
}
*/
/*
 *   @function createMultidimensionalArray
 *
 *   @param {array[]} dimensions - How many dimensions will be the multidimensional array.
 *   @param value - What should be the default value of the last array elements.
 *
 *   @returns {array[]} array
 */
