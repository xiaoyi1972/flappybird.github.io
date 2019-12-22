/*
*    Item Class
*    Basic tiem class which is the basic elements in the game world
*@param draw, the context draw function
*@param ctx, context of the canvas
*@param x, posisiton x
*@param y, posisiton y
*@param w, width
*@param h, height
*@param g, gravity of this item
*/
var Item = function(draw, ctx, x, y, w, h, g){
    this.ctx = ctx;
    this.gravity = g || 0;
    this.pos = {    x: x || 0,
                y: y || 0
            };
    this.speed = {    x: 0,        // moving speed of the item
                y: 0
                    }
    this.width = w;
    this.height = h;
    this.draw = typeof draw == 'function' ? draw : function(){};
    return this;
};

Item.prototype = {
    // set up the 'draw' function
    setDraw : function(callback) {
        this.draw = typeof draw == 'function' ? draw : function(){};
    },

    // set up the position
    setPos : function(x, y) {
        // Handle: setPos({x: x, y: y});
        if(typeof x == 'object') {
            this.pos.x = typeof x.x == 'number' ? x.x : this.pos.x;
            this.pos.y = typeof x.y == 'number' ? x.y : this.pos.y;
        // Handle: setPos(x, y);
        } else {
            this.pos.x = typeof x == 'number' ? x : this.pos.x;
            this.pos.y = typeof y == 'number' ? y : this.pos.y;
        }
    },

    // set up the speed
    setSpeed : function(x, y) {
        this.speed.x = typeof x == 'number' ? x : this.speed.x;
        this.speed.y = typeof y == 'number' ? y : this.speed.y;
    },

    // set the size
    setSize : function(w, h) {
        this.width = typeof width == 'number' ? width : this.width;
        this.height = typeof height == 'number' ? height : this.height;
    },

    // update function which ran by the animation loop
    update : function() {
        this.setSpeed(null, this.speed.y + this.gravity);
        this.setPos(this.pos.x + this.speed.x, this.pos.y + this.speed.y);
        this.draw(this.ctx);
    },

    // generate the pixel map for 'pixel collision dectection'
    generateRenderMap : function( image, resolution ) {
        var pixelMap = [];

    // scan the image data
    for( var y = 0; y < image.height; y=y+resolution ) {
        for( var x = 0; x < image.width; x=x+resolution ) {
            // Fetch cluster of pixels at current position
            // Check the alpha value is above zero on the cluster
            if( image.data[4 * (48 * y + x) + 3] != 0 ) {
                pixelMap.push( { x:x, y:y } );
            }
        }
    }
    return {
        data: pixelMap,
        resolution: resolution
    };
    }
}