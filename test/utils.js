import test from 'ava';

import $ from 'jquery';

import {
  createNewElement,
  isElement,
  isJqueryObject,
  isString,
  isUndefined,
  toString
} from '../src/utils';

const ARRAY_TOSTRING_VALUE = '[object Array]';
const OBJECT_TOSTRING_VALUE = '[object Object]';
const STRING_TOSTRING_VALUE = '[object String]';

let div;

test('if createNewElement successfully creates an HTMLElement', (t) => {
  div = createNewElement('div');

  t.is(div.nodeType, 1);
});

test('if isElement validates that the div is an HTMLElement but no other object is', (t) => {
  t.true(isElement(div));
  t.false(isElement('div'));
  t.false(isElement(true));
  t.false(isElement(undefined));
  t.false(isElement(null));
  t.false(isElement(1));
  t.false(isElement({}));
  t.false(isElement([]));
  t.false(isElement($('<div/>')));
});

test('if isJqueryObject validates that the jQuery-built div is a jQuery object but no other object is', (t) => {
  t.false(isJqueryObject(div));
  t.false(isJqueryObject('div'));
  t.false(isJqueryObject(true));
  t.false(isJqueryObject(undefined));
  t.false(isJqueryObject(null));
  t.false(isJqueryObject(1));
  t.false(isJqueryObject({}));
  t.true(isJqueryObject($('<div/>')));
});

test('if isString validates that the string is a string but no other object is', (t) => {
  t.false(isString(div));
  t.true(isString('div'));
  t.false(isString(true));
  t.false(isString(undefined));
  t.false(isString(null));
  t.false(isString(1));
  t.false(isString({}));
  t.false(isString($('<div/>')));
});

test('if isUndefined validates the undefined value as undefined but no other object is', (t) => {
  t.false(isUndefined(div));
  t.false(isUndefined('div'));
  t.false(isUndefined(true));
  t.true(isUndefined(undefined));
  t.false(isUndefined(null));
  t.false(isUndefined(1));
  t.false(isUndefined({}));
  t.false(isUndefined($('<div/>')));
});

test('if toString returns the correct values', (t) => {
  const string = toString('test');
  const object = toString({});
  const array = toString([]);

  t.is(array, ARRAY_TOSTRING_VALUE);
  t.is(object, OBJECT_TOSTRING_VALUE);
  t.is(string, STRING_TOSTRING_VALUE);
});