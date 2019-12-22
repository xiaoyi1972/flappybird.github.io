/*
*                        Pipe Class
*
*    a sub-class of Item, which can generate a 'bird' in the world
*@param ctx, context of the canvas
*@param x, posisiton x
*@param y, posisiton y
*@param w, width
*@param h, height
*@param spx, moving speed from left to right
*@param type, choose to face down(0) or face up(1)
*/
var Pipe = function (ctx, x, y, w, h, spx, type) {
    this.ctx = ctx;
    this.type = type || 0;
    this.gravity = 0;                    // the pipe is not moving down
    this.width = w;
    this.height = h;
    this.pos = {
        x: x || 0,
        y: y || 0
    };
    this.speed = {
        x: spx || 0,
        y: 0
    }

    this.pixelMap = null;                // pixel map for 'pixel collistion detection'

    this.draw = function drawPoint(ctx) {
        var pipes = atlas.pipes;
        if (this.type == 0) {            // a pipe which faces down, that means it should be on the top
            ctx.drawImage(image, pipes[0].sx, pipes[0].sy + pipes[0].sh - this.height, 52, this.height, this.pos.x, 0, 52, this.height);
        } else {                        // a pipe which faces up, that means it should be on the bottom
            ctx.drawImage(image, pipes[1].sx, pipes[1].sy, 52, this.height, this.pos.x, this.pos.y, 52, this.height);
        }

        if (this.pixelMap == null) {        // just create the pixel map from a temporary canvas
            var tempCanvas = document.createElement('canvas');
            var tempContext = tempCanvas.getContext('2d');
            if (this.type == 0) {
                tempContext.drawImage(image, 112, 966 - this.height, 52, this.height, 0, 0, 52, this.height);
            } else {                    // face up
                tempContext.drawImage(image, 168, 646, 52, this.height, 0, 0, 52, this.height);
            }
            var imgdata = tempContext.getImageData(0, 0, 52, this.height);
            this.pixelMap = this.generateRenderMap(imgdata, 4);
        }
        return this;
    }
}

// derived from the Item class
extend(Pipe, Item);