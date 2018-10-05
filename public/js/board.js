class Board {
    constructor(squareSide) {
        this.squareSide = squareSide;
    };


    initialize(ctx, lineWidth, fillColor, width, height) {
        this.color = fillColor;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = this.color;

        ctx.fillRect(0, 0, width, height);

        this.size = {
            x: width / this.squareSide,
            y: height / this.squareSide
        };

        this.map = createMultidimensionalArray([this.size.x, this.size.y], false);
    };
}
