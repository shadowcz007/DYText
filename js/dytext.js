/*

欢迎访问微信公众号 Design-AI-Lab 

*/


Array.prototype.sum = function () {
    return this.reduce(function (partial, value) {
        return partial + value;
    })
};


function DYText(opts) {

    var _opts = opts || {};

    this.word = _opts.word || "Hello World";


    this.fontSize = _opts.fontSize + 'px' || '120px';
    this.height = (_opts.fontSize || 120) * 1.5;
    this.fontFamily = _opts.fontFamily || 'zcool-gdh';
    this.font = "italic small-caps 900 " + this.fontSize + " " + this.fontFamily;
    this.offset = (this.height * _opts.offset) || this.height * 0.015;

    this.x = _opts.x || 0;
    this.y = _opts.y || 0;

    this.divideNum = _opts.divideNum || 6;
    this.seed = _opts.seed || 0.51;

    this.offsetLeft = true;


    this.colorLeft = _opts.colorLeft || "yellow";
    this.colorRight = _opts.colorRight || "red";
    this.color = _opts.color || "black";
    this.colorBg = _opts.colorBg || 'black';

    this.fullscreen = true;

    this.dev = !!_opts.dev;

    this.gifLength = _opts.gifLength || 10;


    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    this.ctx = ctx;

};

DYText.prototype.setFontSize = function (_num) {
    this.fontSize = _num + 'px' || '120px';
    this.height = (_num || 120) * 1.5;
    this.font = "italic small-caps 900 " + this.fontSize + " " + this.fontFamily;
    this.offset = this.height * 0.015;
};




DYText.prototype.random = function (min, max) {
    var num = Math.random() * (max - min) + min;
    return num
};

DYText.prototype.sin = function (len) {
    console.log(len);
    var res = [];
    for (var i = 0; i < len; i++) {
        var num = parseFloat(Math.abs(Math.sin(this.random(0, 6))).toString().slice(0, 4)) * 100;
        res.push(num);
    };

    var sum = res.sum();

    for (var i = 0; i < res.length; i++) {
        res[i] = res[i] / sum;
        // console.log(res[i],"ijujujuj")
    };


    return res;
};


DYText.prototype.generate = function () {

    var res = [];

    var x = this.x,
        y = this.y,
        width = this.width,
        height = this.height,
        seed = this.seed;

    //console.log(height,'!!')




    var i = this.divideNum;

    var height_seeds = this.sin(i);

    // console.log(x,y,width,height,height_seeds)

    for (let index = 0; index < i; index++) {

        this.offsetLeft = !this.offsetLeft;

        // console.log(height*height_seeds[index],'!!!')

        var _yn = (index == 0 ? 0 : (res[index - 1].get.height + res[index - 1].get.y)),
            _h = height * height_seeds[index];

        if (_h <= 2) {
            _h = 2;
        };

        var get = {
                x: x,
                y: _yn,
                width: width,
                height: _h
            },
            put = {
                x: x + index * (this.offsetLeft ? -1 : 1) * seed,
                y: _yn
            },
            obj = {
                get: get,
                put: put
            };

        res.push(obj);


    };

    this.divides = res;
};

DYText.prototype.start = function () {

    if (this._status = 'READY') {
        this.update();
    } else {
        this.init();
        this.draw();
        this.drawBg();
        this.generate();
        this.copy();
        this._status = 'READY';
    };

};


DYText.prototype.update = function (seed) {

    this.seed = seed || this.seed;

    if (this._status = 'READY') {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.init();
        this.draw();
        this.drawBg();
        this.generate();
        this.copy();
    } else {
        this.start();
    };


};

DYText.prototype.init = function () {
    var canvas = this.ctx.canvas,
        ctx = this.ctx;

    ctx.textBaseline = "top";
    ctx.font = this.font;

    var word = this.word,
        offset = this.offset;

    this.width = ctx.measureText(word).width + this.offset * 2;

    canvas.width = this.width + 100;
    this.x = 50;


    canvas.height = this.height;

    //  this.ctx.fillStyle=this.colorBg;
    // this.ctx.fillRect(0,0,canvas.width,canvas.height);
};

DYText.prototype.drawBg = function () {
    var canvasBg = document.createElement('canvas'),
        ctxBg = canvasBg.getContext('2d');

    canvasBg.width = this.ctx.canvas.width;
    canvasBg.height = this.ctx.canvas.height;


  //  ctxBg.fillStyle = this.colorBg;
   // ctxBg.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    var word = this.word,
        offset = this.offset,
        x = this.x,
        y = this.y;

    var ctx = this.ctx;

    ctxBg.textBaseline = "top";
    ctxBg.font = this.font;

    ctxBg.fillStyle = this.color;
    ctxBg.fillText(word, x + offset, y + offset);

    ctxBg.drawImage(ctx.canvas, 0, 0);

    ctx.drawImage(canvasBg, 0, 0);
};

DYText.prototype.draw = function () {
    var word = this.word,
        offset = this.offset,
        x = this.x,
        y = this.y;

    var ctx = this.ctx;

    ctx.textBaseline = "top";
    ctx.font = this.font;

    ctx.fillStyle = this.colorLeft;
    ctx.fillText(word, x - offset, y - offset);

    // ctx.fillStyle=this.color;
    //ctx.fillText(word,x,y);

    ctx.globalCompositeOperation = "xor";
    ctx.fillStyle = this.colorRight;
    ctx.fillText(word, x + offset, y + offset);

    /* ctx.globalCompositeOperation="xor";
     ctx.fillStyle=this.color;
     ctx.fillText(word,x,y);
     */
    ctx.globalCompositeOperation = "source-over";

};

DYText.prototype.copy = function () {

    var divides = this.divides;
    var ctx = this.ctx;

    // console.log(divides)

    ctx.globalCompositeOperation = "source-over";

    for (let index = 0; index < divides.length; index++) {
        var d = divides[index];

        var imgData = ctx.getImageData(d.get.x, d.get.y, d.get.width, d.get.height);

        ctx.putImageData(imgData, d.put.x, d.put.y);

        if (this.dev) {

            ctx.strokeStyle = "red";
            ctx.strokeRect(d.get.x, d.get.y, d.get.width, d.get.height);
        }
    };




};


DYText.prototype.toCanvas = function (targetCtx) {

    var ctx = this.ctx;
    targetCtx.canvas.width = 480;
    targetCtx.canvas.height = 280;

    var tw = ctx.canvas.width,
        th = ctx.canvas.height;

    targetCtx.fillStyle = Math.random()>=0.5?this.colorBg:'black';
    targetCtx.fillRect(0, 0, 480, 280);

    var w=440,h=w*th/tw,l=240 - w / 2,t=140 - h / 2;

    targetCtx.drawImage(ctx.canvas, l, t, w,h);
};



DYText.prototype.createFrames = function (num) {
    var frames = [],
        num = num || this.gifLength;

    for (let index = 0; index < num; index++) {
        this.update();

        var canvas1 = document.createElement('canvas'),
            ctx1 = canvas1.getContext('2d');

        //  canvas1.width = window.innerWidth;
        // canvas1.height = window.innerHeight;

        this.toCanvas(ctx1);

        frames.push(canvas1);

    };

    this.frames = frames;

    return frames;
};

DYText.prototype.createGif = function (cb) {

    var gif = new GIF({
        workers: 20,
        quality: 10,
        workerScript: './js/gif.worker.js'
    });


    var frames = this.createFrames();

    for (let index = 0; index < frames.length; index++) {

        gif.addFrame(frames[index], {
            delay: 200
        })

    };


    gif.on('finished', function (blob) {

        // cb(URL.createObjectURL(blob));
        //blob 2 base64
        var blobToBase64 = function (blob, callback) {
            var a = new FileReader();
            a.onload = function (e) {
                callback(e.target.result);
            }
            a.readAsDataURL(blob);
        };

        blobToBase64(blob, function (data) {
            cb(data);
        });
    });

    gif.render();
};