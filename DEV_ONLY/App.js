import $ from 'jquery';
import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';

import vidz from '../src';

const delayVolumeDown = (instance, shouldDecrease = false, hasRun = false) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentVolume = instance.getVolume();

      if (hasRun && currentVolume === 1) {
        resolve()
      } else if (!shouldDecrease) {
        instance.setVolume(currentVolume + 0.1);

        resolve(delayVolumeDown(instance, false, true));
      } else {
        instance.setVolume(currentVolume - 0.1);

        resolve(delayVolumeDown(instance, currentVolume >= 0.1, true));
      }
    }, 250);
  });
};

class App extends Component {
  componentDidMount() {
    let interval = null;

    const $div = $(this.refs.videoContainer);

    const video = vidz($div, {
      mp4: 'http://www.html5rocks.com/en/tutorials/video/basics/devstories.mp4',
      onPause() {
        console.log(this);
      },
      onPlay() {
        setTimeout(() => {
          this.mute();

          setTimeout(() => {
            this.unmute();

            delayVolumeDown(this, true);
          }, 3000);
        }, 3000);
      },
      poster: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150',
      swf: 'test.swf',
      webm: 'http://www.html5rocks.com/en/tutorials/video/basics/devstories.webm'
    });

    console.log(video);

    setTimeout(() => {
      video.setPlayerDimensions({
        height: 320,
        width: 600
      });
    }, 3000);
  }

  render() {
    return (
      <div>
        App

        <div
          id="video-container"
          ref="videoContainer"
        />
      </div>
    );
  }
}

const div = document.createElement('div');

div.id = 'app-container';

render((
  <App/>
), div);

document.body.appendChild(div);
