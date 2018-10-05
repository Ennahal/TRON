(function(){
    // canvas variables
    var canvasId = 'tron-canvas';
    var canvasContext = '2d';
    var canvasWidth = 500;
    var canvasHeight = 500;

    // board variable
    var boardColor = '#000';
    var squareSize = 10;
    var lineWidth = '0.5';

    // red player variables
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
    };

    /**
     * A variable to block multiple keydown events in a single animation frame.
     * @var {boolean} blockMovement
     */
    var blockMovement = false;

    var isGameOver = false;

    var canvas = new Canvas(canvasId, canvasContext);
    canvas.setDimensions(canvasWidth, canvasHeight);

    var board = new Board(squareSize);
    board.initialize(canvas.ctx, lineWidth, boardColor, canvasWidth, canvasHeight);

    var redPlayer = new Player(redPlayerInfo);
    redPlayer.initialize(canvas, board);

    var bluePlayer = new Player(bluePlayerInfo);
    bluePlayer.initialize(canvas, board);

    window.addEventListener('keydown', function(e) {
        if (!blockMovement) {
            blockMovement = keyDownEventHandler(e, redPlayer);
        }
    }, true);

    window.addEventListener('keydown', function(e) {
        if (!blockMovement) {
            blockMovement = keyDownEventHandler(e, bluePlayer);
        }
    }, true);

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
})();

/*
 *   @function keyDownEventHandler
 *
 *   @param {Object} e - Event arguments.
 *   @param {Object} snake - Snake object reference.
 *
 *   @returns {boolean}
 */
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

/*
 *   @function createMultidimensionalArray
 *
 *   @param {array[]} dimensions - How many dimensions will be the multidimensional array.
 *   @param value - What should be the default value of the last array elements.
 *
 *   @returns {array[]} array
 */
function createMultidimensionalArray(dimensions, value) {
    // Create new array
    var array = new Array(dimensions[0] || 0);
    var i = dimensions[0];

    // If dimensions array's length is bigger than 1
    // we start creating arrays in the array elements with recursions
    // to achieve multidimensional array
    if (dimensions.length > 1) {
        // Remove the first value from the array
        var args = Array.prototype.slice.call(dimensions, 1);
        // For each index in the created array create a new array with recursion
        while(i--) {
            array[dimensions[0]-1 - i] = createMultidimensionalArray(args, value);
        }
        // If there is only one element left in the dimensions array
        // assign value to each of the new array's elements if value is set as param
    } else {
        if (typeof value !== 'undefined') {
            while(i--) {
                array[dimensions[0]-1 - i] = value;
            }
        }
    }

    return array;
}