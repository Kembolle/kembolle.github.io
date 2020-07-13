this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Wispy
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function Wispy(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Wispy.defaultOpts = {
        backgroundColor: "#000000",
        //'fillColor: ["#ffffff", "#62B9FD", "#536AA3", "#000000"]
        fillColor: ["#ffffff", "#ffd624", "#f16f63", "#d4338e", "#8d0da6", "#451a88", "#2c1876", "#000000"]
    }




    var p = Wispy.prototype;

    p.controller = null;
    p.width = null;
    p.height = null;
    p.canvas = null;
    p.canvasCtx = null;

    p.backgroundColor = null;
    p.lineColor = null;
    p.lineWidth = null;


    function buildGradientRange(controller, originalFillColor, size) {
        var tween = [];
        var count = 0;
        while (tween.length < size) {
            var first = originalFillColor[count];
            var next = originalFillColor[count + 1];
            if (!next) {
                break;
            }
            var inbetween = jbeeb.Utils.rgbBetween(first, next);
            tween.push(first);
            tween.push(inbetween);
            tween.push(next);
            count++;

        }

        var result = [];
        for (var i = 0; i < tween.length; i++) {
            result[i] = jbeeb.Utils.makeColor(tween[i], 1).replace("#", "0x");
        }

        return result;
    }

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
        var scrollVert = false; // false  true
        var scrollReverse = false;

        var unitSize = Math.ceil(HEIGHT / bufferLength);
        var totalUnits = HEIGHT / unitSize;

        var specSize = 1; //unitSize;

        var fillColor = this.fillColor; // localize
        var fillColorRange = fillColor.length - 1;
        var primaryColor = fillColor[0];

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
            scrollReverse ? specSize : -specSize, // d-x
            0, // d-y
            WIDTH, // d-width
            HEIGHT // d-height
        );


        ctx.globalAlpha = 0.4; // highr = faster

        var w = WIDTH;
        var h = HEIGHT;

        var bob = 2;
        var dX1 = -bob;
        var dX2 = bob;
        var dY1 = -bob;
        var dY2 = bob;

        var dW1 = WIDTH;
        var dW2 = WIDTH;
        var dH1 = HEIGHT;
        var dH2 = HEIGHT;

        var sX1 = bob;
        var sX2 = -bob;
        var sY1 = 0;
        var sY2 = 0;

        var sW1 = WIDTH - 1;
        var sW2 = WIDTH - 1;
        var sH1 = HEIGHT;
        var sH2 = HEIGHT;
        for (var i = 1; i <= 5; i++) {
            // d = destination
            // s = source
            //							dY		dY		dW			dH			sX	sY		sW			sH
            //ctx.drawImage(buffer, 	offset, 0,		w-offset-3, h, 			0, 	offset,	w-offset-5, h 		);
            //ctx.drawImage(buffer, 	0, 		offset, w-3, 		h-offset, 	0, 	0,		w-5, 		h-offset);
            ctx.drawImage(canvas, dX1, dY1, dW1, dH1, sX1, sY1, sW1, sH1);
            ctx.drawImage(canvas, dX2, dY2, dW2, dH2, sX2, sY2, sW2, sH2);

        }
        ctx.globalAlpha = 1;

    }


    p.reset = function() {
        var ctx = this.canvasCtx;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Wispy = Wispy;

}());
