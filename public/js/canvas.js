class Canvas {
    constructor(id, context) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext(context);
    };
    setDimensions(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    };
}