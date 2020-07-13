this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Planks
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function Planks(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Planks.defaultOpts = {
        backgroundColor: "#000000",
        //'fillColor: ["#ffffff", "#62B9FD", "#536AA3", "#000000"]
        fillColor: ["#ffffff", "#ffd624", "#f16f63", "#d4338e", "#8d0da6", "#451a88", "#2c1876", "#000000"]
    }




    var p = Planks.prototype;

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
        var unitSize = Math.ceil(HEIGHT / bufferLength);
        var totalUnits = HEIGHT / unitSize;

        var samplesPerUnit = bufferLength / totalUnits;

        var specSize = 1; //unitSize;

        if (!this._rangeBuilt) {
            this.fillColor = this.controller.tweenGradient(this.fillColor, 100);
            this._rangeBuilt = true;
        }
        var fillColor = this.fillColor; // localize
        var fillColorRange = fillColor.length - 1;

        var x = 0;
        var y = HEIGHT;
        var firstY = HALF_HEIGHT;
        var startPos = WIDTH - specSize;
        var avgData = 0;
        for (var i = 0; i < bufferLength; i++) {

            var val = data[i];
            avgData += val;
            var colorIdx = Math.round(fillColorRange - fillColorRange * val);
            var color = fillColor[colorIdx];
            ctx.fillStyle = color;
            ctx.fillRect(startPos, y, specSize, unitSize);
            y -= unitSize;

        };

        avgData = avgData / bufferLength;


        ctx.drawImage(
            this.canvas,
            0, // s-x
            0, // s-y
            WIDTH, // s-width
            HEIGHT, // s-height
            -specSize, // d-x
            0, // d-y
            WIDTH, // d-width
            HEIGHT // d-height
        );


        ctx.globalCompositeOperation = 'lighten';
        ctx.globalAlpha = 0.2;

        var bob = 1;
        var dX1 = 0;
        var dX2 = 0;
        var dY1 = 0;
        var dY2 = 0;

        var dW1 = WIDTH + bob;
        var dW2 = WIDTH + bob;
        var dH1 = HEIGHT + bob;
        var dH2 = HEIGHT + bob;

        var sX1 = 0;
        var sX2 = 0;
        var sY1 = 0;
        var sY2 = 0;

        var sW1 = WIDTH - 1;
        var sW2 = WIDTH - 1;
        var sH1 = HEIGHT;
        var sH2 = HEIGHT;

        for (var i = 1; i <= 8; i++) {
            ctx.drawImage(canvas, dX1, dY1, dW1, dH1, sX1, sY1, sW1, sH1);
            ctx.drawImage(canvas, dX2, dY2, dW2, dH2, sX2, sY2, sW2, sH2);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

    }


    p.reset = function() {
        var ctx = this.canvasCtx;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Planks = Planks;

}());
