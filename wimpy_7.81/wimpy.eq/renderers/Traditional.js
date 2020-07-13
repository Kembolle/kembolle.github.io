this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};


(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Traditional
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		userOpts 	- The original configuration object used during setup.
     * 
     */
    function Traditional(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Traditional.defaultOpts = {
        backgroundColor: "#000000",
        fillColor: "#FFFFFF",
        barSpace : 1
    }

    var p = Traditional.prototype;


    p.target = null;
    p.width = null;
    p.height = null;
    p.canvas = null;
    p.canvasCtx = null;
    p.backgroundColor = null;
    p.fillColor = null;
    p.barWidth = null;
    p.barSpace = null;


    /**
     * The requestAnimation loop, called on each tick. Use this to render the animation.
     *
     * @method loop
     * @param  {array} data - An array of frequency data.
     */

    p.loop = function(data) {

        var ctx = this.canvasCtx;
        var canvas = this.canvas;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var HALF_HEIGHT = HEIGHT / 2;

        var bufferLength = data.length;

        ctx.fillStyle = this.backgroundColor; //"rgba(0,0,0,0)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        var unitSize = WIDTH / bufferLength;
        var barWidth = unitSize - this.barSpace;
        var barColor = this.fillColor;

        var barColorIsArray = typeof barColor == 'object';
        ctx.fillStyle = barColor;

        var x = 0;
        for (var i = 0; i < bufferLength; i++) {

        	var y = HEIGHT * data[i];
            //var gradient = ctx.createLinearGradient(0, HEIGHT - y, 0, y);
            var gradient;
            if (barColorIsArray) {
                // paints along a line from (x0, y0) to (x1, y1)
                gradient = ctx.createLinearGradient(0, HEIGHT, 0, -y);
                for (var g = 0; g < barColor.length; g += 2) {
                    gradient.addColorStop(barColor[g], barColor[g + 1]);
                }
                ctx.fillStyle = gradient;
            }
            ctx.fillRect(x, HEIGHT, barWidth, -y);
            x += unitSize

        };


    }

    /**
     * Called when the a track is launched.
     *
     * @method launch
     * @param  {object} trackDataset - Track info that contains title, album, artist, and any other info found in the playlist item. See (Track Dataset)[http://www.wimpyplayer.com/docs/trackDataset.html]
     */
    p.launch = function(trackDataset) {

    }

    /**
     * Called when the a track is played.
     *
     * @method launch
     * @param  {object} trackDataset - Track info that contains title, album, artist, and any other info found in the playlist item. See (Track Dataset)[http://www.wimpyplayer.com/docs/trackDataset.html]
     */
    p.play = function(trackDataset) {

    }

    /**
     * Called when the a track is paused.
     *
     * @method launch
     * @param  {object} trackDataset - Track info that contains title, album, artist, and any other info found in the playlist item. See (Track Dataset)[http://www.wimpyplayer.com/docs/trackDataset.html]
     */
    p.pause = function(trackDataset) {

    }

    /**
     * Called when the a track is finished playing.
     *
     * @method launch
     * @param  {object} trackDataset - Track info that contains title, album, artist, and any other info found in the playlist item. See (Track Dataset)[http://www.wimpyplayer.com/docs/trackDataset.html]
     */
    p.done = function(trackDataset) {

    }

	wimpy.extension.eq.renderers.Traditional = Traditional;

}());
