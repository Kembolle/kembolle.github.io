this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class DesertStorm
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function DesertStorm(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    DesertStorm.defaultOpts = {
        backgroundColor: "#000000",
        //'fillColor: ["#ffffff", "#62B9FD", "#536AA3", "#000000"]
        fillColor: ["#ffffff", "#ffd624", "#f16f63", "#d4338e", "#8d0da6", "#451a88", "#2c1876", "#000000"]
    }




    var p = DesertStorm.prototype;

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

        var bufferLength = data.length;
        var unitSize = Math.ceil(HEIGHT / bufferLength);
        var totalUnits = HEIGHT / unitSize;

        var specSize = 2;

        if (!this._rangeBuilt) {
            this.fillColor = this.controller.tweenGradient(this.fillColor, 100);
            this._rangeBuilt = true;
        }

        var fillColor = this.fillColor; // localize
        var fillColorRange = fillColor.length-1;
        var primaryColor = fillColor[0];

      
        var y = HEIGHT;
        var startPos = WIDTH-specSize;
        var avgData = 0;
        for (var i = 0; i<bufferLength; i++) {

            var val = data[i];
            avgData += val;
            var colorIdx = Math.round(fillColorRange - fillColorRange * val);
            var color = fillColor[colorIdx];
            ctx.fillStyle = color;
            ctx.fillRect(startPos - (WIDTH/2 * val), y, 10 * (1-val), unitSize);
            y -= unitSize;
        };

        avgData = avgData / bufferLength;



		ctx.drawImage(
    		canvas, 	
    		0, 			// s-x
    		(0.5 * (0.5 - avgData)), 			// s-y
    		WIDTH - (2 * avgData), 		// s-width
    		HEIGHT - (2 * avgData), 	// s-height
    		0.1 + (-3*avgData), 				// d-x (wind direction)
    		avgData + 5 * (0.3 - avgData),			// d-y first= falling speed, second=falling direction (lower numbers make smoke rise)
    		WIDTH, 		// d-width
    		HEIGHT-avgData		// d-height
    	);


		ctx.globalCompositeOperation = 'lighten';

	    ctx.globalAlpha = .7*(avgData);


    	for (var i=1; i<=1;i++) {
      		ctx.drawImage(canvas, 		0, 0, WIDTH + 1, 	HEIGHT, 	0, 0, WIDTH - 1, HEIGHT );
    		ctx.drawImage(canvas, 		0, 0, WIDTH, 		HEIGHT -1, 0, 0, WIDTH - 1, HEIGHT	);
      
      	}
	    ctx.globalAlpha = 1;
	    ctx.globalCompositeOperation = 'source-over';

    }


    p.reset = function() {
        var ctx = this.canvasCtx;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.DesertStorm = DesertStorm;

}());
