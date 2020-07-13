this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Carbon
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * @param {GraphicEQ} controller - The primary class responsible for constructing this renderer.
     * @param {object} userOpts - The options defined in rendererOpts which this renderer offers.
     */
    function Carbon(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Carbon.defaultOpts = {
        backgroundColor: "#000000",
        //'fillColor: ["#ffffff", "#62B9FD", "#536AA3", "#000000"]
        fillColor: ["#ffffff", "#ffd624", "#f16f63", "#d4338e", "#8d0da6", "#451a88", "#2c1876", "#000000"]
    }



    var p = Carbon.prototype;

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

		if( ! this._rangeBuilt ){
        	this.fillColor = this.controller.tweenGradient(this.fillColor, 100);
        	this._rangeBuilt = true;
		}

        var fillColor = this.fillColor; // localize
        var fillColorRange = fillColor.length - 1;


           
        var y = HEIGHT;
        var row = [];
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
            row.push(color);

        };

        avgData = avgData / bufferLength;

        // s = source, d = destination
        var canvas = this.canvas;
        ctx.drawImage(
            canvas,
            0, 			// s-x
            0, 			// s-y
            WIDTH, 		// s-width
            HEIGHT, 	// s-height
            -specSize, 	// d-x
            0, 			// d-y
            WIDTH, 		// d-width
            HEIGHT 		// d-height
        );

        ctx.globalAlpha = 0.8 * avgData;
        var bsAvg = 30 * avgData;

        // perhaps some more blurring?
        //for (var i = 0; i < 1; i++) {
            
            ctx.drawImage(
            	canvas, 
            	0, 
            	0, 
            	WIDTH, 
            	HEIGHT, 
            	0, 
            	bsAvg, 
            	WIDTH - bsAvg, 
            	HEIGHT + bsAvg
            );

            ctx.drawImage(
            	canvas, 
            	0, 
            	0, 
            	WIDTH, 
            	HEIGHT, 
            	0, 
            	-bsAvg, 
            	WIDTH - bsAvg, 
            	HEIGHT - bsAvg
            );

        //}

        ctx.globalAlpha = 1;

    }


    p.reset = function() {
        var ctx = this.canvasCtx;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Carbon = Carbon;

}());
