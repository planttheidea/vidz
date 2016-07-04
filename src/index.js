import {
  createNewElement,
  isElement,
  isJqueryObject,
  isString,
  isUndefined
} from './utils';

const ELEMENT_TYPES = {
  IMAGE: 'img',
  OBJECT: 'object',
  PARAM: 'param',
  SOURCE: 'source',
  VIDEO: 'video'
};

const SOURCE_TYPES = {
  MP4: 'video/mp4',
  OGG: 'video/ogg',
  WEBM: 'video/webm'
};

const DEFAULT_ATTRIBUTES = {
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
const setElementAttribute = (element, attribute, value) => {
  element.setAttribute(attribute, value);
};

/**
 * convenience function to add an event listener to an element
 *
 * @param {HTMLElement} element
 * @param {string} event
 * @param {function} handler
 */
const setElementEventListener = (element, event, handler) => {
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
const getSourceElement = (src, type) => {
  let element = createNewElement(ELEMENT_TYPES.SOURCE);

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
const getObjectElement = ({autoplay, controls, height, mp4, poster, swf, width}) => {
  let objectElement = createNewElement(ELEMENT_TYPES.OBJECT),
      movieParamElement = createNewElement(ELEMENT_TYPES.PARAM),
      flashvarsParamElement = createNewElement(ELEMENT_TYPES.PARAM);

  setElementAttribute(objectElement, 'data', swf);
  setElementAttribute(objectElement, 'height', height);
  setElementAttribute(objectElement, 'width', width);

  setElementAttribute(movieParamElement, 'name', 'movie');
  setElementAttribute(movieParamElement, 'value', swf);

  setElementAttribute(flashvarsParamElement, 'name', 'flashvars');

  const flashvarsObject = {
    autostart: autoplay ? true : null,
    controlbar: controls ? 'over' : null,
    image: poster,
    file: mp4
  };

  let flashvarsValue = '';

  for (let key in flashvarsObject) {
    const value = flashvarsObject[key];

    if (value) {
      if (flashvarsValue) {
        flashvarsValue += '&';
      }

      flashvarsValue += `${key}=${value}`;
    }
  }

  setElementAttribute(flashvarsParamElement, 'value', flashvarsValue);

  objectElement.appendChild(movieParamElement);
  objectElement.appendChild(flashvarsParamElement);

  if (poster) {
    let imageElement = createNewElement(ELEMENT_TYPES.IMAGE);

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
const getVideoElement = ({autoplay, controls, height, loop, muted, preload, width}) => {
  let videoElement = createNewElement(ELEMENT_TYPES.VIDEO);

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
const getPercentLoaded = (player) => {
  const duration = player.duration;

  if (duration) {
    const buffered = player.buffered;
    const percentLoaded = buffered.end(0) / duration;

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
const wrapSimpleVideoEvent = (vidzInstance, method) => {
  return (e) => {
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
const setVideoEvents = (vidzInstance, events) => {
  const {
    onCanPlay,
    onCanPlayThrough,
    onDurationChange,
    onEmptied,
    onEnded,
    onError,
    onLoad,
    onLoadedData,
    onLoadedMetadata,
    onLoadStart,
    onPause,
    onPlay,
    onProgress,
    onRateChange,
    onSeeked,
    onSeeking,
    onStalled,
    onSuspend,
    onTimeUpdate,
    onVolumeChange,
    onWaiting
  } = events;

  let videoElement = vidzInstance.player;

  if (onCanPlay) {
    setElementEventListener(videoElement, 'canplay', wrapSimpleVideoEvent(vidzInstance, onCanPlay));
  }

  if (onCanPlayThrough) {
    setElementEventListener(videoElement, 'canplaythrough', wrapSimpleVideoEvent(vidzInstance, onCanPlayThrough));
  }

  setElementEventListener(videoElement, 'durationchange', (e) => {
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
    setElementEventListener(videoElement, 'pause', (e) => {
      if (vidzInstance.playing) {
        vidzInstance.playing = false;
        
        wrapSimpleVideoEvent(vidzInstance, onPause)(e);
      }
    });
  }

  if (onPlay) {
    setElementEventListener(videoElement, 'playing', (e) => {
      if (!vidzInstance.playing) {
        vidzInstance.playing = true;

        wrapSimpleVideoEvent(vidzInstance, onPlay)(e);
      }
    });
  }

  setElementEventListener(videoElement, 'progress', (e) => {
    vidzInstance.percentLoaded = getPercentLoaded(e.target);

    if (onProgress) {
      wrapSimpleVideoEvent(vidzInstance, onProgress)(e);
    }
  });

  if (onRateChange) {
    setElementEventListener(videoElement, 'ratechange', (e) => {
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

  setElementEventListener(videoElement, 'timeupdate', (e) => {
    vidzInstance.currentTime = e.target.currentTime;

    if (onTimeUpdate) {
      wrapSimpleVideoEvent(vidzInstance, onTimeUpdate)(e);
    }
  });


  if (onVolumeChange) {
    setElementEventListener(videoElement, 'volumechange', wrapSimpleVideoEvent(vidzInstance, onVolumeChange));
  }

  if (onWaiting) {
    setElementEventListener(videoElement, 'waiting', wrapSimpleVideoEvent(vidzInstance, onWaiting));
  }
};

class Vidz {
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
  constructor(selector, config = {}) {
    let element;
    
    switch (true) {
      case isElement(selector):
        element = selector;
        break;

      case isString(selector):
        element = document.querySelector(selector);
        break;

      case isJqueryObject(selector):
        element = selector[0];
        break;

      default:
        throw new Error('Selector passed must be either a DOM element, jQuery object, or string.');
    }

    const {
      attributes = {},
      autoplay = DEFAULT_ATTRIBUTES.AUTOPLAY,
      controls = DEFAULT_ATTRIBUTES.CONTROLS,
      height = DEFAULT_ATTRIBUTES.HEIGHT,
      loop = DEFAULT_ATTRIBUTES.LOOP,
      mp4 = null,
      muted = DEFAULT_ATTRIBUTES.MUTED,
      ogg = null,
      onCanPlay = null,
      onCanPlayThrough = null,
      onDurationChange = null,
      onEmptied = null,
      onEnded = null,
      onError = null,
      onLoad = null,
      onLoadedData = null,
      onLoadedMetadata = null,
      onLoadStart = null,
      onPause = null,
      onPlay = null,
      onProgress = null,
      onRateChange = null,
      onSeeked = null,
      onSeeking = null,
      onStalled = null,
      onSuspend = null,
      onTimeUpdate = null,
      onVolumeChange = null,
      onWaiting = null,
      poster = null,
      preload = DEFAULT_ATTRIBUTES.PRELOAD,
      swf = null,
      webm = null,
      width = DEFAULT_ATTRIBUTES.WIDTH
    } = config;

    Object.assign(this, {
      attributes,
      autoplay,
      controls,
      height,
      loop,
      mp4,
      muted,
      ogg,
      onCanPlay,
      onCanPlayThrough,
      onEmptied,
      onEnded,
      onError,
      onLoad,
      onLoadedData,
      onLoadedMetadata,
      onLoadStart,
      onPause,
      onPlay,
      onProgress,
      onRateChange,
      onSeeked,
      onSeeking,
      onStalled,
      onSuspend,
      onTimeUpdate,
      onVolumeChange,
      onWaiting,
      poster,
      preload,
      swf,
      webm,
      width
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
    this.width = width;

    let videoElement = getVideoElement({
      autoplay,
      controls,
      height,
      loop,
      muted,
      preload,
      width
    });

    for (let key in attributes) {
      setElementAttribute(videoElement, key, attributes[key]);
    }

    if (poster) {
      setElementAttribute(videoElement, 'poster', poster);
    }

    if (mp4) {
      const mp4Element = getSourceElement(mp4, SOURCE_TYPES.MP4);

      videoElement.appendChild(mp4Element);
    }

    if (webm) {
      const webmElement = getSourceElement(webm, SOURCE_TYPES.WEBM);

      videoElement.appendChild(webmElement);
    }

    if (ogg) {
      const oggElement = getSourceElement(ogg, SOURCE_TYPES.OGG);

      videoElement.appendChild(oggElement);
    }

    if (swf) {
      if (!mp4) {
        throw new Error('If you want a Flash fallback, you need to provide a video source in mp4 format.');
      }

      const flashFallbackElement = getObjectElement({
        autoplay,
        controls,
        height,
        mp4,
        poster,
        swf,
        width
      });

      videoElement.appendChild(flashFallbackElement);
    }

    this.player = videoElement;
    this.supportsHtml5Video = typeof createNewElement(ELEMENT_TYPES.VIDEO).canPlayType !== 'undefined';

    setVideoEvents(this, {
      onCanPlay,
      onCanPlayThrough,
      onDurationChange,
      onEmptied,
      onEnded,
      onError,
      onLoad,
      onLoadedData,
      onLoadedMetadata,
      onLoadStart,
      onPause,
      onPlay,
      onProgress,
      onRateChange,
      onSeeked,
      onSeeking,
      onStalled,
      onSuspend,
      onTimeUpdate,
      onVolumeChange,
      onWaiting
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
  add() {
    if (this.element) {
      this.element.appendChild(this.player);
    }

    return this;
  }

  /**
   * returns whether the player has the ability to play
   * the format passed
   *
   * @param {string} format
   * @return {boolean}
   */
  canPlayType(format) {
    return this.player.canPlayType(format);
  }

  /**
   *
   * @return {*|TimeRanges}
   */
  getBuffered() {
    return this.player.buffered;
  }

  /**
   * return the amount of time that has played in the video
   *
   * @return {number}
   */
  getCurrentTime() {
    return this.currentTime;
  }

  /**
   * return the length of the entire video
   *
   * @return {number}
   */
  getDuration() {
    return this.duration;
  }

  /**
   * return the <object> flash fallback
   * 
   * @return {HTMLElement}
   */
  getFlashObject() {
    return this.player.querySelector(ELEMENT_TYPES.OBJECT);
  }

  /**
   * return the % loaded (rounded to two decimals)
   *
   * @return {number}
   */
  getPercentLoaded() {
    return this.percentLoaded;
  }

  /**
   * return the playback rate for the video (1 is standard speed)
   *
   * @return {number}
   */
  getPlaybackRate() {
    return this.player.playbackRate;
  }

  /**
   * return the player element
   *
   * @return {HTMLElement}
   */
  getPlayer() {
    return this.player;
  }

  /**
   * return the dimensions of the <video> element
   * 
   * @return {{height: number, width: number}}
   */
  getPlayerDimensions() {
    return {
      height: this.height,
      width: this.width
    };
  }

  /**
   * get the source file locations for each type
   * 
   * @return {{mp4: string, ogg: string, webm: string}}
   */
  getSource() {
    return {
      mp4: this.mp4,
      ogg: this.ogg,
      webm: this.webm
    };
  }

  /**
   * get the actual dimensions of the video (not the player)
   *
   * @return {{height: number, width: number}}
   */
  getVideoDimensions() {
    return {
      height: this.player.videoHeight,
      width: this.player.videoWidth
    };
  }

  /**
   * return the volume level of the video
   *
   * @return {number}
   */
  getVolume() {
    return this.player.volume;
  }

  /**
   * load the player sources
   *
   * @returns {Vidz}
   */
  load() {
    this.player.load();

    if (this.onLoad) {
      this.onLoad(this);
    }

    return this;
  }

  /**
   * set the player to be muted
   *
   * @return {Vidz}
   */
  mute() {
    if (!this.muted) {
      this.player.muted = true;
      this.muted = true;
    }

    return this;
  }

  /**
   * pause the player
   *
   * @returns {Vidz}
   */
  pause() {
    this.player.pause();

    return this;
  }

  /**
   * start the player
   *
   * @returns {Vidz}
   */
  play() {
    this.player.play();

    return this;
  }

  /**
   * remove the player from the parent it was appended to
   *
   * @returns {Vidz}
   */
  remove() {
    if (this.player.parentNode) {
      this.player.parentNode.removeChild(this.player);
    }

    return this;
  }

  /**
   * restart the video from the beginning
   *
   * @return {Vidz}
   */
  restart() {
    return this.setCurrentTime(0);
  }

  /**
   * set the place in the video to jump to
   *
   * @param {number} value
   * @return {Vidz}
   */
  setCurrentTime(value) {
    this.player.currentTime = value;

    return this;
  }

  /**
   * set the playback rate to a value, capping between 0.25 and 16
   * 
   * @param {number} value=1
   * @return {Vidz}
   */
  setPlaybackRate(value = 1) {
    let validValue = value;

    if (value <= 0.25) {
      validValue = 0.25;
    } else if (value >= 16) {
      validValue = 16;
    }

    this.player.playbackRate = validValue;
    this.playbackRate = validValue;

    return this;
  }

  /**
   * set new height / width values for the player and instance
   *
   * @param {number} height
   * @param {number} width
   * @return {Vidz}
   */
  setPlayerDimensions({height, width}) {
    if (!isUndefined(height)) {
      setElementAttribute(this.player, 'height', height);

      this.height = height;
    }

    if (!isUndefined(width)) {
      setElementAttribute(this.player, 'width', width);

      this.width = width;
    }

    return this;
  }

  /**
   * set the source to the new value and reload it
   * 
   * @param {string} mp4
   * @param {string} ogg
   * @param {string} webm
   * @return {Vidz}
   */
  setSource({mp4, ogg, webm}) {
    const sources = this.player.querySelectorAll('source');
    const length = sources.length;

    let index = -1;

    while (++index < length) {
      let source = sources[index];

      switch (source.type) {
        case SOURCE_TYPES.MP4:
          if (mp4) {
            setElementAttribute(source, 'src', mp4);
          }

          break;

        case SOURCE_TYPES.OGG:
          if (ogg) {
            setElementAttribute(source, 'src', ogg);
          }

          break;

        case SOURCE_TYPES.WEBM:
          if (webm) {
            setElementAttribute(source, 'src', webm);
          }

          break;
      }
    }

    if (mp4) {
      const currentObjectElement = this.player.querySelector('object');
      const newObjectElement = getObjectElement({
        autoplay: this.autoplay,
        controls: this.controls,
        height: this.height,
        mp4,
        poster: this.poster,
        swf: this.swf,
        width: this.width
      });

      this.player.removeChild(currentObjectElement);
      this.player.appendChild(newObjectElement);
    }

    return this.load();
  }

  /**
   * set the volume to a number between 0 and 1
   * 
   * @param {number} value=1
   * @return {Vidz}
   */
  setVolume(value = 1) {
    if (value < 0) {
      this.player.volume = 0;
    } else if (value > 1) {
      this.player.volume = 1;
    } else {
      this.player.volume = value;
    }

    return this;
  }

  /**
   * set the player to be unmuted
   * 
   * @return {Vidz}
   */
  unmute() {
    if (this.muted) {
      this.player.muted = false;
      this.muted = false;
    }

    return this;
  }
}

/**
 * convenience function, so devs don't need to run new Vidz() every time
 *
 * @param {string} selector
 * @param {object} config
 * @return {Vidz}
 */
const vidz = (selector, config) => {
  return new Vidz(selector, config);
};

export {getObjectElement};
export {getSourceElement};
export {getVideoElement};
export {setElementAttribute};
export {setVideoEvents};
export {Vidz};

export default vidz;
