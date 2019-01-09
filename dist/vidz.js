(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("vidz", [], factory);
	else if(typeof exports === 'object')
		exports["vidz"] = factory();
	else
		root["vidz"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Vidz = exports.setVideoEvents = exports.setElementAttribute = exports.getVideoElement = exports.getSourceElement = exports.getObjectElement = undefined;

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ELEMENT_TYPES = {
  IMAGE: 'img',
  OBJECT: 'object',
  PARAM: 'param',
  SOURCE: 'source',
  VIDEO: 'video'
};

var SOURCE_TYPES = {
  MP4: 'video/mp4',
  OGG: 'video/ogg',
  WEBM: 'video/webm'
};

var DEFAULT_ATTRIBUTES = {
  AUTOPLAY: false,
  CONTROLS: true,
  HEIGHT: 400,
  LOOP: false,
  MUTED: false,
  PRELOAD: 'auto',
  WIDTH: 600
};

/**
 * convenience function to set an attribute on an element to value
 *
 * @param {HTMLElement} element
 * @param {string} attribute
 * @param {any} value
 */
var setElementAttribute = function setElementAttribute(element, attribute, value) {
  element.setAttribute(attribute, value);
};

/**
 * convenience function to add an event listener to an element
 *
 * @param {HTMLElement} element
 * @param {string} event
 * @param {function} handler
 */
var setElementEventListener = function setElementEventListener(element, event, handler) {
  element.addEventListener(event, handler);
};

/**
 * create a new source element based on the elementType
 * and type, assigning the src to it
 *
 * @param {string} src
 * @param {string} type
 * @return {HTMLElement}
 */
var getSourceElement = function getSourceElement(src, type) {
  var element = (0, _utils.createNewElement)(ELEMENT_TYPES.SOURCE);

  element.src = src;
  element.type = type;

  return element;
};

/**
 * create a new object element and populate it with the
 * param elements that have the flash-specific values needed
 * for the fallback
 *
 * @param {boolean} autoplay
 * @param {boolean} controls
 * @param {number} height
 * @param {string} mp4
 * @param {string} poster
 * @param {string} swf
 * @param {number} width
 * @return {HTMLElement}
 */
var getObjectElement = function getObjectElement(_ref) {
  var autoplay = _ref.autoplay,
      controls = _ref.controls,
      height = _ref.height,
      mp4 = _ref.mp4,
      poster = _ref.poster,
      swf = _ref.swf,
      width = _ref.width;

  var objectElement = (0, _utils.createNewElement)(ELEMENT_TYPES.OBJECT),
      movieParamElement = (0, _utils.createNewElement)(ELEMENT_TYPES.PARAM),
      flashvarsParamElement = (0, _utils.createNewElement)(ELEMENT_TYPES.PARAM);

  setElementAttribute(objectElement, 'data', swf);
  setElementAttribute(objectElement, 'height', height);
  setElementAttribute(objectElement, 'width', width);

  setElementAttribute(movieParamElement, 'name', 'movie');
  setElementAttribute(movieParamElement, 'value', swf);

  setElementAttribute(flashvarsParamElement, 'name', 'flashvars');

  var flashvarsObject = {
    autostart: autoplay ? true : null,
    controlbar: controls ? 'over' : null,
    file: mp4,
    image: poster
  };

  var flashvarsValue = '';

  for (var key in flashvarsObject) {
    var value = flashvarsObject[key];

    if (value) {
      if (flashvarsValue) {
        flashvarsValue += '&';
      }

      flashvarsValue += key + '=' + value;
    }
  }

  setElementAttribute(flashvarsParamElement, 'value', flashvarsValue);

  objectElement.appendChild(movieParamElement);
  objectElement.appendChild(flashvarsParamElement);

  if (poster) {
    var imageElement = (0, _utils.createNewElement)(ELEMENT_TYPES.IMAGE);

    setElementAttribute(imageElement, 'alt', 'Video is unavailable.');
    setElementAttribute(imageElement, 'height', height);
    setElementAttribute(imageElement, 'src', poster);
    setElementAttribute(imageElement, 'title', 'We cannot provide playback capabilities at this time.');
    setElementAttribute(imageElement, 'width', width);

    objectElement.appendChild(imageElement);
  }

  return objectElement;
};

/**
 * build the video element that will be injected onto the page
 *
 * @param {boolean} autoplay
 * @param {boolean} controls
 * @param {number} height
 * @param {boolean} loop
 * @param {boolean} muted
 * @param {string} preload
 * @param {number} width
 * @returns {HTMLElement}
 */
var getVideoElement = function getVideoElement(_ref2) {
  var autoplay = _ref2.autoplay,
      controls = _ref2.controls,
      height = _ref2.height,
      loop = _ref2.loop,
      muted = _ref2.muted,
      preload = _ref2.preload,
      width = _ref2.width;

  var videoElement = (0, _utils.createNewElement)(ELEMENT_TYPES.VIDEO);

  if (autoplay) {
    setElementAttribute(videoElement, 'autoplay', '');
  }

  if (controls) {
    setElementAttribute(videoElement, 'controls', '');
  }

  if (loop) {
    setElementAttribute(videoElement, 'loop', '');
  }

  if (muted) {
    setElementAttribute(videoElement, 'muted', '');
  }

  setElementAttribute(videoElement, 'height', height);
  setElementAttribute(videoElement, 'preload', preload);
  setElementAttribute(videoElement, 'width', width);

  return videoElement;
};

/**
 * get the percent loaded if duration is available
 *
 * @param {HTMLElement} player
 * @return {number}
 */
var getPercentLoaded = function getPercentLoaded(player) {
  var duration = player.duration;

  if (duration) {
    var buffered = player.buffered;
    var percentLoaded = buffered.end(0) / duration;

    return Math.round(percentLoaded * 10000) / 100;
  }

  return 0;
};

/**
 * convenience function to wrap even with explicit this
 * as vidzInstance
 *
 * @param {Vidz} vidzInstance
 * @param {function} method
 * @return {function(e): void}
 */
var wrapSimpleVideoEvent = function wrapSimpleVideoEvent(vidzInstance, method) {
  return function (e) {
    method.call(vidzInstance, e, vidzInstance);
  };
};

/**
 *
 * @param {Vidz} vidzInstance
 * @param {object} events
 * @param {function} [events.onCanPlayThrough]
 * @param {function} [events.onEnded]
 * @param {function} [events.onError]
 * @param {function} [events.onLoadedMetadata]
 * @param {function} [events.onPause]
 * @param {function} [events.onPlay]
 * @param {function} [events.onProgress]
 * @param {function} [events.onWaiting]
 */
var setVideoEvents = function setVideoEvents(vidzInstance, events) {
  var onCanPlay = events.onCanPlay,
      onCanPlayThrough = events.onCanPlayThrough,
      onDurationChange = events.onDurationChange,
      onEmptied = events.onEmptied,
      onEnded = events.onEnded,
      onError = events.onError,
      onLoad = events.onLoad,
      onLoadedData = events.onLoadedData,
      onLoadedMetadata = events.onLoadedMetadata,
      onLoadStart = events.onLoadStart,
      onPause = events.onPause,
      onPlay = events.onPlay,
      onProgress = events.onProgress,
      onRateChange = events.onRateChange,
      onSeeked = events.onSeeked,
      onSeeking = events.onSeeking,
      onStalled = events.onStalled,
      onSuspend = events.onSuspend,
      onTimeUpdate = events.onTimeUpdate,
      onVolumeChange = events.onVolumeChange,
      onWaiting = events.onWaiting;


  var videoElement = vidzInstance.player;

  if (onCanPlay) {
    setElementEventListener(videoElement, 'canplay', wrapSimpleVideoEvent(vidzInstance, onCanPlay));
  }

  if (onCanPlayThrough) {
    setElementEventListener(videoElement, 'canplaythrough', wrapSimpleVideoEvent(vidzInstance, onCanPlayThrough));
  }

  setElementEventListener(videoElement, 'durationchange', function (e) {
    vidzInstance.duration = e.target.duration;
    vidzInstance.percentLoaded = getPercentLoaded(e.target);

    if (onDurationChange) {
      wrapSimpleVideoEvent(vidzInstance, onDurationChange)(e);
    }
  });

  if (onEmptied) {
    setElementEventListener(videoElement, 'emptied', wrapSimpleVideoEvent(vidzInstance, onEmptied));
  }

  if (onEnded) {
    setElementEventListener(videoElement, 'ended', wrapSimpleVideoEvent(vidzInstance, onEnded));
  }

  if (onError) {
    setElementEventListener(videoElement, 'error', wrapSimpleVideoEvent(vidzInstance, onError));
  }

  if (onLoad) {
    setElementEventListener(videoElement, 'load', wrapSimpleVideoEvent(vidzInstance, onLoad));
  }

  if (onLoadedData) {
    setElementEventListener(videoElement, 'loadeddata', wrapSimpleVideoEvent(vidzInstance, onLoadedData));
  }

  if (onLoadedMetadata) {
    setElementEventListener(videoElement, 'loadedmetadata', wrapSimpleVideoEvent(vidzInstance, onLoadedMetadata));
  }

  if (onLoadStart) {
    setElementEventListener(videoElement, 'loadstart', wrapSimpleVideoEvent(vidzInstance, onLoadStart));
  }

  if (onPause) {
    setElementEventListener(videoElement, 'pause', function (e) {
      if (vidzInstance.playing) {
        vidzInstance.playing = false;

        wrapSimpleVideoEvent(vidzInstance, onPause)(e);
      }
    });
  }

  if (onPlay) {
    setElementEventListener(videoElement, 'playing', function (e) {
      if (!vidzInstance.playing) {
        vidzInstance.playing = true;

        wrapSimpleVideoEvent(vidzInstance, onPlay)(e);
      }
    });
  }

  setElementEventListener(videoElement, 'progress', function (e) {
    vidzInstance.percentLoaded = getPercentLoaded(e.target);

    if (onProgress) {
      wrapSimpleVideoEvent(vidzInstance, onProgress)(e);
    }
  });

  if (onRateChange) {
    setElementEventListener(videoElement, 'ratechange', function (e) {
      vidzInstance.playbackRate = e.target.playbackRate;

      if (onRateChange) {
        wrapSimpleVideoEvent(vidzInstance, onRateChange)(e);
      }
    });
  }

  if (onSeeked) {
    setElementEventListener(videoElement, 'seeked', wrapSimpleVideoEvent(vidzInstance, onSeeked));
  }

  if (onSeeking) {
    setElementEventListener(videoElement, 'seeking', wrapSimpleVideoEvent(vidzInstance, onSeeking));
  }

  if (onStalled) {
    setElementEventListener(videoElement, 'stalled', wrapSimpleVideoEvent(vidzInstance, onStalled));
  }

  if (onSuspend) {
    setElementEventListener(videoElement, 'suspend', wrapSimpleVideoEvent(vidzInstance, onSuspend));
  }

  setElementEventListener(videoElement, 'timeupdate', function (e) {
    vidzInstance.currentTime = e.target.currentTime;

    if (onTimeUpdate) {
      wrapSimpleVideoEvent(vidzInstance, onTimeUpdate)(e);
    }
  });

  setElementEventListener(videoElement, 'volumechange', function (e) {
    vidzInstance.volume = e.target.volume;

    if (onVolumeChange) {
      wrapSimpleVideoEvent(vidzInstance, onVolumeChange)(e);
    }
  });

  if (onWaiting) {
    setElementEventListener(videoElement, 'waiting', wrapSimpleVideoEvent(vidzInstance, onWaiting));
  }
};

var Vidz = function () {
  /**
   * build the vidz instance with the appropriate elements, append the
   * elements to the parent provided by the selector, and then return
   * the instance
   *
   * @param {string|HTMLElement} selector
   * @param {object} config
   * @param {object} [config.attributes]
   * @param {boolean} [config.autoplay]
   * @param {boolean} [config.controls]
   * @param {number} [config.height]
   * @param {boolean} [config.loop]
   * @param {string} [config.mp4]
   * @param {boolean} [config.muted]
   * @param {string} [config.ogg]
   * @param {function} [config.onCanPlay]
   * @param {function} [config.onCanPlayThrough]
   * @param {function} [config.onDurationChange]
   * @param {function} [config.onEmptied]
   * @param {function} [config.onEnded]
   * @param {function} [config.onError]
   * @param {function} [config.onLoad]
   * @param {function} [config.onLoadedData]
   * @param {function} [config.onLoadedMetadata]
   * @param {function} [config.onLoadStart]
   * @param {function} [config.onPause]
   * @param {function} [config.onPlay]
   * @param {function} [config.onProgress]
   * @param {function} [config.onRateChange]
   * @param {function} [config.onSeeked]
   * @param {function} [config.onSeeking]
   * @param {function} [config.onStalled]
   * @param {function} [config.onSuspend]
   * @param {function} [config.onTimeUpdate]
   * @param {function} [config.onVolumeChange]
   * @param {function} [config.onWaiting]
   * @param {string} [config.poster]
   * @param {string} [config.preload]
   * @param {string} [config.webm]
   * @param {number} [config.width]
   * @return {Vidz}
   */
  function Vidz(selector) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Vidz);

    var element = void 0;

    switch (true) {
      case (0, _utils.isElement)(selector):
        element = selector;
        break;

      case (0, _utils.isString)(selector):
        element = document.querySelector(selector);
        break;

      case (0, _utils.isJqueryObject)(selector):
        element = selector[0];
        break;

      default:
        throw new Error('Selector passed must be either a DOM element, jQuery object, or string.');
    }

    var _config$attributes = config.attributes,
        attributes = _config$attributes === undefined ? {} : _config$attributes,
        _config$autoplay = config.autoplay,
        autoplay = _config$autoplay === undefined ? DEFAULT_ATTRIBUTES.AUTOPLAY : _config$autoplay,
        _config$controls = config.controls,
        controls = _config$controls === undefined ? DEFAULT_ATTRIBUTES.CONTROLS : _config$controls,
        _config$height = config.height,
        height = _config$height === undefined ? DEFAULT_ATTRIBUTES.HEIGHT : _config$height,
        _config$loop = config.loop,
        loop = _config$loop === undefined ? DEFAULT_ATTRIBUTES.LOOP : _config$loop,
        _config$mp = config.mp4,
        mp4 = _config$mp === undefined ? null : _config$mp,
        _config$muted = config.muted,
        muted = _config$muted === undefined ? DEFAULT_ATTRIBUTES.MUTED : _config$muted,
        _config$ogg = config.ogg,
        ogg = _config$ogg === undefined ? null : _config$ogg,
        _config$onCanPlay = config.onCanPlay,
        onCanPlay = _config$onCanPlay === undefined ? null : _config$onCanPlay,
        _config$onCanPlayThro = config.onCanPlayThrough,
        onCanPlayThrough = _config$onCanPlayThro === undefined ? null : _config$onCanPlayThro,
        _config$onDurationCha = config.onDurationChange,
        onDurationChange = _config$onDurationCha === undefined ? null : _config$onDurationCha,
        _config$onEmptied = config.onEmptied,
        onEmptied = _config$onEmptied === undefined ? null : _config$onEmptied,
        _config$onEnded = config.onEnded,
        onEnded = _config$onEnded === undefined ? null : _config$onEnded,
        _config$onError = config.onError,
        onError = _config$onError === undefined ? null : _config$onError,
        _config$onLoad = config.onLoad,
        onLoad = _config$onLoad === undefined ? null : _config$onLoad,
        _config$onLoadedData = config.onLoadedData,
        onLoadedData = _config$onLoadedData === undefined ? null : _config$onLoadedData,
        _config$onLoadedMetad = config.onLoadedMetadata,
        onLoadedMetadata = _config$onLoadedMetad === undefined ? null : _config$onLoadedMetad,
        _config$onLoadStart = config.onLoadStart,
        onLoadStart = _config$onLoadStart === undefined ? null : _config$onLoadStart,
        _config$onPause = config.onPause,
        onPause = _config$onPause === undefined ? null : _config$onPause,
        _config$onPlay = config.onPlay,
        onPlay = _config$onPlay === undefined ? null : _config$onPlay,
        _config$onProgress = config.onProgress,
        onProgress = _config$onProgress === undefined ? null : _config$onProgress,
        _config$onRateChange = config.onRateChange,
        onRateChange = _config$onRateChange === undefined ? null : _config$onRateChange,
        _config$onSeeked = config.onSeeked,
        onSeeked = _config$onSeeked === undefined ? null : _config$onSeeked,
        _config$onSeeking = config.onSeeking,
        onSeeking = _config$onSeeking === undefined ? null : _config$onSeeking,
        _config$onStalled = config.onStalled,
        onStalled = _config$onStalled === undefined ? null : _config$onStalled,
        _config$onSuspend = config.onSuspend,
        onSuspend = _config$onSuspend === undefined ? null : _config$onSuspend,
        _config$onTimeUpdate = config.onTimeUpdate,
        onTimeUpdate = _config$onTimeUpdate === undefined ? null : _config$onTimeUpdate,
        _config$onVolumeChang = config.onVolumeChange,
        onVolumeChange = _config$onVolumeChang === undefined ? null : _config$onVolumeChang,
        _config$onWaiting = config.onWaiting,
        onWaiting = _config$onWaiting === undefined ? null : _config$onWaiting,
        _config$poster = config.poster,
        poster = _config$poster === undefined ? null : _config$poster,
        _config$preload = config.preload,
        preload = _config$preload === undefined ? DEFAULT_ATTRIBUTES.PRELOAD : _config$preload,
        _config$swf = config.swf,
        swf = _config$swf === undefined ? null : _config$swf,
        _config$webm = config.webm,
        webm = _config$webm === undefined ? null : _config$webm,
        _config$width = config.width,
        width = _config$width === undefined ? DEFAULT_ATTRIBUTES.WIDTH : _config$width;


    Object.assign(this, {
      attributes: attributes,
      autoplay: autoplay,
      controls: controls,
      height: height,
      loop: loop,
      mp4: mp4,
      muted: muted,
      ogg: ogg,
      onCanPlay: onCanPlay,
      onCanPlayThrough: onCanPlayThrough,
      onEmptied: onEmptied,
      onEnded: onEnded,
      onError: onError,
      onLoad: onLoad,
      onLoadStart: onLoadStart,
      onLoadedData: onLoadedData,
      onLoadedMetadata: onLoadedMetadata,
      onPause: onPause,
      onPlay: onPlay,
      onProgress: onProgress,
      onRateChange: onRateChange,
      onSeeked: onSeeked,
      onSeeking: onSeeking,
      onStalled: onStalled,
      onSuspend: onSuspend,
      onTimeUpdate: onTimeUpdate,
      onVolumeChange: onVolumeChange,
      onWaiting: onWaiting,
      poster: poster,
      preload: preload,
      swf: swf,
      webm: webm,
      width: width
    });

    this.currentTime = 0;
    this.duration = null;
    this.element = element;
    this.height = height;
    this.muted = muted;
    this.percentLoaded = 0;
    this.playing = autoplay;
    this.playbackRate = 1;
    this.selector = selector;
    this.volume = 1;
    this.width = width;

    var videoElement = getVideoElement({
      autoplay: autoplay,
      controls: controls,
      height: height,
      loop: loop,
      muted: muted,
      preload: preload,
      width: width
    });

    for (var key in attributes) {
      setElementAttribute(videoElement, key, attributes[key]);
    }

    if (poster) {
      setElementAttribute(videoElement, 'poster', poster);
    }

    if (mp4) {
      var mp4Element = getSourceElement(mp4, SOURCE_TYPES.MP4);

      videoElement.appendChild(mp4Element);
    }

    if (webm) {
      var webmElement = getSourceElement(webm, SOURCE_TYPES.WEBM);

      videoElement.appendChild(webmElement);
    }

    if (ogg) {
      var oggElement = getSourceElement(ogg, SOURCE_TYPES.OGG);

      videoElement.appendChild(oggElement);
    }

    if (swf) {
      if (!mp4) {
        throw new Error('If you want a Flash fallback, you need to provide a video source in mp4 format.');
      }

      var flashFallbackElement = getObjectElement({
        autoplay: autoplay,
        controls: controls,
        height: height,
        mp4: mp4,
        poster: poster,
        swf: swf,
        width: width
      });

      videoElement.appendChild(flashFallbackElement);
    }

    this.player = videoElement;
    this.supportsHtml5Video = typeof (0, _utils.createNewElement)(ELEMENT_TYPES.VIDEO).canPlayType !== 'undefined';

    setVideoEvents(this, {
      onCanPlay: onCanPlay,
      onCanPlayThrough: onCanPlayThrough,
      onDurationChange: onDurationChange,
      onEmptied: onEmptied,
      onEnded: onEnded,
      onError: onError,
      onLoad: onLoad,
      onLoadStart: onLoadStart,
      onLoadedData: onLoadedData,
      onLoadedMetadata: onLoadedMetadata,
      onPause: onPause,
      onPlay: onPlay,
      onProgress: onProgress,
      onRateChange: onRateChange,
      onSeeked: onSeeked,
      onSeeking: onSeeking,
      onStalled: onStalled,
      onSuspend: onSuspend,
      onTimeUpdate: onTimeUpdate,
      onVolumeChange: onVolumeChange,
      onWaiting: onWaiting
    });

    if (element) {
      element.appendChild(videoElement);
    }

    return this;
  }

  /**
   * append the player as a child to the element
   *
   * @returns {Vidz}
   */


  Vidz.prototype.add = function add() {
    if (this.element) {
      this.element.appendChild(this.player);
    }

    return this;
  };

  /**
   * returns whether the player has the ability to play
   * the format passed
   *
   * @param {string} format
   * @return {boolean}
   */


  Vidz.prototype.canPlayType = function canPlayType(format) {
    return this.player.canPlayType(format);
  };

  /**
   *
   * @return {*|TimeRanges}
   */


  Vidz.prototype.getBuffered = function getBuffered() {
    return this.player.buffered;
  };

  /**
   * return the amount of time that has played in the video
   *
   * @return {number}
   */


  Vidz.prototype.getCurrentTime = function getCurrentTime() {
    return this.currentTime;
  };

  /**
   * return the length of the entire video
   *
   * @return {number}
   */


  Vidz.prototype.getDuration = function getDuration() {
    return this.duration;
  };

  /**
   * return the <object> flash fallback
   *
   * @return {HTMLElement}
   */


  Vidz.prototype.getFlashObject = function getFlashObject() {
    return this.player.querySelector(ELEMENT_TYPES.OBJECT);
  };

  /**
   * return the % loaded (rounded to two decimals)
   *
   * @return {number}
   */


  Vidz.prototype.getPercentLoaded = function getPercentLoaded() {
    return this.percentLoaded;
  };

  /**
   * return the playback rate for the video (1 is standard speed)
   *
   * @return {number}
   */


  Vidz.prototype.getPlaybackRate = function getPlaybackRate() {
    return this.player.playbackRate;
  };

  /**
   * return the player element
   *
   * @return {HTMLElement}
   */


  Vidz.prototype.getPlayer = function getPlayer() {
    return this.player;
  };

  /**
   * return the dimensions of the <video> element
   *
   * @return {{height: number, width: number}}
   */


  Vidz.prototype.getPlayerDimensions = function getPlayerDimensions() {
    return {
      height: this.height,
      width: this.width
    };
  };

  /**
   * get the source file locations for each type
   *
   * @return {{mp4: string, ogg: string, webm: string}}
   */


  Vidz.prototype.getSource = function getSource() {
    return {
      mp4: this.mp4,
      ogg: this.ogg,
      webm: this.webm
    };
  };

  /**
   * get the actual dimensions of the video (not the player)
   *
   * @return {{height: number, width: number}}
   */


  Vidz.prototype.getVideoDimensions = function getVideoDimensions() {
    return {
      height: this.player.videoHeight,
      width: this.player.videoWidth
    };
  };

  /**
   * return the volume level of the video
   *
   * @return {number}
   */


  Vidz.prototype.getVolume = function getVolume() {
    return this.player.volume;
  };

  /**
   * load the player sources
   *
   * @returns {Vidz}
   */


  Vidz.prototype.load = function load() {
    this.player.load();

    if (this.onLoad) {
      this.onLoad(this);
    }

    return this;
  };

  /**
   * set the player to be muted
   *
   * @return {Vidz}
   */


  Vidz.prototype.mute = function mute() {
    if (!this.muted) {
      this.player.muted = true;
      this.muted = true;
    }

    return this;
  };

  /**
   * pause the player
   *
   * @returns {Vidz}
   */


  Vidz.prototype.pause = function pause() {
    this.player.pause();

    return this;
  };

  /**
   * start the player
   *
   * @returns {Vidz}
   */


  Vidz.prototype.play = function play() {
    this.player.play();

    return this;
  };

  /**
   * remove the player from the parent it was appended to
   *
   * @returns {Vidz}
   */


  Vidz.prototype.remove = function remove() {
    if (this.player.parentNode) {
      this.player.parentNode.removeChild(this.player);
    }

    return this;
  };

  /**
   * restart the video from the beginning
   *
   * @return {Vidz}
   */


  Vidz.prototype.restart = function restart() {
    return this.setCurrentTime(0);
  };

  /**
   * set the place in the video to jump to
   *
   * @param {number} value
   * @return {Vidz}
   */


  Vidz.prototype.setCurrentTime = function setCurrentTime(value) {
    this.player.currentTime = value;
    this.currentTime = value;

    return this;
  };

  /**
   * set the playback rate to a value, capping between 0.25 and 16
   *
   * @param {number} value=1
   * @return {Vidz}
   */


  Vidz.prototype.setPlaybackRate = function setPlaybackRate() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var validValue = value;

    if (value <= 0.25) {
      validValue = 0.25;
    } else if (value >= 16) {
      validValue = 16;
    }

    this.player.playbackRate = validValue;
    this.playbackRate = validValue;

    return this;
  };

  /**
   * set new height / width values for the player and instance
   *
   * @param {number} height
   * @param {number} width
   * @return {Vidz}
   */


  Vidz.prototype.setPlayerDimensions = function setPlayerDimensions(_ref3) {
    var height = _ref3.height,
        width = _ref3.width;

    if (!(0, _utils.isUndefined)(height)) {
      setElementAttribute(this.player, 'height', height);

      this.height = height;
    }

    if (!(0, _utils.isUndefined)(width)) {
      setElementAttribute(this.player, 'width', width);

      this.width = width;
    }

    return this;
  };

  /**
   * set the source to the new value and reload it
   *
   * @param {string} mp4
   * @param {string} ogg
   * @param {string} webm
   * @return {Vidz}
   */


  Vidz.prototype.setSource = function setSource(_ref4) {
    var mp4 = _ref4.mp4,
        ogg = _ref4.ogg,
        webm = _ref4.webm;

    var sources = this.player.querySelectorAll('source');
    var length = sources.length;

    var index = -1;

    while (++index < length) {
      var source = sources[index];

      switch (source.type) {
        case SOURCE_TYPES.MP4:
          if (mp4) {
            setElementAttribute(source, 'src', mp4);
            this.mp4 = mp4;
          }

          break;

        case SOURCE_TYPES.OGG:
          if (ogg) {
            setElementAttribute(source, 'src', ogg);
            this.ogg = ogg;
          }

          break;

        case SOURCE_TYPES.WEBM:
          if (webm) {
            setElementAttribute(source, 'src', webm);
            this.webm = webm;
          }

          break;
      }
    }

    if (mp4) {
      var currentObjectElement = this.player.querySelector('object');
      var newObjectElement = getObjectElement({
        autoplay: this.autoplay,
        controls: this.controls,
        height: this.height,
        mp4: mp4,
        poster: this.poster,
        swf: this.swf,
        width: this.width
      });

      this.player.removeChild(currentObjectElement);
      this.player.appendChild(newObjectElement);
    }

    return this.load();
  };

  /**
   * set the volume to a number between 0 and 1
   *
   * @param {number} value=1
   * @return {Vidz}
   */


  Vidz.prototype.setVolume = function setVolume() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var volume = value;

    if (value < 0) {
      volume = 0;
    } else if (value > 1) {
      volume = 1;
    }

    this.player.volume = volume;
    this.volume = volume;

    return this;
  };

  /**
   * set the player to be unmuted
   *
   * @return {Vidz}
   */


  Vidz.prototype.unmute = function unmute() {
    if (this.muted) {
      this.player.muted = false;
      this.muted = false;
    }

    return this;
  };

  return Vidz;
}();

/**
 * convenience function, so devs don't need to run new Vidz() every time
 *
 * @param {string} selector
 * @param {object} config
 * @return {Vidz}
 */


var vidz = function vidz(selector, config) {
  return new Vidz(selector, config);
};

exports.getObjectElement = getObjectElement;
exports.getSourceElement = getSourceElement;
exports.getVideoElement = getVideoElement;
exports.setElementAttribute = setElementAttribute;
exports.setVideoEvents = setVideoEvents;
exports.Vidz = Vidz;
exports.default = vidz;

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * return string form of object type
 *
 * @param {any} object
 * @return {string}
 */
var toString = function toString(object) {
  return Object.prototype.toString.call(object);
};

/**
 * create a new element and return it
 *
 * @param {string} element
 * @return {HTMLElement}
 */
var createNewElement = function createNewElement(element) {
  return document.createElement(element);
};

/**
 * determine if the object is an HTMLElement
 *
 * @param {any} object
 * @return {boolean}
 */
var isElement = function isElement(object) {
  return (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? object instanceof HTMLElement : !!object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.nodeType === 1 && typeof object.nodeName === 'string';
};

/**
 * determine if the object is a jQuery object
 *
 * @param {any} object
 * @return {boolean}
 */
var isJqueryObject = function isJqueryObject(object) {
  return 'jquery' in Object(object);
};

/**
 * determine if object is a string
 *
 * @param {any} object
 * @return {boolean}
 */
var isString = function isString(object) {
  return toString(object) === '[object String]';
};

/**
 * determine if object is undefined
 *
 * @param {any} object
 * @return {boolean}
 */
var isUndefined = function isUndefined(object) {
  return object === void 0;
};

exports.createNewElement = createNewElement;
exports.isElement = isElement;
exports.isJqueryObject = isJqueryObject;
exports.isString = isString;
exports.isUndefined = isUndefined;
exports.toString = toString;
exports.default = {
  createNewElement: createNewElement,
  isElement: isElement,
  isString: isString,
  isUndefined: isUndefined,
  toString: toString
};

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/tquetano/git/vidz/src/index.js */"./src/index.js");


/***/ })

/******/ });
});
//# sourceMappingURL=vidz.js.map