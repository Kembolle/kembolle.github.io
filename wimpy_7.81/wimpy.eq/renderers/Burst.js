this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Burst
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function Burst(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Burst.defaultOpts = {
    	backgroundColor : "#000000",
    	barColor : [
            0, '#000000',
            0.15, '#0000BF',
            0.35, '#D800FE',
            0.45, '#FC9208',
            0.5, '#FFFFFF',
            0.55, '#FC9208',
            0.65, '#D800FE',
            0.85, '#0000BF',
            1, '#000000'
        ],
       	barWidth : 4,
    	barSpace : 1
    }




var p = Burst.prototype;

    p.width = null;
    p.height = null;
    p.canvas = null;
    p.canvasCtx = null;

    p.backgroundColor = null;
    p.barColor = null;
    p.barWidth = null;
    p.barSpace = null;


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

         // Figure things out
        var barColor = this.barColor;
        var unitSize = Math.ceil(WIDTH/bufferLength);
        var barWidth = unitSize - (this.barSpace || 0);
        var totalUnits = WIDTH / unitSize;
        var samplesPerUnit = bufferLength / totalUnits;

        // Clear the previous render
        ctx.fillStyle = this.backgroundColor;
        if( ! this.backgroundColor ){
        	ctx.clearRect(0, 0, WIDTH, HEIGHT)
        } else {
        	ctx.fillRect(0, 0, WIDTH, HEIGHT);
        }

        // For faster rendering, perhaps the user defined a flat color?
        var barColorIsArray = typeof barColor == 'object';
        if( ! barColorIsArray ){
        	ctx.fillStyle = barColor;
        }

        var countSamples = 0;
        var avg = 0;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {


        	var y = data[i] * HEIGHT;
            var half_y = y * 0.5;

            if (barColorIsArray) {

                // paints along a line from (x0, y0) to (x1, y1)
                var gradient = ctx.createLinearGradient(0, HALF_HEIGHT - half_y, 0, HALF_HEIGHT + half_y);
                for (var g = 0; g < barColor.length; g += 2) {
                    gradient.addColorStop(barColor[g], barColor[g + 1]);
                }
                ctx.fillStyle = gradient;

            }

            ctx.fillRect(x, HALF_HEIGHT - half_y, barWidth, y);

            // move along;
            x += unitSize;

        };

    }

    p.reset = function(){
    	var ctx = this.canvasCtx;
    	ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Burst = Burst;

}());
