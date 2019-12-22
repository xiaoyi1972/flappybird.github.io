/*
*    for deriving a new Class
*    Child will copy the whole prototype the Parent has
*/
function extend(Child, Parent) {
    var F = function () { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
}

var World = {
    theCanvas: null, // 保存Canvas
    pause: false, // 游戏是否暂停
    init: function () { },// 初始化并运行游戏
    reset: function () {
        this.bird.reset();
        this.score.reset();
        this.items = [];
    },// 重置游戏
    animationLoop: function () {
        // scroll the background
        this.backgroundUpdate();

        // detect elements which is out of boundary
        this.boundDectect();
        // detect the collision between bird and pipes
        this.collisionDectect();
        // update the elements
        this.elementsUpdate();
        this.bird.update();
        this.score.update();
        // next frame
        if (!this.pause) {
            requestAnimationFrame(function () {
                World.animationLoop();
            })
        }
    },// 动画循环
    BGOffset: 0,    // scroll offset
    backgroundUpdate: function () {
        var ctx = this.ctx;
        this.BGOffset--;
        if (this.BGOffset <= 0) {
            this.BGOffset = 288;
        }
        ctx.drawImage(image, 0, 0, 288, 512, this.BGOffset, 0, 288, 512);
        ctx.drawImage(image, 0, 0, 288, 512, this.BGOffset - 288, 0, 288, 512);
    },// 绘制背景
    elementsUpdate: function () {
        var i;
        for (i in this.items) {
            this.items[i].update();
        }
    }, // 更新元素
    collisionDectect: function () {
        for (var i in this.items) {
            var pipe = this.items[i];
            if (this.hitBox(this.bird, pipe) && this.pixelHitTest(this.bird, pipe)) {//&& this.pixelHitTest(this.bird, pipe)
                this.reset();
                break;
            }
        }
    }, // 碰撞检测
    hitBox: function (source, target) {
        return !(
            ((source.pos.y + source.height) < (target.pos.y)) ||
            (source.pos.y > (target.pos.y + target.height)) ||
            ((source.pos.x + source.width) < target.pos.x) ||
            (source.pos.x > (target.pos.x + target.width))
        );
    },
    pixelHitTest: function (source, target) {
        // Loop through all the pixels in the source image
        for (var s = 0; s < source.pixelMap.data.length; s++) {
            var sourcePixel = source.pixelMap.data[s];

            // Add positioning offset
            var sourceArea = {
                pos: {
                    x: sourcePixel.x + source.pos.x,
                    y: sourcePixel.y + source.pos.y,
                },
                width: target.pixelMap.resolution,
                height: target.pixelMap.resolution
            };

            // Loop through all the pixels in the target image
            for (var t = 0; t < target.pixelMap.data.length; t++) {
                var targetPixel = target.pixelMap.data[t];
                // Add positioning offset
                var targetArea = {
                    pos: {
                        x: targetPixel.x + target.pos.x,
                        y: targetPixel.y + target.pos.y,
                    },
                    width: target.pixelMap.resolution,
                    height: target.pixelMap.resolution
                };
                /* Use the earlier aforementioned hitbox function */
                if (this.hitBox(sourceArea, targetArea)) {
                    return true;
                }
            }
        }
    },
    boundDectect: function () {
        // the bird is out of bounds
        if (this.isBirdOutOfBound()) {
            this.reset();
            this.items = [];
        } else {
            this.pipesClear();
        }
    },// 边界检测
    pipesCreate: function () {
        var type = Math.floor(Math.random() * 3);
        type = 2;
        var that = this;
        // type = 0;
        switch (type) {

            // one pipe on the top
            case 0: {
                var height = 125 + Math.floor(Math.random() * 100);
                that.items.push(new Pipe(that.ctx, 300, 0, 52, height, -1, 0));                        // face down
                break;
            }
            // one pipe on the bottom
            case 1: {
                var height = 125 + Math.floor(Math.random() * 100);
                that.items.push(new Pipe(that.ctx, 300, that.height - height, 52, height, -1, 1));        // face up
                break;
            }
            // one on the top and one on the bottom
            case 2: {
                var height = 125 + Math.floor(Math.random() * 100);
                that.items.push(new Pipe(that.ctx, 300, that.height - height, 52, height, -1, 1));    // face up
                that.items.push(new Pipe(that.ctx, 300, 0, 52, that.height - height - 100, -1, 0));    // face down
                break;
            }
        }

    },// 创建烟囱
    pipesClear: function () {
        var it = this.items;
        var i = it.length - 1;

        for (; i >= 0; --i) {
            if (i % 2 && it[i].pos.x == this.bird.pos.x) this.score.value++;
            if (it[i].pos.x + it[i].width < 0) {
                it = it.splice(i, 1);
            }
        }
    },// 清除烟囱
    isBirdOutOfBound: function (callback) {
        if (this.bird.pos.y - this.bird.height - 5 > this.height) {    // the bird reach the bottom of the world
            return true;
        }
        return false;
    },// 小鸟出界检测
};

World.init = function () {
    var theCanvas = this.theCanvas = document.getElementById('game_box');
    this.ctx = theCanvas.getContext('2d');
    this.width = theCanvas.width;
    this.height = theCanvas.height;
    this.bird = new Bird(this.ctx, this.width / 10, this.height / 2, 0.15);
    this.score = new Score(this.ctx);
    this.items = [];
    (function (that) {
        setInterval(function () {
            that.pipesCreate();
        }, 2000)
    })(this);
    this.animationLoop();
}

window.onload = function () {
    console.log('start');
    World.init();
}

var atlas = {};
atlas.bird = [
    { sx: 0, sy: 970, sw: 48, sh: 48 },
    { sx: 56, sy: 970, sw: 48, sh: 48 },
    { sx: 112, sy: 970, sw: 48, sh: 48 },
]
atlas.pipes = [
    { sx: 112, sy: 646, sw: 52, sh: 320 },    // face down
    { sx: 168, sy: 646, sw: 52, sh: 320 }    // face up
]

atlas.pipes = [
    { sx: 112, sy: 646, sw: 52, sh: 320 },    // face down
    { sx: 168, sy: 646, sw: 52, sh: 320 }    // face up
]

atlas.number = [
    { sx: 992, sy: 116, sw: 24, sh: 44 },    // 0
    { sx: 268, sy: 906, sw: 24, sh: 44 },    // 1
    { sx: 584, sy: 316, sw: 24, sh: 44 },    // 2
    { sx: 612, sy: 316, sw: 24, sh: 44 },    // 3
    { sx: 640, sy: 316, sw: 24, sh: 44 },    // 4
    { sx: 668, sy: 316, sw: 24, sh: 44 },  // 5
    { sx: 584, sy: 364, sw: 24, sh: 44 },    // 6
    { sx: 612, sy: 364, sw: 24, sh: 44 },    // 7
    { sx: 640, sy: 364, sw: 24, sh: 44 },    // 8
    { sx: 640, sy: 364, sw: 24, sh: 44 },    // 9
]

document.onmousedown = function (e) {
    var btnNum = e.button;
    if (btnNum == 0) {
        World.bird.fly();
    }
}
