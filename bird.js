/*
*                                Bird Class
*
*    a sub-class of Item, which can generate a 'bird' in the world
*@param ctx, context of the canvas
*@param x, posisiton x
*@param y, posisiton y
*@param g, gravity of this item
*/
var Bird = function (ctx, x, y, g) {
    this.ctx = ctx;
    this.gravity = g || 0;
    this.pos = {
        x: x || 0,
        y: y || 0
    };
    this.depos = {
        x: x || 0,        // default position for reset
        y: y || 0
    };
    this.speed = {
        x: 0,
        y: 0
    }
    this.width = atlas.bird[0].sw || 0;
    this.height = atlas.bird[0].sh || 0;

    this.pixelMap = null;            // pixel map for 'pixel collistion detection'
    this.type = 1;                    // image type, 0: falling down, 1: sliding, 2: raising up
    this.rdeg = 0;                    // rotate angle, changed along with speed.y

    this.draw = function drawPoint() {
        var ctx = this.ctx;

        ctx.save();                                    // save the current ctx
        ctx.translate(this.pos.x, this.pos.y);        // move the context origin 
        ctx.rotate(this.rdeg * Math.PI / 180);            // rotate the image according to the rdeg
        ctx.drawImage(image, atlas.bird[this.type].sx, atlas.bird[this.type].sy, this.width, this.height,
            0, 0, this.width, this.height);                                                    // draw the image
        ctx.restore();                                // restore the ctx after rotation

    
        // the access the image data using a temporaty canvas
        if (this.pixelMap == null) {
            var tempCanvas = document.createElement('canvas');        // create a temporary canvas
            var tempContext = tempCanvas.getContext('2d');
            tempContext.drawImage(image, atlas.bird[this.type].sx, atlas.bird[this.type].sy, this.width, this.height,
                0, 0, this.width, this.height);    // put the image on the temporary canvas
            var imgdata = tempContext.getImageData(0, 0, this.width, this.height); // fetch the image from the temporary canvas
            this.pixelMap = this.generateRenderMap(imgdata, 4);        // using the resolution the reduce the calculation
        }                                               // draw the image*/
    };
    return this;
}

// derive fromt the Item class
extend(Bird, Item);

// fly action
Bird.prototype.fly = function () {
    this.setSpeed(0, -4);
};

// reset the position and speed 
Bird.prototype.reset = function () {
    this.setPos(this.depos);
    this.setSpeed(0, 0);
};

// update the bird state and image
Bird.prototype.update = function () {
   this.setSpeed(null, this.speed.y + this.gravity);
    //this.setSpeed(null, this.speed.y);
    if (this.speed.y < -2) {            // raising up
        if (this.rdeg > -10) {
            this.rdeg--;            // bird's face pointing up
        }
        this.type = 2;
    } else if (this.speed.y > 2) {    // fall down
        if (this.rdeg < 10) {
            this.rdeg++;            // bird's face pointing down
        }
        this.type = 0;
    } else {
        this.type = 1;
    }
    this.setPos(this.pos.x + this.speed.x, this.pos.y + this.speed.y);    // update position
    this.draw();
}