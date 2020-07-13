-----------------------
Wimpy FLAC Controller 
-----------------------

By Mike Gieson
http://www.wimpyplayer.com/docs/common/file_formats_FLAC.html


--------------------
Basic Installation
--------------------
To use on your page, reference the "wimpy.flac.js" file 
just after the reference to the "wimpy.js" engine.

	<!-- Wimpy Engine -->
	<script src="wimpy.js"></script>

	<!-- Wimpy FLAC Plugin (must be below wimpy.js) -->
	<script src="wimpy.flac.js"></script>
	
--------------------
More Info:
--------------------
http://www.wimpyplayer.com/docs/common/file_formats_FLAC.html

--------------------
USING:
--------------------
Aurora.js
--------------------
https://github.com/audiocogs/aurora.js/
Written by @jensnockert and @devongovett of Audiocogs.
Aurora.js is released under the MIT license.

Files included from the Aurora project:
 - aurora.js
 - flac.js

--------------------
NOTES:
 Seeking with FLAC (moving the scrubber to a new point in a track) requires
 1 second interval seektables set up within the files. Use the "metaflac" 
 tools to add a seektable entry every second:

	Download (For Windows and *nix):
	https://xiph.org/flac/download.html
	
	# Or install metaflac tools for Mac:
		$ brew install flac
	
	# Add seektable:
		$ cd /path/to/flac/files/
 		$ metaflac --add-seekpoint=1s *.flac

