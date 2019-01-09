/**
 * return string form of object type
 *
 * @param {any} object
 * @return {string}
 */
const toString = (object) => Object.prototype.toString.call(object);

/**
 * create a new element and return it
 *
 * @param {string} element
 * @return {HTMLElement}
 */
const createNewElement = (element) => document.createElement(element);

/**
 * determine if the object is an HTMLElement
 *
 * @param {any} object
 * @return {boolean}
 */
const isElement = (object) =>
  typeof HTMLElement === 'object'
    ? object instanceof HTMLElement
    : !!object
      && typeof object === 'object'
      && object !== null
      && object.nodeType === 1
      && typeof object.nodeName === 'string';

/**
 * determine if the object is a jQuery object
 *
 * @param {any} object
 * @return {boolean}
 */
const isJqueryObject = (object) => 'jquery' in Object(object);

/**
 * determine if object is a string
 *
 * @param {any} object
 * @return {boolean}
 */
const isString = (object) => toString(object) === '[object String]';

/**
 * determine if object is undefined
 *
 * @param {any} object
 * @return {boolean}
 */
const isUndefined = (object) => object === void 0;

export {createNewElement};
export {isElement};
export {isJqueryObject};
export {isString};
export {isUndefined};
export {toString};

export default {
  createNewElement,
  isElement,
  isString,
  isUndefined,
  toString,
};
