this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Line
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function Line(controller, originalParams) {
    	this._rangeBuilt = false;

    }

    Line.defaultOpts = {
    	backgroundColor : "#000000",
    	fillColor : "#1287FF88",
    	lineColor : "#E600FF",
    	lineWidth : 3
    }




var p = Line.prototype;

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

    	if( ! this._rangeBuilt ){
    		var fillColor = this.fillColor;
	        if(fillColor){
	        	if (typeof fillColor == 'object') {

		            // paints along a line from (x0, y0) to (x1, y1)
		            var gradient = this.canvasCtx.createLinearGradient(0, 0, 0, cv.height);
		            for (var g = 0; g < fillColor.length; g += 2) {
		            	// addColorStop(position, color)
		                gradient.addColorStop(fillColor[g], fillColor[g + 1]);
		            }
		            this.fillColor = gradient;

		        }
	        }
	        this._rangeBuilt = true;
    	}
    	
        var ctx = this.canvasCtx;
        var canvas = this.canvas;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var HALF_HEIGHT = HEIGHT / 2;

        var bufferLength = data.length;

         // Figure things out
        
        var unitSize = Math.ceil(WIDTH/bufferLength);
        var barWidth = unitSize - (this.barSpace || 0);
        var totalUnits = WIDTH / unitSize;
        var samplesPerUnit = bufferLength / totalUnits;
        var lineWidth = this.lineWidth

        // Clear the previous render
        if( ! this.backgroundColor ){
        	ctx.clearRect(0, 0, WIDTH, HEIGHT)
        } else {
        	ctx.fillStyle = this.backgroundColor;
        	ctx.fillRect(0, 0, WIDTH, HEIGHT);
        }
        
        ctx.beginPath();
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round"; // round  square  butt

        
        var x = 0;
        var y = 0;
        var firstY = HALF_HEIGHT;
        for (var i = 0; i < bufferLength; i++) {

        	y = data[i] * HEIGHT;
        	if(i == 0){
        		ctx.moveTo(-1, HEIGHT - y);
        		firstY = y;
        	}
            ctx.lineTo(x, HEIGHT - y  );
            oldy = -y;
            x += unitSize;

        };


        if(this.fillColor){

        	ctx.lineTo(WIDTH + lineWidth, HEIGHT - y + lineWidth);
        	ctx.lineTo(WIDTH + lineWidth, HEIGHT + lineWidth  );
        	ctx.lineTo(-lineWidth, HEIGHT + lineWidth  );
        	ctx.lineTo(-lineWidth, HEIGHT - firstY + lineWidth);

        	ctx.fillStyle = this.fillColor;
        	ctx.fill();
        }

        ctx.stroke();


    }

    p.reset = function(){
    	var ctx = this.canvasCtx;
    	ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Line = Line;

}());
