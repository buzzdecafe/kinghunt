# KingHunt

Select a chess problem and solve it in the number of moves stipulated.

For FirefoxOS to start. [Installation page for FirefoxOS](http://buzzdecafe.github.io/kinghunt/)


## To do

### Interface &c.
* Interface for loading other books or individual problems
* validate FEN (use chess.js validate_fen method, duh)
* limit book length for performance reasons
* show spinner or something while problems load up
* ~~redesign load page with title & logo~~
* ~~add undo button on board~~
* ~~add next problem/previous problem buttons on board~~
* ~~add reload button to board~~
* ~~enable pawn-promotion choice (proving trickier than anticipated)~~

### AI and storage
* enable switching between manual mode and AI mode (defer to later version)
* develop better AI! (defer to later version)
* mark problems solved and persist somewhere (localStorage? indexedDB?)
* ~~detect when problem successfully solved or when failed~~

### build stuff
* integrate grunt-jshint-karma-jasmine into build process
* create dev and prod build paths (minify for production)
* ~~grunt task to build the firefoxos webapp~~
* ~~grunt task to add VERSION file in archive~~

## Version

0.1.0


