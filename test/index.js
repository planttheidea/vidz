import test from 'ava';
import sinon from 'sinon';

import vidz, {
  getObjectElement,
  getSourceElement,
  getVideoElement,
  setElementAttribute,
  setVideoEvents,
  Vidz
} from '../src/index';

import {
  createNewElement,
  isElement
} from '../src/utils';

const sleep = (ms = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

test('if vidz creates a new Vidz instance', (t) => {
  const instance = vidz('#some-selector');

  t.true(instance instanceof Vidz);
});

test('if getObjectElement returns an object element with params children', (t) => {
  const objectElement = getObjectElement({
    autoplay: true,
    controls: true,
    height: 400,
    mp4: 'test.mp4',
    poster: 'test.jpg',
    swf: 'test.swf',
    width: 600
  });

  const expectedHtml = '<object data=\"test.swf\" height=\"400\" width=\"600\"><param name=\"movie\" value=\"test.swf\"><param name=\"flashvars\" value=\"autostart=true&amp;controlbar=over&amp;image=test.jpg&amp;file=test.mp4\"><img alt=\"Video is unavailable.\" height=\"400\" src=\"test.jpg\" title=\"We cannot provide playback capabilities at this time.\" width=\"600\"></object>';

  const div = createNewElement('div');

  div.appendChild(objectElement);

  t.is(div.innerHTML, expectedHtml);
});

test('if getSourceElement returns a source element with appropriate attributes', (t) => {
  const sourceElement = getSourceElement('test.mp4', 'video/mp4');
  const expectedContents = '<source src="test.mp4" type="video/mp4">';

  const div = createNewElement('div');

  div.appendChild(sourceElement);

  t.is(div.innerHTML, expectedContents);
});

test('if getVideoElement returns a video element with appropriate children and attributes', (t) => {
  const videoElement = getVideoElement({
    controls: true,
    height: 600,
    preload: 'auto',
    autoplay: true,
    muted: true,
    loop: true,
    width: 800
  });
  const expectedContents = '<video autoplay="" controls="" loop="" muted="" height="600" preload="auto" width="800"></video>';

  const div = createNewElement('div');

  div.appendChild(videoElement);

  t.is(div.innerHTML, expectedContents);
});

test('if setElementAttribute sets an element\'s attribute correctly', (t) => {
  const div = createNewElement('div');
  const attributeValue = 'test-attribute-setting';

  setElementAttribute(div, 'id', attributeValue);

  t.is(div.id, attributeValue);
});

test.skip('if events are bound to player instance', async (t) => {
  let onPlayFired = false;

  const div = createNewElement('div');

  document.body.appendChild(div);

  const instance = vidz(div, {
    onPlay() {
      console.log('fired');

      onPlayFired = true;
    },
    mp4: 'test.mp4'
  });

  instance.play();

  await sleep(1000);

  t.true(onPlayFired);
});

test('Vidz prototypical methods', (t) => {
  const div = createNewElement('div');

  const instance = vidz(div, {
    mp4: 'test.mp4',
    ogg: 'test.ogv',
    swf: 'test.swf'
  });

  t.true(isElement(instance.player));

  const instanceHtml = '<video controls=\"\" height=\"400\" preload=\"auto\" width=\"600\"><source src=\"test.mp4\" type=\"video/mp4\"><source src=\"test.ogv\" type=\"video/ogg\"><object data=\"test.swf\" height=\"400\" width=\"600\"><param name=\"movie\" value=\"test.swf\"><param name=\"flashvars\" value=\"controlbar=over&amp;file=test.mp4\"></object></video>';

  instance.remove();

  t.is(div.innerHTML, '');

  instance.add();

  t.is(div.innerHTML, instanceHtml);
  t.is(instance.getCurrentTime(), 0);
  t.is(instance.getPlaybackRate(), 1);
  t.is(instance.getPlayer(), instance.player);
  t.deepEqual(instance.getPlayerDimensions(), {
    height: 400,
    width: 600
  });
  t.is(instance.getVolume(), 1);

  // dimensions are 0 because the file doesn't exist
  t.deepEqual(instance.getVideoDimensions(), {
    height: 0,
    width: 0
  });

  t.is(instance.getVolume(), 1);

  const loadSpy = sinon.spy(instance, 'load');
  const playSpy = sinon.spy(instance, 'play');
  const pauseSpy = sinon.spy(instance, 'pause');

  instance.load();
  instance.play();
  instance.pause();

  t.true(loadSpy.calledOnce);
  t.true(playSpy.calledOnce);
  t.true(pauseSpy.calledOnce);

  loadSpy.restore();
  playSpy.restore();
  pauseSpy.restore();

  instance.setPlayerDimensions({
    height: 320,
    width: 600
  });

  t.deepEqual(instance.getPlayerDimensions(), {
    height: 320,
    width: 600
  });

  instance.setSource({
    mp4: 'test2.mp4'
  });

  const newInstanceHtml = '<video controls=\"\" height=\"320\" preload=\"auto\" width=\"600\"><source src=\"test2.mp4\" type=\"video/mp4\"><source src=\"test.ogv\" type=\"video/ogg\"><object data=\"test.swf\" height=\"320\" width=\"600\"><param name=\"movie\" value=\"test.swf\"><param name=\"flashvars\" value=\"controlbar=over&amp;file=test2.mp4\"></object></video>';

  const anotherDiv = createNewElement('div');

  anotherDiv.appendChild(instance.player);

  t.is(anotherDiv.innerHTML, newInstanceHtml);
});