vidz
===========

Tiny library to provide a no-muss, no-fuss HTML5 video element

#### Purpose

To introduce a simple, straightforward method to dynamically add well-formatted HTML5 video to the DOM. `vidz` has no dependencies, and is based off of the native DOM elements and selectors, however if you are using jQuery it will also work with elements in jQuery objects.

#### Size

+ Uncompressed: 55.8KB (mainly for the sourcemap)
+ Minified: 8.44KB
+ Minified and gzipped: 3.1KB

#### Installation

```
$ npm i vidz --save
```

#### Usage

```javascript
const vidzInstance = vidz('#video-container', {
    mp4: './videos/test.mp4',
    ogg: './videos/test.ogg'
});
```

This will instantiate a new `vidz` instance, appending a generated `<video>` element to the selector provided. You can also provide the DOM element itself, or a jQuery object if you wish.

#### Advanced usage

**vidz(selector: string|HTMLElement|jQueryObject, config: object)**

```javascript
const standardSelector = vidz('#video-container', config);
const domElement = vidz(document.querySelector('#video-container'), config);
const jqueryObject = vidz($('#video-container'), config);
```

Available options in the config object:
* attributes `{object}` *defaults to {}*
    * Additional attributes that you want to pass to the `<video>` element
* autoplay `{boolean}` *defaults to false*
    * Whether the video should start playing immediately on load
* controls `{boolean}` *defaults to true*
    * Whether the video should have the native controls provided
* height `{number}` *defaults to 400*
    * Height in pixels the video container will be
* loop `{boolean}` *defaults to false*
    * Whether the video should play on a loop
* mp4 `{string}` *defaults to null*
    * The source of the mp4 file on your server
* muted `{boolean}` *defaults to false*
    * Whether the video should be muted on load
* ogg `{string}` *defaults to null*
    * The source of the ogg/ogv file on your server
* onCanPlayThrough `{function}` *defaults to null*
    * Function called when the `canPlayThrough` event is fired
* onEnded `{function}` *defaults to null*
    * Function fired when the `ended` event is fired
* onError `{function}` *defaults to null*
    * Function fires when an error occurs with the video
* onLoad `{function}` *defaults to null*
    * Function fires when the video finishes loading
* onLoadedMetadata `{function}` *defaults to null*
    * Function fires when the `loadingmetadata` event is fired
* onPlay `{function}` *defaults to null*
    * Function fires when the `playing` event is fired
* onPause `{function}` *defaults to null*
    * Function fires when the `pause` event is fired
* onProgress `{function}` *defaults to null*
    * Function fires when the `progress` event is fired
* onWaiting `{function}` *defaults to null*
    * Function fires when the `waiting` event is fired
* poster `{string}` *defaults to null*
    * The source of the image used as a poster for the video
* preload `{string}` *defaults to "auto"*
    * The value for the `preload` attribute applied to the `<video>` tag
* webm `{string}` *defaults to null*
    * The source of the webm file on your server
* width `{number}` *defaults to 600*
    * Width in pixels the video container will be

#### Methods for the `Vidz` instance

**add()**
If the player has been previously removed from the `selector` passed originally, it re-appends the player to the `selector`.

**canPlayType(format: string)**
Returns the same format string if it supports the type `format`, else returns an empty string

**getCurrentTime()**
Returns the `currentTime` of the player

**getPlaybackRate()**
Returns the `playbackRate` of the video player (standard `playbackRate` is 1, valid values are between 0.25 and 16)

**getPlayer()**
Returns the `<video>` element of the player

**getVideoDimensions**
Returns an object of `{height: number, width: number}` which reflects the height and width of the video (not the `<video>` element

**getVolume()**
Returns the `volume` of the player (standard `volume` is 1, valid values are between 0 and 1)

**load()**
Triggers a `load` event on the player

**mute()**
Mutes the player

**pause()**
If the player is playing, it pauses the player

**play()**
If the player is paused, it plays the player

**remove()**
Removes the player as a child from the `selector` passed originally.

**restart()**
Sets the `currentTime` to 0

**setCurrentTime(value: number)**
Jumps the `currentTime` to the value provided

**setPlaybackRate(value: number)** *defaults to 1*
Sets the `playbackRate` to the value provided

**setSource(value: string)**
Sets the players `src` attribute to the value provided

**setVolume(value: number)** *defaults to 1*
Sets the player's volume to the value provided (standard `volume` is 1, valid values are between 0 and 1)

**unmute()**
If muted, it unmutes the player

#### Note

Most of the methods above

#### Development

Standard stuff, clone the repo and `npm i` to get the dependencies. npm scripts available:
* `build` => builds the distributed JS with `NODE_ENV=development` and with sourcemaps
* `build-minified` => builds the distributed JS with `NODE_ENV=production` and minified
* `compile-for-publish` => runs the `lint`, `test`, `transpile`, and `dist` scripts
* `dev` => runs the webpack dev server for the playground
* `dist` => runs the `build` and `build-minified`
* `lint` => runs ESLint against files in the `src` folder
* `prepublish` => if in publish, runs `compile-for-publish`
* `test` => runs AVA tests
* `test:watch` => runs AVA tests with persistent watcher
* `transpile` => runs Babel against files in `src` to files in `lib`
