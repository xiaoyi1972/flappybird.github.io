/*
*                        Score Class
*
*    a sub-class of show the score
*@param ctx, context of the canvas
*@param x, posisiton x
*@param y, posisiton y
*@param w, width
*@param h, height
*@param spx, moving speed from left to right
*@param type, 0-9
*/
var Score = function (ctx, x, y, w, h, spx, type, val) {
    this.ctx = ctx;
    this.type = type || 0;
    this.gravity = 0;                    // the score is not moving down
    this.width = w;
    this.height = h;
    this.value = 0;
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
        var str = this.value.toString();
        var pos = { x: 235, y: 13 };
        for (var i = 0; i < str.length; i++) {
            var ss = str.substring(i, (i + 1));
            var type = parseInt(ss);
            var x = pos.x - (str.length - i) * 28;
            var y = pos.y;
            //console.log(atlas.number[type].sx);
            ctx.drawImage(image, atlas.number[type].sx, atlas.number[type].sy, 24, 44,
                x, y, 24, 48);
        }

        return this;
    }
}


// derived from the Item class
extend(Score, Item);

Score.prototype.reset = function () {
    this.value = 0;
};