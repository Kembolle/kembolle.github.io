this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Peaks
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function Peaks(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Peaks.defaultOpts = {
    	backgroundColor : "#000000",
    	
      
      
    	barColor : [
          0, "#ff1800",
	      0.05, "#ff1800",
	      0.05, "#e8e600",
	      0.4, "#1FD704",
	      1, "#1FD704"
        ],
       	barWidth : 4,
    	barSpace : 1
    }




var p = Peaks.prototype;

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

    	if( ! this._rangeBuilt ){
    		var barColor = this.barColor;
	        var colorIsArray = false;

	        if (typeof barColor == 'object') {

	        	colorIsArray = true;

	            // paints along a line from (x0, y0) to (x1, y1)
	            var gradient = this.canvasCtx.createLinearGradient(0, 0, 0, this.height);
	            for (var g = 0; g < barColor.length; g += 2) {
	            	// addColorStop(position, color)
	                gradient.addColorStop(barColor[g], barColor[g + 1]);
	            }
	            this.barColor = gradient;

	        }

	        this._peaks = [];
	        this._peaksRelease = [];
	        this._peakCount = 0;
	        if( ! this.peakColor){
	        	if(colorIsArray){
	        		this.peakColor = barColor[barColor.length-1];
	        	} else {
	        		this.peakColor = barColor;
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
        

        var barColor = this.barColor;
        var countSamples = 0;
        var avg = 0;
        var x = 0;
        var peaks = this._peaks;
        var peaksRelease = this._peaksRelease;
        var peakColor = this.peakColor || "#FFFFFF";
        var peakCount = this._peakCount;

        var peakCount = this._peakCount
        ctx.fillStyle = this.barColor;

        if(!peaks.length){
        	for (var i = 0; i < bufferLength; i++) {
        		peaks[i] = 0;
        		peaksRelease[i] = 0;
        	}
        }

        for (var i = 0; i < bufferLength; i++) {

        	var y = data[i] * HEIGHT;
            ctx.fillRect(x, HEIGHT, barWidth, -y);
            
            var peakY = peaks[i];
            if(y > peaks[i]){
            	peaks[i] = y;
            	peakY = y;
            	peaksRelease[i] = 0;
            } else {
            	peaksRelease[i]++;

            	if(peaksRelease[i] > 50){
	            	peaks[i] -= peaksRelease[i]/100;
	            	peakY = peaks[i];
	            	if(peaks[i] < y){
	            		peakY = y
	            		peaks[i] = y;
	            		peaksRelease[i] = 0;
	            	}
	            }
            }
            if(y){
            	ctx.fillStyle = this.peakColor;
            	ctx.fillRect(x, HEIGHT - peakY, barWidth, 2);
            	ctx.fillStyle = this.barColor;
            }
            

            x += unitSize;

        };

        peakCount++;
        if(peakCount > 100){
        	peakCount = 0;
        }
        this._peakCount = peakCount;

    }

    p.reset = function(){
    	var ctx = this.canvasCtx;
    	ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Peaks = Peaks;

}());
