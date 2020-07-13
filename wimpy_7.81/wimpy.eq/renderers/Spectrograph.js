this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Spectrograph
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function Spectrograph(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Spectrograph.defaultOpts = {
    	scrollVertical : false,
    	scrollReverse : false,
        backgroundColor: "#000000",
        fillColor: ["#ffffff", "#ffd624", "#f16f63", "#d4338e", "#8d0da6", "#451a88", "#2c1876", "#000000"]
    }


    var p = Spectrograph.prototype;

    p.width = null;
    p.height = null;
    p.canvas = null;
    p.canvasCtx = null;

    p.backgroundColor = null;

    p.scrollVerical = false;
    p.scrollReverse = false;
    p.fillColor = null;


    /**
     * Called by the controller to render the animation. Called on each tick.
     *
     * @method loop
     * @param  {array} data - An array of frequency data normalized to values between 0 and 1. If the user defined a "scale" configuration property, the value may be larger than 1.
     */
    p.loop = function(data) {

    	// localize stuff for speed.
        var ctx = this.canvasCtx;
        var canvas = this.canvas;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var HALF_HEIGHT = HEIGHT / 2;

		if( ! this._rangeBuilt ){
        	this.fillColor = this.controller.tweenGradient(this.fillColor, 100);
        	this._rangeBuilt = true;
		}
        var fillColor = this.fillColor;
 		var fillColorRange = fillColor.length-1;
   
        var scrollVert = this.scrollVerical; // false  true
        var scrollReverse = this.scrollReverse;

        // THe size of each spectrum "block". (Based on the data length with respect to the width/height)
        var unitSize;
        var totalUnits;
        var bufferLength = data.length;
        if(scrollVert){
        	unitSize = Math.ceil(WIDTH / bufferLength);
        	totalUnits = WIDTH / unitSize;
        } else {
        	unitSize = Math.ceil(HEIGHT / bufferLength);
        	totalUnits = HEIGHT / unitSize;
        }

        // How thick the specturm should be. (The opposite dimension of the spectrum size)
		var specSize = 1; //unitSize;

        var x = 0;
        var y = HEIGHT;

        // Figure out where to start rendering.
        var dX1 = 0;
        var dY1 = 0;
        var startPos;
        if(scrollReverse){
        	startPos = 0;
        	if(scrollVert){
	        	dY1 = -1;
	        } else {
	        	dX1 = -1;
	        }
        } else {
        	if(scrollVert){
	        	startPos = HEIGHT - specSize;
	        	dY1 = 1;
	        } else {
	        	startPos = WIDTH-specSize;
	        	dX1 = 1;
	        }
        }

        // Draw the spectrum line
        for (var i = 0; i < bufferLength; i++) {

            var val = data[i];
            var colorIdx = Math.round(fillColorRange - fillColorRange * val);
            var color = fillColor[colorIdx];
            ctx.fillStyle = color;
            if(scrollVert){
            	ctx.fillRect(x, startPos, unitSize, specSize);
            	x += unitSize;
            } else {
            	ctx.fillRect(startPos, y, specSize, unitSize);
            	y -= unitSize;
            }
            
        };

        // Draw same on top for next go'round.
        ctx.drawImage(canvas, dX1, dY1, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
        
		
    }

 
    p.reset = function() {
        var ctx = this.canvasCtx;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Spectrograph = Spectrograph;

}());
