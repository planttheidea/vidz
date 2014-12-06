VideoPlease
===========

Tiny library to provide a bulletproof HTML5 video, with fallback.

### Purpose

To introduce a simple, straightforward method to dynamically add well-formatted HTML5 video to pages, with a properly structured fallback to Flash when not supported. VideoPlease is not library-dependent, however there is a tweaked version to work with jQuery as well.

### Size

+ Uncompressed: 11.7KB
+ Minified: 4.7KB
+ Minified and gzipped: 1.52KB

### Start

Before you can use any of the methods, you must first instantiate a new VideoPlease object. In terms of usage, this is the only area of difference between the standard and jQuery versions. To make things a bit more concise detailing the two versions, I will set my options in a variable:

```html
var config = {
		id:[
			'player1',
			'player2'
		],
		height:300,
		width:500,
		mp4:[
			'__VIDEO1__.mp4',
			'__VIDEO2__.mp4'
		],
		webm:[
			'__VIDEO1__.webm',
			'__VIDEO2__.webm'
		],
		ogg:[
			'__VIDEO1__.ogv',
			'__VIDEO2__.ogv'
		],
		swf:'http://dev.planttheidea.com/backstagestudios/video/player.swf',
		poster:[
		  '__POSTER1__.jpg',
		  '__POSTER2__.jpg'
		]
  };
```

A couple of things to point out:
+ when multiple videos are to be created, an array can be provided for each of the values
  + if your selector returns 3 DOM nodes, you can have an array that has different values for each of the 3 nodes for each option passed
  + if your selector returns 3 DOM nodes, but you only pass in a string, it will use that value for all 3
  + if your selector returns 3 DOM nodes, but you pass in an array with only two values, only the first two nodes will receive those values
+ every config option is optional, however if nothing is passed, nothing will get created (duh)
+ there are a few defaults which can be overridden, but exist without passing them:
  + preload (set to "auto")
  + controls (set to "controls", so they appear)
  + autoplay (set to false, to not autoplay)
  + flashFallback (set to true, so fallback is created)

Let's create the object now!

**Standard**
```html
var vp = new VideoPlease('.Selector',config);
```

**jQuery**
```html
var vp = $('.Selector').videoplease(config);
```

Now that you have a new VideoPlease object created, you can use some of the methods.

### Methods

**active**

Checks to see whether a particular player is active, or returns an array of multiple players' active status. To use the method, you can pass in the following parameter:
+ instance criteria (string / integer / array, optional)

If no parameter is passed, an array of all player status is retrieved.

Example:
```html
console.log(vp.active());
// logs an array of all players active status in the vp object
console.log(vp.active(1));
// logs the active status of player with index 1
console.log(vp.active('player1');
// logs the active status of player with id 'player1'
console.log(vp.active(['player1',1]);
// logs an array with the first value being the active status of player with id 'player1', and the second value being the active status of player with index 1
```

**add**
Adds a new instantiation of a video element, replacing the node(s) passed into the VideoPlease object based on the selector. To use the method, you can pass in the following parameter:
+ instance criteria (string / integer / array, optional)

If no parameter is passed, all players in the object will be instantiated.

Example:
```html
// original HTML
<div class="Selector">Div 1</div>
<div class="Selector">Div 2</div>
<div class="Selector">Div 3</div>

// run add for the first div only
vp.add(0);

// run add for the last player only, assuming you assigned id of "player3" to it
vp.add('player3');

// run add for all divs, just for the hell of it
vp.add();
```

**element**
Retrieves the original element that was replaced with a video object. To use the method, you can pass in the following parameter:
+ instance criteria (string / integer / array, optional)

If no parameter is passed, an array of all elements in the object will be retrieved.

Example:
```html
// original HTML
<div id="div1" class="Selector">Div 1</div>
<div id="div2" class="Selector">Div 2</div>
<div id-"div3" class="Selector">Div 3</div>

// retrieve first div only
vp.element(0);

// retrieve last div only
vp.element('div3');

// retrieve array of all divs in object
vp.element();
```

**player**
Retrieves the video object that replaced the elements in the selector. To use the method, you can pass in the following parameter:
+ instance criteria (string / integer / array, optional)

If no parameter is passed, an array of all players in the object will be retrieved.

Example:
```html
// original HTML
<div class="Selector">Div 1</div>
<div class="Selector">Div 2</div>
<div class="Selector">Div 3</div>

// retrieve first div only
vp.player(0);

// retrieve last player only, assuming you passed an ID of "player3"
vp.player('player3');

// retrieve array of all players in object
vp.player();
```

**remove**
Removes an existing instantiation of a video element, replacing the player(s) from the VideoPlease object with their original element nodes. To use the method, you can pass in the following parameter:
+ instance criteria (string / integer / array, optional)

If no parameter is passed, all players in the object will be reverted.

Example:
```html
// original HTML
<div class="Selector">Div 1</div>
<div class="Selector">Div 2</div>
<div class="Selector">Div 3</div>

// run remove for the first div only
vp.remove(0);

// run remove for the last player only, assuming you assigned id of "player3" to it
vp.remove('player3');

// run remove for all divs, just for the hell of it
vp.add();
```
