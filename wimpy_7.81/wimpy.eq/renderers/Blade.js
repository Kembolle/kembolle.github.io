this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Blade
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function Blade(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Blade.defaultOpts = {
        backgroundColor: "#000000",
        //'fillColor: ["#ffffff", "#62B9FD", "#536AA3", "#000000"]
        fillColor: ["#ffffff", "#ffd624", "#f16f63", "#d4338e", "#8d0da6", "#451a88", "#2c1876", "#000000"]
    }




    var p = Blade.prototype;

    p.controller = null;
    p.width = null;
    p.height = null;
    p.canvas = null;
    p.canvasCtx = null;

    p.backgroundColor = null;
    p.lineColor = null;
    p.lineWidth = null;


    /**
     * Called by the controller to render the animation. Called on each tick.
     *
     * @method loop
     * @param  {array} data - An array of frequency data normalized to values between 0 and 1. If the user defined a "scale" configuration property, the value may be larger than 1.
     */

    p.loop = function(data) {
        var ctx = this.canvasCtx;
        var canvas = this.canvas;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var HALF_HEIGHT = HEIGHT / 2;

        var bufferLength = data.length;

        // 
        var scrollVert = true; // false  true
        var scrollReverse = false;

        var unitSize = Math.ceil(WIDTH / bufferLength);
        var totalUnits = WIDTH / unitSize;


        ctx.globalAlpha = 0.002 * (1 - this._avgData); // highr = faster
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        //ctx.globalAlpha = 1;
        ctx.globalAlpha = 0.8; // highr = faster



        var bob = 3 / this._avgData;

        var dX1 = bob;
        var dY1 = 0;
        var dW1 = WIDTH - bob;
        var dH1 = HEIGHT;

        var dX2 = 0;
        var dY2 = bob;
        var dW2 = WIDTH;
        var dH2 = HEIGHT - bob;

        var sX1 = bob;
        var sY1 = bob;
        var sW1 = WIDTH - bob;
        var sH1 = HEIGHT;

        var sX2 = bob / 2;
        var sY2 = -bob;
        var sW2 = WIDTH;
        var sH2 = HEIGHT - bob;

        for (var i = 1; i <= 2; i++) {

            ctx.drawImage(canvas, dX1, dY1 * (i % 2 ? -1 : 1), dW1, dH1, sX1, sY1, sW1, sH1);
            ctx.drawImage(canvas, dX2, dY2 * (i % 2 ? -1 : 1), dW2, dH2, sX2, sY2, sW2, sH2);

        }

        ctx.globalAlpha = 1;
        var specSize = 4; //unitSize;

		if( ! this._rangeBuilt ){
        	this.fillColor = this.controller.tweenGradient(this.fillColor, 100);
        	this._rangeBuilt = true;
		}
        var fillColor = this.fillColor; // localize
        var fillColorRange = fillColor.length - 1;

        var x = 0;
        var y = HEIGHT;
        var firstY = HALF_HEIGHT;
        var startPos;
        if (scrollReverse) {
            startPos = 0;
        } else {
            if (scrollVert) {
                startPos = HALF_HEIGHT; // HEIGHT - specSize; //
            } else {
                startPos = WIDTH - specSize;
            }
        }

        var avgData = 0;
        for (var i = 0; i < bufferLength; i++) {

            var val = data[i];
            avgData += val;
            var colorIdx = Math.round(fillColorRange - fillColorRange * val);
            var color = fillColor[colorIdx];
            ctx.fillStyle = color;
            ctx.fillRect(x, startPos, unitSize, specSize * (val / 1));
            x += unitSize;



        };

        avgData = avgData / bufferLength;
        this._avgData = avgData;

    }


    p.reset = function() {
        var ctx = this.canvasCtx;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Blade = Blade;

}());
